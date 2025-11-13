import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function PublicAppbar() {
  const [active, setActive] = useState(false);
  const [searchType, setSearchType] = useState("Blogs");
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex items-center px-4 py-2 border-b-2 border-gray-200 bg-white fixed w-screen top-0 z-50 justify-between">
      <Link to={"/blogs"}>
        <div className="font-bold text-3xl ml-4 mr-10 cursor-pointer">
          Africa Daily Times
        </div>
      </Link>
      <div className="flex justify-between w-full">
        <form
          className=" flex-1 max-w-lg "
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex">
            <label
              htmlFor="search-dropdown"
              className="mb-2 text-sm font-medium text-gray-900 sr-only"
            >
              Search Categories
            </label>
            <button
              id="dropdown-button"
              onClick={() => setActive((prev: boolean) => !prev)}
              className=" cursor-pointer shrink-0 z-10 inline-flex justify-center items-center w-31 py-2.5 px-7 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
              type="button"
            >
              {searchType}{" "}
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div
              id="dropdown"
              className={`z-10 absolute top-13 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-31 ${
                active ? "" : "hidden"
              }`}
            >
              <ul
                className="py-2 text-sm text-gray-700"
                aria-labelledby="dropdown-button"
              >
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(false);
                      setSearchType("Users");
                    }}
                    className="inline-flex w-full px-9 py-2  hover:bg-gray-100 border-b-2 border-gray-100"
                  >
                    Users
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(false);
                      setSearchType("Blogs");
                    }}
                    className="inline-flex w-full px-9 py-2 hover:bg-gray-100 border-b-2 border-gray-100"
                  >
                    Blogs
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(false);
                      setSearchType("Tags");
                    }}
                    className="inline-flex w-full px-9 py-2 hover:bg-gray-100"
                  >
                    Tags
                  </button>
                </li>
              </ul>
            </div>
            <div className="relative w-full">
              <input
                type="search"
                id="search-dropdown"
                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Search Users or Blogs"
                required
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <button
                type="submit"
                className="cursor-pointer absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-black rounded-e-lg border border-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 "
                onClick={() => {
                  if (filter != "") {
                    if (searchType === "Users") {
                      navigate(`/users/filter/${filter}`);
                    } else if (searchType === "Blogs") {
                      navigate(`/blogs/${filter}`);
                    } else {
                      navigate(`/tags/${filter}`);
                    }
                  }
                }}
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
        </form>
        <div className="mr-4 gap-4 flex items-center">
          <Link to={"/signin"}>
            <button className="text-gray-700 hover:text-black font-medium text-base cursor-pointer">
              Sign in
            </button>
          </Link>
          <Link to={"/signup"}>
            <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 font-medium text-base">
              Get started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
