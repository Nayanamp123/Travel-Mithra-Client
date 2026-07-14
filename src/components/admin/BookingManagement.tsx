// components/admin/BookingsPage.tsx

import {
  useEffect,
  useState,
} from "react";

import { bookingService } from "../../services/bookingsService";
import { customerService } from "../../services/customerService";

function BookingsPage() {

  const [bookings,
    setBookings,
  ] = useState<any[]>([]);

  const [customers,
    setCustomers,
  ] = useState<any[]>([]);

  const [loading,
    setLoading,
  ] = useState(false);

  const [showModal,
    setShowModal,
  ] = useState(false);

  const [editingId,
    setEditingId,
  ] = useState<number | null>(
    null,
  );

  const [page,
    setPage,
  ] = useState(1);

  const [totalPages,
    setTotalPages,
  ] = useState(1);

  const [search,
    setSearch,
  ] = useState(""
  );

  const [customerId,
    setCustomerId,
  ] = useState("");

  const [paymentStatus,
    setPaymentStatus,
  ] = useState("");

  const [bookingStatus,
    setBookingStatus,
  ] = useState("");

  const [startDate,
    setStartDate,
  ] = useState("");

  const [endDate,
    setEndDate,
  ] = useState("");

  const [formData,
    setFormData,
  ] = useState({
    customer_id: "",
    destination: "",
    trip_date: "",
    number_of_travellers: "",
    amount: "",
    previous_payments: "",
    received_amount: "",
    balance_amount: "",
    payment_status: "pending",
    booking_status: "pending",
  });

  const loadBookings =
    async () => {

      try {

        setLoading(
          true,
        );

        const response =
          await bookingService.getAllBookings({
            page,
            limit: 10,
            search,

            customerId:
              customerId || undefined,

            paymentStatus:
              paymentStatus || undefined,

            bookingStatus:
              bookingStatus || undefined,

            startDate:
              startDate || undefined,

            endDate:
              endDate || undefined,
          });

        setBookings(
          response.data || [],
        );

        setTotalPages(
          response.totalPages || 2,
        );

      } finally {

        setLoading(
          false,
        );
      }
    };

  const loadCustomers =
    async () => {

      const response =
        await customerService.getAll();

      setCustomers(
        response || [],
      );
    };

  useEffect(() => {

    loadBookings();

    loadCustomers();

  }, [
    page,
    search,
    customerId,
    paymentStatus,
    bookingStatus,
    startDate,
    endDate,
  ]);

  const resetForm = () => {

    setEditingId(
      null,
    );

    setShowModal(
      false,
    );

    setFormData({
      customer_id: "",
      destination: "",
      trip_date: "",
      number_of_travellers: "",
      amount: "",
      received_amount: "",
      balance_amount: "",
      previous_payments: "",
      payment_status: "pending",
      booking_status: "pending",
    });
  };

  const toNumberOrUndefined = (value: string) => {
    if (value === "") return undefined;
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  };

  const handleSubmit =
    async (
      event: React.FormEvent,
    ) => {

      event.preventDefault();

      // Backend likely expects numeric types; avoid accidental 0 from empty string.
      const payload = {
        ...formData,

        customer_id:
          toNumberOrUndefined(formData.customer_id),

        number_of_travellers:
          toNumberOrUndefined(formData.number_of_travellers),

        amount:
          toNumberOrUndefined(formData.amount),

        previous_payments:
          toNumberOrUndefined(formData.previous_payments),

        received_amount:
          toNumberOrUndefined(formData.received_amount),

       
        balance_amount:
          toNumberOrUndefined(formData.balance_amount),
          
        
      }

      if (editingId) {

        await bookingService.updateBooking(
          editingId,
          payload,
        );

      } else {

        // Remove disabled/computed field before sending payload
        const { balance_amount, ...createPayload } = payload as any;
        await bookingService.createBooking(createPayload);
      }

      resetForm();

      loadBookings();
    };

  const handleEdit = (
    booking: any,
  ) => {

    setEditingId(
      booking.id,
    );

    setShowModal(
      true,
    );

    setFormData({
      customer_id:
        String(booking.customer_id),

      destination:
        booking.destination,

      trip_date:
        booking.trip_date,

      number_of_travellers:
        String(booking.number_of_travellers),

      amount:
        String(booking.amount),

      received_amount:
        String(booking.received_amount),

      previous_payments:
        String(booking.previous_payments),

      balance_amount:
        String(booking.balance_to_pay),

      payment_status:
        booking.payment_status,

      booking_status:
        booking.booking_status,
    });
  };

  const handleDelete =
    async (
      id: number,
    ) => {

      await bookingService.deleteBooking(
        id,
      );

      loadBookings();
    };

  const handleDownloadReceipt =
    async (
      id: number,
    ) => {
      try {
        await bookingService.downloadReceipt(
          id,
        );
      } catch (error) {
        console.error(error);
        alert(
          "Receipt download failed",
        );
      }
    };

  return (
    <section>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom:
            "30px",
        }}
      >

        <div>

          <h1
            style={{
              fontSize:
                "32px",
              fontWeight:
                "700",
              color:
                "#152334",
            }}
          >
            Bookings Management
          </h1>

          <p
            style={{
              color:
                "#64748b",
            }}
          >
            Manage all bookings here
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            setShowModal(
              true,
            )
          }
          style={{
            background:
              "#0f6db2",
            color:
              "#ffffff",
            border:
              "none",
            padding:
              "14px 22px",
            borderRadius:
              "10px",
            cursor:
              "pointer",
            fontWeight:
              "700",
          }}
        >
          + Create Booking
        </button>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "16px",
          marginBottom: "25px",
          background: "#ffffff",
          padding: "20px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 18px rgba(0,0,0,0.06)",
        }}
      >

        <input
          type="text"
          placeholder="Search destination/customer"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }
        />

        <select
          value={customerId}
          onChange={(event) =>
            setCustomerId(
              event.target.value,
            )
          }
        >

          <option value="">
            All Customers
          </option>

          {customers.map(
            (customer: any) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.name}
              </option>
            ),
          )}

        </select>

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

        <input
          type="date"
          value={startDate}
          onChange={(event) =>
            setStartDate(
              event.target.value,
            )
          }
        />

        <input
          type="date"
          value={endDate}
          onChange={(event) =>
            setEndDate(
              event.target.value,
            )
          }
        />

      </div>

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
                Customer
              </th>
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
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={8}
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
                (booking: any) => (

                  <tr key={booking.id}>

                    <td style={{ padding: "18px" }}>
                      {booking.customer?.name}
                    </td>

                    <td style={{ padding: "18px" }}>
                      {booking.destination}
                    </td>

                    <td style={{ padding: "18px" }}>
                      {booking.trip_date}
                    </td>

                    <td style={{ padding: "18px" }}>
                      {booking.number_of_travellers}
                    </td>

                    <td style={{ padding: "18px" }}>
                      ₹{booking.amount}
                    </td>

                    <td style={{ padding: "18px" }}>
                      {booking.payment_status}
                    </td>

                    <td style={{ padding: "18px" }}>
                      {booking.booking_status}
                    </td>

                    <td style={{ padding: "18px" }}>
                      <div
                        style={{
                          display:
                            "flex",
                          gap:
                            "10px",
                        }}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              booking,
                            )
                          }
                        >
                          Edit
                        </button>

                        {booking.booking_status === "confirmed" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDownloadReceipt(
                                booking.id,
                              )
                            }
                          >
                            Download
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              booking.id,
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>

                ),
              )

            ) : (

              <tr>
                <td
                  colSpan={8}
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

      <div
        style={{
          display: "flex",
          justifyContent:
            "center",
          gap: "12px",
          marginTop: "24px",
        }}
      >

        <button
          disabled={page === 1}
          onClick={() =>
            setPage(
              page - 1,
            )
          }
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() =>
            setPage(
              page + 1,
            )
          }
        >
          Next
        </button>

      </div>

      {showModal && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 1000,
          }}
        >

          <div
            style={{
              background:
                "#ffffff",
              width: "450px",
              borderRadius:
                "18px",
              padding:
                "30px",
            }}
          >

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "24px",
              }}
            >

              <h2>
                {editingId ? "Edit Booking" : "Create Booking"}
              </h2>

              <button
                type="button"
                onClick={resetForm}
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display:
                  "grid",
                gap: "16px",
              }}
            >

              <label>
                Customer
                <select
                  value={formData.customer_id}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      customer_id:
                        event.target.value,
                    })
                  }
                >

                  <option value="">
                    Select Customer
                  </option>

                  {customers.map(
                    (customer: any) => (

                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.name}
                      </option>

                    ),
                  )}

                </select>
              </label>

              <label>
                Destination
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      destination:
                        event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Trip Date
                <input
                  type="date"
                  value={formData.trip_date}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      trip_date:
                        event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Number Of Travellers
                <input
                  type="number"
                  value={formData.number_of_travellers}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      number_of_travellers:
                        event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Amount
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      amount:
                        event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Previous Payments
                <input
                  type="number"
                  value={formData.previous_payments}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      previous_payments:
                        event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Received a Sum Of
                <input
                  type="number"
                  value={formData.received_amount}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      received_amount:
                        event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Balance to Pay
                <input
                  type="number"
                  value={formData.balance_amount}
                  disabled
                  style={{
                    background: "#f3f4f6",
                    cursor: "not-allowed",
                    fontWeight: "bold",
                  }}
                />
              </label>

              <label>
                Payment Status
                <select
                  value={formData.payment_status}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      payment_status:
                        event.target.value,
                    })
                  }
                >

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
              </label>

              <label>
                Booking Status
                <select
                  value={formData.booking_status}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      booking_status:
                        event.target.value,
                    })
                  }
                >

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
              </label>

              <button type="submit">
                {editingId ? "Update Booking" : "Create Booking"}
              </button>

            </form>

          </div>

        </div>

      )}

    </section>
  );
}

export default BookingsPage;

