// pages/admin/BookingsManagementPage.tsx

import BookingsPage from "../../components/admin/BookingManagement";

function BookingsManagementPage() {

  return (
    <main
      style={{
        flex: 1,
        padding: "30px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >

      <BookingsPage />

    </main>
  );
}

export default BookingsManagementPage;