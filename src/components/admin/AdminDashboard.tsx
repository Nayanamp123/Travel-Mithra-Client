import type { Customer } from "../../types/travel";
import { balance, money } from "../../utils/format";
import { bookingService } from "../../services/bookingsService";

import type { MonthlySalesResponse } from "../../types/sales";
import MonthlySalesExecutiveTable from "./MonthlySalesExecutiveTable";

type AdminDashboardProps = {
  visibleCustomers: Customer[];
  destinationOptions: string[];
  destinationFilter: string;
  showOnlyConfirmed: boolean;
  totalPaid: number;
  totalBalance: number;
  pendingPayments: number;

  onBack: () => void;
  onLogout: () => void;
  onDestinationFilterChange: (destination: string) => void;
  onShowOnlyConfirmedChange: (v: boolean) => void;
  onViewCustomer: (customer: Customer) => void;
  onConfirmBooking: (id: string) => void;

  salesExecutive: "Aliya" | "Keerthi" | "Sharanya";
  salesYear: number;
  salesMonth: number;
  salesStartDate: string;
  salesEndDate: string;
  monthlySales: MonthlySalesResponse | null;
  onSalesExecutiveChange: (v: "Aliya" | "Keerthi" | "Sharanya") => void;
  onSalesYearChange: (v: number) => void;
  onSalesMonthChange: (v: number) => void;
  onSalesStartDateChange: (v: string) => void;
  onSalesEndDateChange: (v: string) => void;
};

function AdminDashboard({
  visibleCustomers,
  destinationOptions,
  destinationFilter,
  totalPaid,
  totalBalance,
  pendingPayments,
  onBack,
  onLogout,
  onDestinationFilterChange,
  onViewCustomer,
  onConfirmBooking,
  showOnlyConfirmed,
  onShowOnlyConfirmedChange,

  salesExecutive,
  salesYear,
  salesMonth,
  salesStartDate,
  salesEndDate,
  monthlySales,
  onSalesExecutiveChange,
  onSalesYearChange,
  onSalesMonthChange,
  onSalesStartDateChange,
  onSalesEndDateChange,
}: AdminDashboardProps) {
  return (
    <section id="dashboardView" className="dashboard-view">
      <header className="topbar">
        <img className="topbar-logo" src="/assets/pdf-image-1.jpeg" alt="Travel Mithra" />
        <div className="topbar-actions">
          <span>Admin Panel</span>
          <button className="secondary-button" type="button" onClick={onBack}>
            Back
          </button>
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="summary-strip" aria-label="Payment summary">
        <div>
          <span>Total Customers</span>
          <strong>{visibleCustomers.length}</strong>
        </div>
        <div>
          <span>Total Paid</span>
          <strong>{money(totalPaid)}</strong>
        </div>
        <div>
          <span>Total Balance</span>
          <strong>{money(totalBalance)}</strong>
        </div>
        <div>
          <span>Pending Approvals</span>
          <strong>{pendingPayments}</strong>
        </div>
      </section>

      <section className="workspace">
        <div className="filter-bar">
          <label htmlFor="destinationFilter">Destination</label>
          <select
            id="destinationFilter"
            value={destinationFilter}
            onChange={(event) => onDestinationFilterChange(event.target.value)}
          >
            <option value="all">All Destinations</option>
            {destinationOptions.map((destination) => (
              <option key={destination} value={destination}>
                {destination}
              </option>
            ))}
          </select>
          <label style={{ marginLeft: 12 }}>
            <input
              type="checkbox"
              checked={showOnlyConfirmed}
              onChange={(e) => onShowOnlyConfirmedChange(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            Show only confirmed
          </label>
        </div>

        {/* Monthly sales executive section */}
        <div style={{ marginBottom: 18, padding: 16, background: "#ffffff", borderRadius: 16 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <label>
              Sales Executive
              <select value={salesExecutive} onChange={(e) => onSalesExecutiveChange(e.target.value as any)} style={{ marginLeft: 8 }}>
                <option value="Aliya">Aliya</option>
                <option value="Keerthi">Keerthi</option>
                <option value="Sharanya">Sharanya</option>
              </select>
            </label>

            <label>
              Month
              <select value={salesMonth} onChange={(e) => onSalesMonthChange(Number(e.target.value))} style={{ marginLeft: 8 }}>
                {[...Array(12)].map((_, i) => {
                  const m = i + 1;
                  return (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  );
                })}
              </select>
            </label>

            <label>
              Year
              <input
                type="number"
                value={salesYear}
                onChange={(e) => onSalesYearChange(Number(e.target.value))}
                style={{ marginLeft: 8, width: 80 }}
              />
            </label>

            <span style={{ color: "#94a3b8", fontWeight: 600 }}>OR</span>

            <label>
              From Date
              <input
                type="date"
                value={salesStartDate}
                onChange={(e) => onSalesStartDateChange(e.target.value)}
                style={{ marginLeft: 8 }}
              />
            </label>

            <label>
              To Date
              <input
                type="date"
                value={salesEndDate}
                onChange={(e) => onSalesEndDateChange(e.target.value)}
                style={{ marginLeft: 8 }}
              />
            </label>
          </div>

<MonthlySalesExecutiveTable data={monthlySales} startDate={salesStartDate} endDate={salesEndDate} />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Trip Date</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleCustomers.length ? (
                visibleCustomers.map((customer) => {
                  const isPending = customer.status !== "confirmed";

                  return (
                    <tr key={customer.id}>
                      <td>{customer.receiptNo}</td>
                      <td>{customer.name}</td>
                      <td>{customer.destination}</td>
                      <td>{customer.date}</td>
                      <td>{money(customer.paidAmount)}</td>
                      <td>{money(balance(customer))}</td>
                      <td>{customer.status === "confirmed" ? "Confirmed" : "Pending"}</td>
                      <td>
                        <div className="row-actions">
                          <button type="button" onClick={() => onViewCustomer(customer)}>
                            View
                          </button>
                          {isPending && (
                            <button type="button" onClick={() => onConfirmBooking(customer.id)}>
                              Confirm
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => bookingService.downloadReceipt(Number(customer.id))}
                          >
                            PDF Receipt
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8}>No customers found for this destination.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export default AdminDashboard;

