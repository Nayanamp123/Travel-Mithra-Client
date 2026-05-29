import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

import AdminLoginPage from "./pages/admin/adminLoginPage";

import CustomerLoginPage from "./pages/customer/CustomerLoginPage";
import CustomerBookingsPage from "./pages/CustomerBookingPage";

import HomePage from "./pages/customer/HomePage";

import BookingsManagementPage from "./pages/admin/BookingManagementPage";

import ProtectedRoute from "./routes/ProtectedRoute";

import PublicRoute from "./routes/PublicRoute";

import { initialPendingTrip } from "./data/tours";

import type { AuthMode, PendingTripSearch } from "./types/travel";

import UserPortal from "./pages/customer/CustomerPortalPage";
import CustomersManagementPage from "./pages/admin/CustomerManagementPage";

function HomeRoute() {
  const navigate = useNavigate();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const [tourFilter, setTourFilter] = useState("all");

  const [homeSearch, setHomeSearch] =
    useState<PendingTripSearch>(initialPendingTrip);

  useEffect(() => {
    const closeMenus = () => {
      setAccountMenuOpen(false);

      setFilterMenuOpen(false);
    };

    document.addEventListener("click", closeMenus);

    return () => document.removeEventListener("click", closeMenus);
  }, []);

  const openAdminLogin = (_mode?: AuthMode) => {
    navigate("/customer/login");
  };

  return (
    <HomePage
      accountMenuOpen={accountMenuOpen}
      filterMenuOpen={filterMenuOpen}
      homeSearch={homeSearch}
      tourFilter={tourFilter}
      onAuthOpen={openAdminLogin}
      onHomeSearchChange={setHomeSearch}
      onTourFilterChange={setTourFilter}
      onAccountMenuToggle={() => {
        setFilterMenuOpen(false);

        setAccountMenuOpen((current) => !current);
      }}
      onFilterMenuToggle={() => setFilterMenuOpen((current) => !current)}
      onAccountMenuClose={() => setAccountMenuOpen(false)}
      onFilterMenuClose={() => setFilterMenuOpen(false)}
      onTripSelection={() => navigate("/customer/login")}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route element={<PublicRoute />}>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/customer/login" element={<CustomerLoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/customer/bookings" element={<CustomerBookingsPage />} />
          <Route path="/customer/portal" element={<UserPortal />} />

          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="dashboard" element={<AdminDashboardPage />} />

            <Route path="customers" element={<CustomersManagementPage />} />

            <Route path="bookings" element={<BookingsManagementPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
