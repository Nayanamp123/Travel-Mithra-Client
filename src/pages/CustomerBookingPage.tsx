// pages/customer/CustomerBookingsPage.tsx

import CustomerBookings from "../components/customer/CustomerBookings";

function CustomerBookingsPage() {

  return (
    <section
      style={{
        padding: "30px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <CustomerBookings />
    </section>
  );
}

export default CustomerBookingsPage;