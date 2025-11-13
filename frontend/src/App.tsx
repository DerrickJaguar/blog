import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { FilteredBlog } from "./pages/FilteredBlog";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { AdminRoute } from "./pages/AdminRoute";
import { TiptapEditor } from "./pages/Tiptap";
import { FilteredBlogByTag } from "./pages/FilteredBlogByTag";
import { Profile } from "./pages/Profile";
import { ProfileEdit } from "./pages/ProfileEdit";
import { OthersProfile } from "./pages/OthersProfile";
import { Notifications } from "./pages/Notification";
import { BlogEdit } from "./pages/BlogEdit";
import { UsersFilter } from "./pages/UsersFilter";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/blogs" />}
          ></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />}></Route>
          <Route path="/blogs/:filter" element={<FilteredBlog />}></Route>
          <Route path="/tags/:filter" element={<FilteredBlogByTag />}></Route>
          <Route path="/users/profile/:id" element={<OthersProfile />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/blogs/create"
            element={
              <AdminRoute>
                <TiptapEditor />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/users/profile/:id"
            element={<OthersProfile />}
          />
          <Route path="/users/filter/:filter" element={<UsersFilter />} />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/blog/edit/:id"
            element={
              <AdminRoute>
                <BlogEdit></BlogEdit>
              </AdminRoute>
            }
          ></Route>
          <Route path="/users/filter/:filter" element={<UsersFilter />} />
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
