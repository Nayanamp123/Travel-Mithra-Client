import { useMemo, useState } from "react";
import { sampleCustomers } from "../../data/customers";
import AdminDashboard from "../../components/admin/AdminDashboard";
import type { Customer } from "../../types/travel";
import { balance, money } from "../../utils/format";
import { getStored, setStored } from "../../utils/storage";
import { BOOKING_STORAGE_KEY } from "../../constants/storage";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Customer[]>(() => getStored<Customer>(BOOKING_STORAGE_KEY));
  const [destinationFilter, setDestinationFilter] = useState("all");

  const dashboardCustomers = useMemo(() => [...sampleCustomers, ...bookings], [bookings]);
  const visibleCustomers = useMemo(() => {
    if (destinationFilter === "all") {
      return dashboardCustomers;
    }

    return dashboardCustomers.filter((customer) => customer.destination === destinationFilter);
  }, [dashboardCustomers, destinationFilter]);
  const destinationOptions = useMemo(() => [...new Set(dashboardCustomers.map((customer) => customer.destination))], [dashboardCustomers]);
  const totalPaid = visibleCustomers.reduce((sum, customer) => sum + Number(customer.paidAmount), 0);
  const totalBalance = visibleCustomers.reduce((sum, customer) => sum + balance(customer), 0);
  const pendingPayments = dashboardCustomers.filter((customer) => customer.status !== "confirmed").length;

  const persistBookings = (nextBookings: Customer[]) => {
    setBookings(nextBookings);
    setStored(BOOKING_STORAGE_KEY, nextBookings);
  };

  const confirmBooking = (id: string) => {
    persistBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, status: "confirmed", acceptedBy: "Travel Mithra Admin", remarks: "Payment confirmed by admin." } : booking,
      ),
    );
  };

  const viewCustomer = (customer: Customer) => {
    alert(
      [
        `Customer: ${customer.name}`,
        `User ID: ${customer.userId || "-"}`,
        `Destination: ${customer.destination}`,
        `Trip Date: ${customer.date}`,
        `Payment Mode: ${customer.paymentMode}`,
        `Paid: ${money(customer.paidAmount)}`,
        `Balance: ${money(balance(customer))}`,
        `Status: ${customer.status === "confirmed" ? "Confirmed" : "Pending"}`,
      ].join("\n"),
    );
  };

  const logoutAdmin = async () => {
    await adminService.logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <AdminDashboard
      visibleCustomers={visibleCustomers}
      destinationOptions={destinationOptions}
      destinationFilter={destinationFilter}
      totalPaid={totalPaid}
      totalBalance={totalBalance}
      pendingPayments={pendingPayments}
      onBack={() => navigate("/")}
      onLogout={logoutAdmin}
      onDestinationFilterChange={setDestinationFilter}
      onViewCustomer={viewCustomer}
      onConfirmBooking={confirmBooking}
    />
  );
}

export default AdminDashboardPage;
