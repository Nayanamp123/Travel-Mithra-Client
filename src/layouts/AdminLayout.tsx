// layouts/AdminLayout.tsx

import {
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  adminService,
} from "../services/adminService";

function AdminLayout() {

  const navigate =
    useNavigate();

  const admin =
    adminService.getAdmin();

  const [collapsed,
    setCollapsed,
  ] = useState(false);



  const handleLogout =
    async () => {

      await adminService.logout();

      navigate(
        "/admin/login",
        {
          replace: true,
        },
      );
    };



  return (
    <section
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >

      {/* SIDEBAR */}

      <aside
        style={{
          width:
            collapsed
              ? "90px"
              : "260px",

          background:
            "#152334",

          color:
            "#ffffff",

          transition:
            "0.3s ease",

          display: "flex",

          flexDirection:
            "column",

          justifyContent:
            "space-between",

          padding:
            "24px 16px",
        }}
      >

        <div>

          {/* TOP */}

          <div
            style={{
              display: "flex",
              alignItems:
                "center",

              justifyContent:
                collapsed
                  ? "center"
                  : "space-between",

              marginBottom:
                "40px",
            }}
          >

            {!collapsed && (

              <img
                src="/assets/pdf-image-1.jpeg"
                alt="Travel Mithra"

                style={{
                  width: "140px",
                  borderRadius:
                    "10px",
                }}
              />

            )}



            <button
              type="button"

              onClick={() =>
                setCollapsed(
                  !collapsed,
                )
              }

              style={{
                background:
                  "transparent",

                border:
                  "none",

                color:
                  "#ffffff",

                cursor:
                  "pointer",

                fontSize:
                  "24px",
              }}
            >

              {collapsed
                ? "☰"
                : "✕"}

            </button>

          </div>



          {/* NAVIGATION */}

          <nav
            style={{
              display: "flex",

              flexDirection:
                "column",

              gap: "14px",
            }}
          >

            <NavLink
              to="/admin/dashboard"

              style={({
                isActive,
              }) => ({
                display: "flex",

                alignItems:
                  "center",

                gap: "14px",

                padding:
                  "14px 16px",

                borderRadius:
                  "12px",

                textDecoration:
                  "none",

                color:
                  "#ffffff",

                background:
                  isActive
                    ? "#0f6db2"
                    : "transparent",
              })}
            >

              <span>
                📊
              </span>

              {!collapsed &&
                "Dashboard"}

            </NavLink>



            <NavLink
              to="/admin/customers"

              style={({
                isActive,
              }) => ({
                display: "flex",

                alignItems:
                  "center",

                gap: "14px",

                padding:
                  "14px 16px",

                borderRadius:
                  "12px",

                textDecoration:
                  "none",

                color:
                  "#ffffff",

                background:
                  isActive
                    ? "#0f6db2"
                    : "transparent",
              })}
            >

              <span>
                👥
              </span>

              {!collapsed &&
                "Customers"}

            </NavLink>



            <NavLink
              to="/admin/bookings"

              style={({
                isActive,
              }) => ({
                display: "flex",

                alignItems:
                  "center",

                gap: "14px",

                padding:
                  "14px 16px",

                borderRadius:
                  "12px",

                textDecoration:
                  "none",

                color:
                  "#ffffff",

                background:
                  isActive
                    ? "#0f6db2"
                    : "transparent",
              })}
            >

              <span>
                📘
              </span>

              {!collapsed &&
                "Bookings"}

            </NavLink>

            {admin?.role === "super_admin" && (
              <NavLink
                to="/admin/destinations"

                style={({
                  isActive,
                }) => ({
                  display: "flex",

                  alignItems:
                    "center",

                  gap: "14px",

                  padding:
                    "14px 16px",

                  borderRadius:
                    "12px",

                  textDecoration:
                    "none",

                  color:
                    "#ffffff",

                  background:
                    isActive
                      ? "#0f6db2"
                      : "transparent",
                })}
              >

                <span>
                  ✨
                </span>

                {!collapsed &&
                  "Destinations"}

              </NavLink>
            )}

            <NavLink
              to="/"

              style={() => ({
                display: "flex",

                alignItems:
                  "center",

                gap: "14px",

                padding:
                  "14px 16px",

                borderRadius:
                  "12px",

                textDecoration:
                  "none",

                color:
                  "#ffffff",
              })}
            >

              <span>
                🌍
              </span>

              {!collapsed &&
                "Customer Site"}

            </NavLink>

          </nav>

        </div>



        {/* FOOTER */}

        <div
          style={{
            borderTop:
              "1px solid rgba(255,255,255,0.1)",

            paddingTop:
              "20px",
          }}
        >

          {!collapsed && (

            <p
              style={{
                marginBottom:
                  "16px",

                fontWeight:
                  "600",
              }}
            >
              {admin?.name ||
                "Admin"}
            </p>

          )}



          <button
            type="button"

            onClick={
              handleLogout
            }

            style={{
              width: "100%",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                collapsed
                  ? "center"
                  : "flex-start",

              gap: "12px",

              background:
                "#dc2626",

              color:
                "#ffffff",

              border:
                "none",

              padding:
                "14px",

              borderRadius:
                "12px",

              cursor:
                "pointer",

              fontWeight:
                "600",
            }}
          >

            <span>
              🚪
            </span>

            {!collapsed &&
              "Logout"}

          </button>

        </div>

      </aside>



      {/* MAIN CONTENT */}

      <main
        style={{
          flex: 1,
          padding: "30px",
          overflowX:
            "auto",
        }}
      >

        <Outlet />

      </main>

    </section>
  );
}

export default AdminLayout;