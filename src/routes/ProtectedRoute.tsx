import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { adminService }
  from "../services/adminService";

import { customerService }
  from "../services/customerService";

function ProtectedRoute() {
  const location = useLocation();

  if (
    location.pathname.startsWith(
      "/admin",
    )
  ) {
    return adminService.isLoggedIn()
      ? <Outlet />
      : (
        <Navigate
          to="/admin/login"
          replace
        />
      );
  }

  if (
    location.pathname.startsWith(
      "/customer",
    )
  ) {
    return customerService.isLoggedIn()
      ? <Outlet />
      : (
        <Navigate
          to="/customer/login"
          replace
        />
      );
  }

  return <Outlet />;
}

export default ProtectedRoute;