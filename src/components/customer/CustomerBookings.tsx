// components/customer/CustomerBookings.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  bookingService,
} from "../../services/bookingsService";

function CustomerBookings() {

  const customer =
    localStorage.getItem(
      "travelmithra_customer_details",
    );

  const loggedUser =
    customer
      ? JSON.parse(customer)
      : null;

  const [bookings,
    setBookings,
  ] = useState([]);

  const [loading,
    setLoading,
  ] = useState(false);

  const [search,
    setSearch,
  ] = useState("");

  const [paymentStatus,
    setPaymentStatus,
  ] = useState("");

  const [bookingStatus,
    setBookingStatus,
  ] = useState("");



  const loadBookings =
    async () => {

      if (!loggedUser?.id) {
        return;
      }

      try {

        setLoading(
          true,
        );

        const response =
          await bookingService.getCustomerBookings(
            loggedUser.id,
            {
              search,

              paymentStatus:
                paymentStatus || undefined,

              bookingStatus:
                bookingStatus || undefined,
            },
          );

        setBookings(
          response.data || [],
        );  

      } finally {

        setLoading(
          false,
        );
      }
    };



  // DOWNLOAD RECEIPT
  const handleDownloadReceipt =
    async (
      bookingId: number,
    ) => {

      try {

        await bookingService.downloadReceipt(
          bookingId,
        );

      } catch (error) {

        console.log(error);

        alert(
          "Receipt download failed",
        );
      }
    };



  useEffect(() => {

    loadBookings();

  }, [
    search,
    paymentStatus,
    bookingStatus,
  ]);



  return (
    <section>

      <div
        style={{
          marginBottom:
            "24px",
        }}
      >

        <h2
          style={{
            fontSize:
              "28px",
            fontWeight:
              "700",
            color:
              "#152334",
          }}
        >
          My Bookings
        </h2>

      </div>



      {/* FILTERS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "16px",
          marginBottom:
            "24px",
          background:
            "#ffffff",
          padding:
            "20px",
          borderRadius:
            "16px",
        }}
      >

        <input
          type="text"
          placeholder="Search destination"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }
        />



        <select
          value={paymentStatus}
          onChange={(event) =>
            setPaymentStatus(
              event.target.value,
            )
          }
        >

          <option value="">
            All Payment Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="partial">
            Partial
          </option>

          <option value="paid">
            Paid
          </option>

          <option value="refunded">
            Refunded
          </option>

        </select>



        <select
          value={bookingStatus}
          onChange={(event) =>
            setBookingStatus(
              event.target.value,
            )
          }
        >

          <option value="">
            All Booking Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="cancelled">
            Cancelled
          </option>

        </select>

      </div>



      {/* TABLE */}

      <div
        style={{
          background:
            "#ffffff",
          borderRadius:
            "18px",
          overflow:
            "hidden",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.08)",
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
                "#152334",
              color:
                "#ffffff",
            }}
          >

            <tr>

              <th style={{ padding: "18px" }}>
                Destination
              </th>

              <th style={{ padding: "18px" }}>
                Trip Date
              </th>

              <th style={{ padding: "18px" }}>
                Travellers
              </th>

              <th style={{ padding: "18px" }}>
                Amount
              </th>

              <th style={{ padding: "18px" }}>
                Payment
              </th>

              <th style={{ padding: "18px" }}>
                Booking
              </th>

              <th style={{ padding: "18px" }}>
                Receipt
              </th>

            </tr>

          </thead>



          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={7}
                  style={{
                    padding:
                      "30px",
                    textAlign:
                      "center",
                  }}
                >
                  Loading...
                </td>

              </tr>

            ) : bookings.length ? (

              bookings.map(
                (
                  booking: any,
                ) => (

                  <tr
                    key={
                      booking.id
                    }
                  >

                    <td style={{ padding: "18px" }}>
                      {
                        booking.destination
                      }
                    </td>

                    <td style={{ padding: "18px" }}>
                      {
                        booking.trip_date
                      }
                    </td>

                    <td style={{ padding: "18px" }}>
                      {
                        booking.number_of_travellers
                      }
                    </td>

                    <td style={{ padding: "18px" }}>
                      ₹
                      {
                        booking.amount
                      }
                    </td>

                    <td style={{ padding: "18px" }}>
                      {
                        booking.payment_status
                      }
                    </td>

                    <td style={{ padding: "18px" }}>
                      {
                        booking.booking_status
                      }
                    </td>

                    {/* DOWNLOAD BUTTON */}

                    <td style={{ padding: "18px" }}>

                      <button
                        onClick={() =>
                          handleDownloadReceipt(
                            booking.id,
                          )
                        }
                        style={{
                          background:
                            "#152334",
                          color:
                            "#ffffff",
                          border:
                            "none",
                          padding:
                            "10px 16px",
                          borderRadius:
                            "8px",
                          cursor:
                            "pointer",
                          fontWeight:
                            "600",
                        }}
                      >
                        Download
                      </button>

                    </td>

                  </tr>
                ),
              )

            ) : (

              <tr>

                <td
                  colSpan={7}
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
  );
}

export default CustomerBookings;