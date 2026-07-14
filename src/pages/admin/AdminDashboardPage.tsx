import { useMemo, useState, useEffect } from "react";
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
  const [bookings, setBookings] = useState<any[]>([]);
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [showOnlyConfirmed, setShowOnlyConfirmed] = useState(false);

  // Fetch real bookings from backend and map to dashboard customers
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await (await import("../../services/bookingsService")).bookingService.getAllBookings({ page: 1, limit: 200 });
        const rows = response.data || [];

        if (!mounted) return;

        setBookings(rows);
      } catch (err) {
        // fallback to stored/demo bookings
        setBookings(getStored<Customer>(BOOKING_STORAGE_KEY) || []);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const dashboardCustomers = useMemo(() => {
    // Map booking rows to the dashboard `Customer` shape used by AdminDashboard
    const mapped = bookings.map((b: any) => ({
      id: String(b.id),
      receiptNo: b.id ? `TMH/${b.id}` : "-",
      date: b.trip_date ? String(new Date(b.trip_date).toLocaleDateString()) : "-",
      name: b.customer?.name || "-",
      userId: b.customer?.id ? String(b.customer.id) : undefined,
      address: "-",
      destination: b.destination || "-",
      group: `${b.number_of_travellers || 1} travellers`,
      paymentMode: b.payment_status || "-",
      acceptedBy: b.customer?.name || "-",
      totalAmount: Number(b.amount) || 0,

      paidAmount: Number(b.received_amount) || 0,

      received_amount: Number(b.received_amount) || 0,

      previous_payments: Number(b.previous_payments) || 0,

      balanceAmount: Number(b.balance_to_pay) || 0,
      status: b.booking_status === "confirmed" ? "confirmed" : "pending",
      remarks: "",
    } as Customer));

    // include demo sample customers as fallback only when no bookings
    return mapped.length ? mapped : [...sampleCustomers];
  }, [bookings]);
  const visibleCustomers = useMemo(() => {
    let list = dashboardCustomers;

    if (destinationFilter !== "all") {
      list = list.filter((customer) => customer.destination === destinationFilter);
    }

    if (showOnlyConfirmed) {
      list = list.filter((customer) => customer.status === "confirmed");
    }

    return list;
  }, [dashboardCustomers, destinationFilter, showOnlyConfirmed]);
  const destinationOptions = useMemo(() => [...new Set(dashboardCustomers.map((customer) => customer.destination))], [dashboardCustomers]);
  const totalPaid = visibleCustomers.reduce((sum, customer) => sum + Number(customer.paidAmount), 0);
const totalBalance = visibleCustomers.reduce((sum, customer) => sum - Number(customer.paidAmount),0);
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
      showOnlyConfirmed={showOnlyConfirmed}
      totalPaid={totalPaid}
      totalBalance={totalBalance}
      pendingPayments={pendingPayments}
      onBack={() => navigate("/")}
      onLogout={logoutAdmin}
      onDestinationFilterChange={setDestinationFilter}
      onShowOnlyConfirmedChange={setShowOnlyConfirmed}
      onViewCustomer={viewCustomer}
      onConfirmBooking={confirmBooking}
    />
  );
}

export default AdminDashboardPage;
