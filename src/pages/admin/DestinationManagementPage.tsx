import DestinationManagement from "../../components/admin/DestinationManagement";
import { adminService } from "../../services/adminService";

function DestinationManagementPage() {
  const admin = adminService.getAdmin();

  if (admin?.role !== "super_admin") {
    return (
      <main
        style={{
          flex: 1,
          padding: "30px",
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <section
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>Access denied</h1>
          <p style={{ color: "#475569" }}>
            Only super admins can access this page.
          </p>
        </section>
      </main>
    );
  }

  return <DestinationManagement />;
}

export default DestinationManagementPage;
