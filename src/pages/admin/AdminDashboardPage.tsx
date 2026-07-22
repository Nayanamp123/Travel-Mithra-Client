import { useMemo, useState, useEffect } from "react";
import { sampleCustomers } from "../../data/customers";
import AdminDashboard from "../../components/admin/AdminDashboard";
import type { Customer } from "../../types/travel";
import { balance, money } from "../../utils/format";
import { getStored } from "../../utils/storage";
import { BOOKING_STORAGE_KEY } from "../../constants/storage";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { bookingService } from "../../services/bookingsService";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<any[]>([]);
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [showOnlyConfirmed, setShowOnlyConfirmed] = useState(false);

  const now = new Date();
  const [salesExecutive, setSalesExecutive] = useState<"Aliya" | "Keerthi">("Aliya");
  const [salesYear, setSalesYear] = useState(now.getFullYear());
  const [salesMonth, setSalesMonth] = useState(now.getMonth() + 1);
  const [salesStartDate, setSalesStartDate] = useState("");
  const [salesEndDate, setSalesEndDate] = useState("");
  const [monthlySales, setMonthlySales] = useState<any>(null);

  // Fetch real bookings from backend and map to dashboard customers
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await bookingService.getAllBookings({ page: 1, limit: 200 });
        const rows = response.data || [];
        if (!mounted) return;
        setBookings(rows);
      } catch (err) {
        if (!mounted) return;
        setBookings(getStored<Customer>(BOOKING_STORAGE_KEY) || []);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch monthly sales list for selected executive
  useEffect(() => {
    let mounted = true;

    const loadMonthly = async () => {
      try {
        // If both date range fields are filled, use date range; otherwise use month/year
        const useDateRange = salesStartDate && salesEndDate;
        const data = await bookingService.getMonthlySalesCustomersByExecutive(
          salesExecutive,
          salesYear,
          salesMonth,
          useDateRange ? salesStartDate : undefined,
          useDateRange ? salesEndDate : undefined,
        );
        if (!mounted) return;
        setMonthlySales(data);
      } catch {
        if (!mounted) return;
        setMonthlySales(null);
      }
    };

    loadMonthly();

    return () => {
      mounted = false;
    };
  }, [salesExecutive, salesYear, salesMonth, salesStartDate, salesEndDate]);

  const dashboardCustomers = useMemo(() => {
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
    })) as Customer[];

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

  const destinationOptions = useMemo(
    () => [...new Set(dashboardCustomers.map((customer) => customer.destination))],
    [dashboardCustomers],
  );

  const totalPaid = visibleCustomers.reduce((sum, customer) => sum + Number(customer.paidAmount), 0);
  const totalBalance = visibleCustomers.reduce((sum, customer) => sum - Number(customer.paidAmount), 0);
  const pendingPayments = dashboardCustomers.filter((customer) => customer.status !== "confirmed").length;

  const confirmBooking = async (id: string) => {
    await bookingService.updateBooking(Number(id), { booking_status: "confirmed" });

    const response = await bookingService.getAllBookings({ page: 1, limit: 200 });
    const rows = response.data || [];
    setBookings(rows);
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

      salesExecutive={salesExecutive}
      salesYear={salesYear}
      salesMonth={salesMonth}
      salesStartDate={salesStartDate}
      salesEndDate={salesEndDate}
      monthlySales={monthlySales}
      onSalesExecutiveChange={setSalesExecutive}
      onSalesYearChange={setSalesYear}
      onSalesMonthChange={setSalesMonth}
      onSalesStartDateChange={setSalesStartDate}
      onSalesEndDateChange={setSalesEndDate}
    />
  );
}

export default AdminDashboardPage;

