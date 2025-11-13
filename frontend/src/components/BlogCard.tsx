import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";
import { Date } from "./Date";
import { Like } from "./Like";
import { SavePost } from "./SavePost";
import { Follow } from "./Follow";

interface BlogCardBinds {
  authorName: string;
  avatar: string;
  title: string;
  content: string;
  publishedDate: string;
  id: string;
  authorId: string;
  img?: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  viewCount?: number;
  hasLiked: boolean;
  hasSaved: boolean;
  hasFollowed: boolean;
  himself: boolean;
}

function stripHtmlTags(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export function BlogCard({
  authorName,
  avatar,
  title,
  content,
  publishedDate,
  id,
  authorId,
  img,
  tags,
  likeCount,
  commentCount,
  viewCount,
  hasLiked,
  hasSaved,
  hasFollowed,
  himself,
}: BlogCardBinds) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Image at the top - full width */}
      <Link to={`/blog/${id}`}>
        {img ? (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-5">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Link to={`/users/profile/${authorId}`}>
              <Avatar size={"sm"} avatar={avatar}></Avatar>
            </Link>
            <div className="flex flex-col">
              {himself ? (
                <Link to={`/profile`}>
                  <div className="font-semibold text-sm hover:underline text-gray-900">
                    {authorName}
                  </div>
                </Link>
              ) : (
                <Link to={`/users/profile/${authorId}`}>
                  <div className="font-semibold text-sm hover:underline text-gray-900">
                    {authorName}
                  </div>
                </Link>
              )}
              <div className="text-xs text-gray-500">
                <Date date={publishedDate} size="sm"></Date>
              </div>
            </div>
          </div>
          {!himself && (
            <Follow hasFollowed={hasFollowed} followingId={authorId}></Follow>
          )}
        </div>

        {/* Title and Content */}
        <Link to={`/blog/${id}`}>
          <h2 className="font-bold text-xl mb-2 text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h2>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {(() => {
              const plainText = stripHtmlTags(content);
              return plainText.length > 150
                ? `${plainText.slice(0, 150)}...`
                : plainText;
            })()}
          </p>
        </Link>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {tags.slice(0, 3).map((tag, index) => (
              <TagStyle key={index} label={tag} />
            ))}
          </div>
        )}

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Like */}
            <Like likeCount={likeCount} hasLiked={hasLiked} postId={id} />
            
            {/* Comments */}
            <div className="flex items-center gap-1 text-gray-500 hover:text-gray-700 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
              <span className="text-sm">{commentCount}</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
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
              <span className="text-sm">{viewCount || 0}</span>
            </div>

            {/* Read time */}
            <div className="text-xs text-gray-500">
              {Math.ceil(content.length / 400)} min read
            </div>
          </div>

          {/* Save Button */}
          <SavePost hasSaved={hasSaved} postId={id} />
        </div>
      </div>
    </div>
  );
}

export const TagStyle = ({ label }: { label: string }) => {
  return (
    <Link to={`/tags/${label}`}>
      <span className="inline-block px-3 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition-colors">
        {label}
      </span>
    </Link>
  );
};
