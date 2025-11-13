import { useBlogs } from "../hooks/blog";
import { BlogCard, TagStyle } from "../components/BlogCard";
import { BACKEND_URL } from "../config";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { Appbar } from "../components/Appbar";
import { PublicAppbar } from "../components/PublicAppbar";
import { Pagination } from "../components/Pagination";
import { Repeat } from "../helperComponents/Repeat";
import { Skeleton } from "../components/Skeleton";
import type { Tag } from "../hooks/blog";
import type { fullBlogs } from "../hooks/blog";
import "../App.css";
import { useTrendingTags } from "../hooks/dashboard";
import { TrendingSection } from "../components/TrendingSection";
import { CategoriesNav } from "../components/CategoriesNav";

interface BlogRaw {
  title: string;
  content: string;
  id: string;
  authorId: string;
  createdAt: string;
  viewCount?: number;
  author: {
    id: string;
    name: string;
    profile: {
      imageUrl: string;
    };
  };
  tags: Tag[];
  imgUrl?: string;
  likeCount: number;
  commentCount: number;
  hasLiked: boolean;
  hasSaved: boolean;
  followedBack: boolean;
  himself: boolean;
}

export interface BlogAxiosRes {
  msg: string;
  blogs: BlogRaw[];
  page: number;
  pageSize: number;
  totalPage: number;
  total: number;
}
interface BlogResponse {
  blogs: fullBlogs[];
  totalPages: number;
}

export function Blogs() {
  const token = localStorage.getItem("token");
  const [page, setPage] = useState(1);
  const [techBlogs, setTechBlogs] = useState<fullBlogs[]>([]);
  const [techBlogsLoading, setTechBlogsLoading] = useState(true);
  const { trendingTags, tagsLoading } = useTrendingTags();
  
  const handleFetchingBulk = useCallback(
    async (page: number): Promise<BlogResponse> => {
      try {
        const headers: Record<string, string> = {};
        const token = localStorage.getItem("token");
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        const res = await axios.get<BlogAxiosRes>(
          `${BACKEND_URL}/api/v1/blog/bulk?page=${page}`,
          { headers }
        );
        const blogs: fullBlogs[] = res.data.blogs.map((blog) => ({
          ...blog,
          tags: blog.tags.map((tag) => tag.name),
        }));
        console.log(res.data.msg);
        return {
          blogs,
          totalPages: Math.ceil(res.data.total / res.data.pageSize),
        };
      } catch (e) {
        console.error("Error encountered while fetching blogs:", e);
        return {
          blogs: [],
          totalPages: 0,
        };
      }
    },
    []
  );
  const { loading, blogs, totalPages } = useBlogs(handleFetchingBulk, page);
  
  // Fetch tech blogs for sidebar
  const fetchTechBlogs = useCallback(async () => {
    setTechBlogsLoading(true);
    try {
      const headers: Record<string, string> = {};
      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const res = await axios.get<BlogAxiosRes>(
        `${BACKEND_URL}/api/v1/blog/tags/filter?tag=tech&page=1`,
        { headers }
      );
      const blogs: fullBlogs[] = res.data.blogs.map((blog) => ({
        ...blog,
        tags: blog.tags.map((tag) => tag.name),
      }));
      setTechBlogs(blogs.slice(0, 5)); // Get top 5 tech blogs
    } catch (e) {
      console.error("Error fetching tech blogs:", e);
      setTechBlogs([]);
    } finally {
      setTechBlogsLoading(false);
    }
  }, []);

  // Load tech blogs on component mount
  React.useEffect(() => {
    fetchTechBlogs();
  }, [fetchTechBlogs]);

  return (
    <div>
      {token ? <Appbar /> : <PublicAppbar />}
      
      {/* Categories Navigation */}
      <CategoriesNav />
      
      <div className="grid grid-cols-8 w-screen">
        <div className="col-span-6 flex flex-col items-center custom-scrollbar overflow-y-scroll h-screen max-xl:col-span-8">
          {/* Trending Section - MSN Style */}
          <div className="w-full max-w-7xl px-4 pt-8 mb-6">
            <TrendingSection />
          </div>

          {/* All Blogs Section */}
          {loading ? (
            <div className="mt-2 w-full max-w-7xl px-4">
              <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                <Repeat count={10}>
                  <Skeleton />
                </Repeat>
              </div>
            </div>
          ) : (
            <div className="mt-2 w-full max-w-7xl px-4">
              <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                {blogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    avatar={blog.author.profile?.imageUrl}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={blog.createdAt}
                    authorId={blog.authorId}
                    id={blog.id}
                    tags={blog.tags}
                    img={blog.imgUrl}
                    hasFollowed={blog.followedBack}
                    likeCount={blog.likeCount}
                    commentCount={blog.commentCount}
                    viewCount={blog.viewCount}
                    hasLiked={blog.hasLiked}
                    hasSaved={blog.hasSaved}
                    himself={blog.himself}
                  />
                ))}
              </div>
              {/* Pagination - Commented out for future use */}
              {/* <Pagination
                setPage={setPage}
                page={page}
                totalPages={totalPages}
              ></Pagination> */}
            </div>
          )}
        </div>
        <div className="col-span-2 border-l-2 max-xl:invisible border-gray-400 w-full custom-scrollbar overflow-y-auto h-screen pt-20 pb-10 px-5">
          {/* Featured Blogs Section - Visible to Everyone */}
          <div className="mt-2 border-b-2 border-gray-200 pb-5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
              Breaking News
            </h3>
            {loading ? (
              <div className="animate-pulse mb-4 pb-4 border-b border-gray-200">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ) : (
              <div>
                {blogs.slice(0, 1).map((blog) => (
                  <a
                    key={blog.id}
                    href={`/blog/${blog.id}`}
                    className="block mb-4 pb-4 border-b border-gray-200 hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <h4 className="font-medium text-sm mb-1.5 line-clamp-2 hover:underline">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{blog.author.name || "Anonymous"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                          <path d="M2 6.342a3.375 3.375 0 0 1 6-2.088 3.375 3.375 0 0 1 5.997 2.26c-.063 2.134-1.618 3.76-2.955 4.784a14.437 14.437 0 0 1-2.676 1.61c-.02.01-.038.017-.05.022l-.014.006-.004.002h-.002a.75.75 0 0 1-.592.001h-.002l-.004-.003-.015-.006a5.528 5.528 0 0 1-.232-.107 14.395 14.395 0 0 1-2.535-1.557C3.564 10.22 1.999 8.558 1.999 6.38L2 6.342Z" />
                        </svg>
                        {blog.likeCount}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Tech Section - Visible to Everyone */}
          <div className="mt-5 border-b-2 border-gray-200 pb-5">
            <div className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500">
                <path d="M16.5 7.5h-9v9h9v-9Z" />
                <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
              </svg>
              Tech
            </div>
            {techBlogsLoading ? (
              <Repeat count={2}>
                <div className="animate-pulse mb-3 pb-3 border-b border-gray-200">
                  <div className="h-3 bg-gray-300 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              </Repeat>
            ) : techBlogs.length > 0 ? (
              <div>
                {techBlogs.slice(0, 2).map((blog) => (
                  <a
                    key={blog.id}
                    href={`/blog/${blog.id}`}
                    className="block mb-3 pb-3 border-b border-gray-200 hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <h4 className="font-medium text-sm mb-1 line-clamp-2 hover:underline">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                          <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        {blog.viewCount || 0}
                      </span>
                      <span>•</span>
                      <span>{blog.author.name || "Anonymous"}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No tech blogs available</p>
            )}
          </div>

          {/* Trending Tags - Visible to Everyone */}
          <div className="border-b-2 border-gray-200 pb-3">
            <div className="text-lg font-medium mt-3">Trending Tags</div>
            {tagsLoading ? (
              <div className="animate-pulse max-w-lg mt-3 pb-2">
                <div className="flex items-center gap-3 flex-wrap h-full">
                  <Repeat count={10}>
                    <div className="bg-gray-300 rounded-full h-8.5 w-15.5" />
                  </Repeat>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex gap-x-5 gap-y-3 flex-wrap mt-3">
                  {trendingTags.slice(0, 10).map((t) => (
                    <TagStyle key={t} label={t} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Media Links - Visible to Everyone */}
          <div className="mt-4 pt-3">
            <div className="text-lg font-semibold text-gray-800 mb-3">Follow Us</div>
            <div className="flex gap-4 flex-wrap">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/people/Tiba-Health-Tech/100083037953529/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Twitter/X */}
              <a
                href="https://x.com/TibaHealthTech?s=20&t=EyMvlQc107vKtzDeFi_aHw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/tibahealthtech/?igshid=YmMyMTA2M2Y%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/tiba-health-tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/channel/UCmvsRXW-xRTBUl8Qxzlh28w/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://api.whatsapp.com/send/?phone=256780987222&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
