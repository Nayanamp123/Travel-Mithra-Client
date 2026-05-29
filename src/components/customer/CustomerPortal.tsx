// components/customer/CustomerPortal.tsx

import { useState } from "react";

import CustomerHeader
  from "./CustomerHeader";

type CustomerPortalProps = {
  loggedUser?: {
    name: string;
    email: string;
    phone?: string;
    status?: string;
  };

  userTrips: {
    id: number;
    destination: string;
    tripDate?: string;
    status?: string;
    paidAmount?: number;
  }[];

  onLogout: () => void;
};

function CustomerPortal({
  loggedUser,
  userTrips,
  onLogout,
}: CustomerPortalProps) {

  const [activeMenu,
    setActiveMenu,
  ] = useState("profile");

  return (
    <section className="customer-portal-view">

      <CustomerHeader
        accountMenuOpen={false}
        onAccountMenuToggle={() => {}}
      />



      <section
        style={{
          display: "flex",
          minHeight:
            "calc(100vh - 90px)",
        }}
      >

        <aside
          style={{
            width: "260px",
            background: "#111827",
            color: "#ffffff",
            padding: "30px 20px",
          }}
        >

          <h2
            style={{
              marginBottom: "30px",
            }}
          >
            Customer Portal
          </h2>



          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "14px",
            }}
          >

            <button
              type="button"

              style={{
                padding:
                  "14px 18px",

                border: "none",

                borderRadius:
                  "8px",

                cursor: "pointer",

                fontWeight: "600",

                background:
                  activeMenu ===
                  "profile"
                    ? "#ffffff"
                    : "#1f2937",

                color:
                  activeMenu ===
                  "profile"
                    ? "#111827"
                    : "#ffffff",
              }}

              onClick={() =>
                setActiveMenu(
                  "profile",
                )
              }
            >
              Profile
            </button>



            <button
              type="button"

              style={{
                padding:
                  "14px 18px",

                border: "none",

                borderRadius:
                  "8px",

                cursor: "pointer",

                fontWeight: "600",

                background:
                  activeMenu ===
                  "bookings"
                    ? "#ffffff"
                    : "#1f2937",

                color:
                  activeMenu ===
                  "bookings"
                    ? "#111827"
                    : "#ffffff",
              }}

              onClick={() =>
                setActiveMenu(
                  "bookings",
                )
              }
            >
              Bookings
            </button>



            <button
              type="button"

              style={{
                padding:
                  "14px 18px",

                border: "none",

                borderRadius:
                  "8px",

                cursor: "pointer",

                fontWeight: "600",

                background:
                  "#dc2626",

                color:
                  "#ffffff",
              }}

              onClick={onLogout}
            >
              Logout
            </button>

          </div>

        </aside>



        <main
          style={{
            flex: 1,
            padding: "40px",
            background:
              "#f8fafc",
          }}
        >

          {activeMenu ===
            "profile" && (
            <section>

              <h1
                style={{
                  marginBottom:
                    "30px",
                }}
              >
                Profile Details
              </h1>



              <div
                style={{
                  background:
                    "#ffffff",

                  padding:
                    "30px",

                  borderRadius:
                    "14px",

                  boxShadow:
                    "0 4px 14px rgba(0,0,0,0.08)",

                  display: "grid",

                  gap: "20px",
                }}
              >

                <div>
                  <strong>
                    Name
                  </strong>

                  <p>
                    {
                      loggedUser?.name
                    }
                  </p>
                </div>



                <div>
                  <strong>
                    Email
                  </strong>

                  <p>
                    {
                      loggedUser?.email
                    }
                  </p>
                </div>



                <div>
                  <strong>
                    Phone
                  </strong>

                  <p>
                    {loggedUser?.phone ||
                      "-"}
                  </p>
                </div>



                <div>
                  <strong>
                    Status
                  </strong>

                  <p>
                    {loggedUser?.status ||
                      "active"}
                  </p>
                </div>

              </div>

            </section>
          )}



          {activeMenu ===
            "bookings" && (
            <section>

              <h1
                style={{
                  marginBottom:
                    "30px",
                }}
              >
                My Bookings
              </h1>



              <div
                style={{
                  background:
                    "#ffffff",

                  borderRadius:
                    "14px",

                  overflow:
                    "hidden",

                  boxShadow:
                    "0 4px 14px rgba(0,0,0,0.08)",
                }}
              >

                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                  }}
                >

                  <thead
                    style={{
                      background:
                        "#111827",

                      color:
                        "#ffffff",
                    }}
                  >

                    <tr>

                      <th
                        style={{
                          padding:
                            "16px",
                        }}
                      >
                        Destination
                      </th>

                      <th
                        style={{
                          padding:
                            "16px",
                        }}
                      >
                        Trip Date
                      </th>

                      <th
                        style={{
                          padding:
                            "16px",
                        }}
                      >
                        Amount
                      </th>

                      <th
                        style={{
                          padding:
                            "16px",
                        }}
                      >
                        Status
                      </th>

                    </tr>

                  </thead>



                  <tbody>

                    {userTrips.length ? (
                      userTrips.map(
                        (
                          trip,
                        ) => (
                          <tr
                            key={
                              trip.id
                            }
                          >

                            <td
                              style={{
                                padding:
                                  "16px",
                              }}
                            >
                              {
                                trip.destination
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  "16px",
                              }}
                            >
                              {trip.tripDate ||
                                "-"}
                            </td>

                            <td
                              style={{
                                padding:
                                  "16px",
                              }}
                            >
                              ₹
                              {trip.paidAmount ||
                                0}
                            </td>

                            <td
                              style={{
                                padding:
                                  "16px",
                              }}
                            >
                              {trip.status ||
                                "pending"}
                            </td>

                          </tr>
                        ),
                      )
                    ) : (
                      <tr>

                        <td
                          colSpan={4}

                          style={{
                            padding:
                              "30px",

                            textAlign:
                              "center",
                          }}
                        >
                          No bookings found
                        </td>

                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </section>
          )}

        </main>

      </section>

    </section>
  );
}

export default CustomerPortal;