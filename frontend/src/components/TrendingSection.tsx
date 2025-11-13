import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface TrendingBlog {
  id: string;
  title: string;
  imgUrl?: string;
  createdAt: string;
  author: {
    name: string;
  };
  tags: { name: string }[];
  viewCount: number;
  likeCount: number;
}

export const TrendingSection = () => {
  const [trendingBlogs, setTrendingBlogs] = useState<TrendingBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingBlogs();
  }, []);

  const fetchTrendingBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, { headers });
      console.log("Trending blogs API response:", response.data); // Debug log
      
      // The API returns { blogs: [...] } not { posts: [...] }
      const blogs = response.data.blogs || [];
      console.log("Total blogs found:", blogs.length); // Debug log
      
      if (blogs.length === 0) {
        console.log("No blogs found in database!");
        setLoading(false);
        return;
      }
      
      // Map the blogs to match our interface
      const trendingBlogs = blogs.slice(0, 5).map((blog: any) => ({
        id: blog.id,
        title: blog.title,
        imgUrl: blog.imgUrl,
        createdAt: blog.createdAt,
        author: {
          name: blog.author.name,
        },
        tags: blog.tags.map((tag: any) => ({ name: tag.name })),
        viewCount: blog.viewCount || 0,
        likeCount: blog.likeCount || 0,
      }));
      
      console.log("Trending blogs to display:", trendingBlogs); // Debug log
      setTrendingBlogs(trendingBlogs);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch trending blogs:", error);
      setLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return posted.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="min-w-[350px] h-[200px] bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (trendingBlogs.length === 0) {
    return (
      <div className="py-8 border-b border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
        <p className="text-gray-500">No blogs available yet. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="py-8 border-b border-gray-200">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
        <Link to="/blogs" className="text-sm text-blue-600 hover:text-blue-800">
          See all →
        </Link>
      </div>

      {/* Horizontal Scrolling Cards - MSN Style */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {trendingBlogs.map((blog, index) => (
          <div
            key={blog.id}
            className={`flex-shrink-0 ${
              index === 0 ? "w-[600px]" : "w-[350px]"
            } group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300`}
          >
            <Link to={`/blog/${blog.id}`}>
              {/* Image Background */}
              <div className="relative h-[250px] overflow-hidden">
                {blog.imgUrl ? (
                  <img
                    src={blog.imgUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                )}
                
                {/* Dark Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  {/* Source and Time */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold bg-red-600 px-2 py-1 rounded">
                      {blog.tags && blog.tags.length > 0 ? blog.tags[0].name.toUpperCase() : "NEWS"}
                    </span>
                    <span className="text-xs opacity-90">
                      {blog.author.name}
                    </span>
                    <span className="text-xs opacity-75">•</span>
                    <span className="text-xs opacity-90">
                      {getTimeAgo(blog.createdAt)}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3
                    className={`font-bold ${
                      index === 0 ? "text-2xl" : "text-lg"
                    } leading-tight line-clamp-3 group-hover:text-blue-300 transition-colors`}
                  >
                    {blog.title}
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-2 text-xs opacity-90">
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                      <span>{blog.viewCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                      <span>{blog.likeCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
