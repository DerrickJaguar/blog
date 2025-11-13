import { Link } from "react-router-dom";
import { useState } from "react";

export const CategoriesNav = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showNewsSubmenu, setShowNewsSubmenu] = useState(false);

  // Categories with exact tag names that must be used when creating posts
  const categories = [
    { name: "Manager's Center", tag: "managers", path: "/tags/managers" },
    { name: "Personal Finance", tag: "finance", path: "/tags/finance" },
    { name: "Opinion", tag: "opinion", path: "/tags/opinion" },
    { name: "Health & Fitness", tag: "health", path: "/tags/health" },
    { name: "Technology & Innovation", tag: "innovation", path: "/tags/innovation" },
    { name: "AgriBusiness", tag: "agribusiness", path: "/tags/agribusiness" },
    { name: "Stock & Bond Market", tag: "stocks", path: "/tags/stock" },
  ];

  const newsCategories = [
    { name: "National", tag: "national", path: "/tags/national" },
    { name: "Regional", tag: "regional", path: "/tags/regional" },
    { name: "Africa", tag: "africa", path: "/tags/africa" },
    { name: "World", tag: "world", path: "/tags/world" },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg sticky top-16 z-[100]">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center justify-between overflow-x-auto scrollbar-hide py-3">
          <div className="flex items-center gap-6 min-w-max">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className={`text-sm font-medium transition-all duration-200 hover:text-blue-400 whitespace-nowrap ${
                  activeCategory === category.name
                    ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                    : "text-gray-200"
                }`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </Link>
            ))}

            {/* News Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowNewsSubmenu(true)}
              onMouseLeave={() => setShowNewsSubmenu(false)}
            >
              <button
                className={`text-sm font-medium transition-all duration-200 hover:text-blue-400 whitespace-nowrap flex items-center gap-1 ${
                  activeCategory?.startsWith("news-")
                    ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                    : "text-gray-200"
                }`}
              >
                News
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showNewsSubmenu ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showNewsSubmenu && (
                <div 
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 min-w-[180px]"
                  style={{ zIndex: 9999 }}
                >
                  {newsCategories.map((news) => (
                    <Link
                      key={news.name}
                      to={news.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => setActiveCategory(news.path)}
                    >
                      {news.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Browse All Link */}
          <Link
            to="/blogs"
            className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors whitespace-nowrap ml-6"
          >
            Browse All →
          </Link>
        </nav>
      </div>
    </div>
  );
};
