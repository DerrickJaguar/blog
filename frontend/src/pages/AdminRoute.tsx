import { Navigate } from "react-router-dom";

interface WrapperProp {
  children: React.ReactNode;
}

export function AdminRoute({ children }: WrapperProp) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/signin" />;
  }

  if (role !== "admin") {
    return <Navigate to="/blogs" />;
  }

  return children;
}
