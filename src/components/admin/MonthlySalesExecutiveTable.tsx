import { MonthlySalesResponse } from "../../types/sales";
import { money } from "../../utils/format";
import * as XLSX from "xlsx";
import { bookingService } from "../../services/bookingsService";

type Props = {
  data: MonthlySalesResponse | null;
  startDate?: string;
  endDate?: string;
};

function downloadExcel(data: MonthlySalesResponse) {
  const rows = data.customers.map((c) => ({
    "Customer Name": c.customerName,
    Email: c.customerEmail || "-",
    "Total Bookings": c.bookingCount,
    "Total Adults": c.totalAdults,
    "Total Kids": c.totalKids,
    "Total Travellers": c.totalAdults + c.totalKids,
    "Total Amount (₹)": c.totalAmount,
    "Total Received (₹)": c.totalReceived,
    "Pending Balance (₹)": c.totalPendingBalance,
  }));

  // Add totals row
  const totalBookings = data.customers.reduce((s, c) => s + c.bookingCount, 0);
  rows.push({
    "Customer Name": "TOTAL",
    Email: "",
    "Total Bookings": totalBookings,
    "Total Adults": data.customers.reduce((s, c) => s + c.totalAdults, 0),
    "Total Kids": data.customers.reduce((s, c) => s + c.totalKids, 0),
    "Total Travellers": data.customers.reduce((s, c) => s + c.totalAdults + c.totalKids, 0),
    "Total Amount (₹)": data.totals.totalAmount,
    "Total Received (₹)": data.totals.totalReceived,
    "Pending Balance (₹)": data.totals.totalPendingBalance,
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Monthly Sales");

  // Column widths
  ws["!cols"] = [
    { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 12 },
    { wch: 10 }, { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 18 },
  ];

  const filename = `${data.executive}_Monthly_Sales_${data.month}_${data.year}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export default function MonthlySalesExecutiveTable({ data, startDate, endDate }: Props) {
  if (!data) {
    return <div style={{ padding: 16, color: "#64748b" }}>Loading monthly sales...</div>;
  }

  const handleDownloadPDF = () => {
    bookingService.downloadSalesReportPDF(data.executive, data.year, data.month, startDate, endDate);
  };

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>
          {data.executive} - {data.month}/{data.year} Monthly Customers
        </h3>
        {data.customers.length > 0 && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={handleDownloadPDF}
              style={{
                background: "#16a34a",
                color: "#fff",
                border: "none",
                padding: "8px 18px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              ⬇ Download PDF
            </button>
            <button
              type="button"
              onClick={() => downloadExcel(data)}
              style={{
                background: "#fff",
                color: "#fff",
                border: "none",
                padding: "8px 18px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {/* ⬇ Download Excel */}
            </button>
          </div>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Bookings</th>
              <th>Adults</th>
              <th>Kids</th>
              <th>Total Travellers</th>
              <th>Total Amount</th>
              <th>Total Received</th>
              <th>Pending Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.customers.length ? (
              data.customers.map((c) => (
                <tr key={c.customerId}>
                  <td>{c.customerName}</td>
                  <td>{c.customerEmail || "-"}</td>
                  <td>{c.bookingCount}</td>
                  <td>{c.totalAdults}</td>
                  <td>{c.totalKids}</td>
                  <td>{c.totalAdults + c.totalKids}</td>
                  <td>{money(c.totalAmount)}</td>
                  <td>{money(c.totalReceived)}</td>
                  <td>{money(c.totalPendingBalance)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 18, color: "#64748b" }}>
                  No bookings found for this executive in the selected month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, fontWeight: 700, display: "flex", gap: 24 }}>
        <span>Total Received: {money(data.totals.totalReceived)}</span>
        <span>Pending Balance: {money(data.totals.totalPendingBalance)}</span>
        <span>
          Total Travellers: {data.customers.reduce((s, c) => s + c.totalAdults + c.totalKids, 0)}
        </span>
      </div>
    </div>
  );
}

