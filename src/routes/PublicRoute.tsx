import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { adminService }
  from "../services/adminService";

import { customerService }
  from "../services/customerService";

function PublicRoute() {
  const location = useLocation();

  if (
    location.pathname.startsWith(
      "/admin",
    )
  ) {
    return adminService.isLoggedIn()
      ? (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      )
      : <Outlet />;
  }

  if (
    location.pathname.startsWith(
      "/customer",
    )
  ) {
    return customerService.isLoggedIn()
      ? (
        <Navigate
          to="/"
          replace
        />
      )
      : <Outlet />;
  }

  return <Outlet />;
}

export default PublicRoute;