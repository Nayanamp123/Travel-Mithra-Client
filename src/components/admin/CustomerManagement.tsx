// components/admin/CustomersPage.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  customerService,
} from "../../services/customerService";

function CustomersPage() {

  const [customers,
    setCustomers,
  ] = useState([]);

  const [showModal,
    setShowModal,
  ] = useState(false);

  const [formData,
    setFormData,
  ] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [editingId,
    setEditingId,
  ] = useState<
    number | null
  >(null);



  const loadCustomers =
    async () => {

      const data =
        await customerService.getAll();

      setCustomers(data);
    };



  useEffect(() => {

    loadCustomers();

  }, []);



  const resetForm = () => {

    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
    });

    setEditingId(
      null,
    );

    setShowModal(
      false,
    );
  };



  const handleSubmit =
    async (
      event:
        React.FormEvent,
    ) => {

      event.preventDefault();

      if (editingId) {

        await customerService.update(
          editingId,
          formData,
        );

      } else {

        await customerService.create(
          formData,
        );

      }

      resetForm();

      loadCustomers();
    };



  const handleEdit = (
    customer: any,
  ) => {

    setEditingId(
      customer.id,
    );

    setFormData({
      name:
        customer.name,

      email:
        customer.email,

      phone:
        customer.phone,

      password: "",
    });

    setShowModal(
      true,
    );
  };



  const handleDelete =
    async (
      id: number,
    ) => {

      await customerService.delete(
        id,
      );

      loadCustomers();
    };



  return (
    <section
      style={{
        width: "100%",
      }}
    >

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

              marginBottom:
                "8px",
            }}
          >
            Customers Management
          </h1>



          <p
            style={{
              color:
                "#64748b",
            }}
          >
            Manage all customer details here
          </p>

        </div>



        <button
          type="button"

          onClick={() => {

            setEditingId(
              null,
            );

            setShowModal(
              true,
            );
          }}

          style={{
            background:
              "#0f6db2",

            color:
              "#ffffff",

            border: "none",

            padding:
              "14px 22px",

            borderRadius:
              "10px",

            cursor:
              "pointer",

            fontWeight:
              "700",

            fontSize:
              "15px",
          }}
        >
          + Create Customer
        </button>

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

              <th
                style={{
                  padding:
                    "18px",
                  textAlign:
                    "left",
                }}
              >
                Name
              </th>

              <th
                style={{
                  padding:
                    "18px",
                  textAlign:
                    "left",
                }}
              >
                Email
              </th>

              <th
                style={{
                  padding:
                    "18px",
                  textAlign:
                    "left",
                }}
              >
                Phone
              </th>

              <th
                style={{
                  padding:
                    "18px",
                  textAlign:
                    "left",
                }}
              >
                Status
              </th>

              <th
                style={{
                  padding:
                    "18px",
                  textAlign:
                    "left",
                }}
              >
                Actions
              </th>

            </tr>

          </thead>



          <tbody>

            {customers.length ? (

              customers.map(
                (
                  customer: any,
                ) => (

                  <tr
                    key={
                      customer.id
                    }

                    style={{
                      borderBottom:
                        "1px solid #e2e8f0",
                    }}
                  >

                    <td
                      style={{
                        padding:
                          "18px",
                      }}
                    >
                      {
                        customer.name
                      }
                    </td>

                    <td
                      style={{
                        padding:
                          "18px",
                      }}
                    >
                      {
                        customer.email
                      }
                    </td>

                    <td
                      style={{
                        padding:
                          "18px",
                      }}
                    >
                      {
                        customer.phone
                      }
                    </td>

                    <td
                      style={{
                        padding:
                          "18px",
                      }}
                    >

                      <span
                        style={{
                          background:
                            customer.status ===
                            "active"
                              ? "#dcfce7"
                              : "#fee2e2",

                          color:
                            customer.status ===
                            "active"
                              ? "#166534"
                              : "#991b1b",

                          padding:
                            "6px 12px",

                          borderRadius:
                            "999px",

                          fontSize:
                            "13px",

                          fontWeight:
                            "600",
                        }}
                      >
                        {
                          customer.status
                        }
                      </span>

                    </td>

                    <td
                      style={{
                        padding:
                          "18px",
                      }}
                    >

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
                              customer,
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
                              "10px 16px",

                            borderRadius:
                              "8px",

                            cursor:
                              "pointer",
                          }}
                        >
                          Edit
                        </button>



                        <button
                          type="button"

                          onClick={() =>
                            handleDelete(
                              customer.id,
                            )
                          }

                          style={{
                            background:
                              "#dc2626",

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
                          }}
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
                  colSpan={5}

                  style={{
                    padding:
                      "30px",

                    textAlign:
                      "center",
                  }}
                >
                  No customers found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>



      {showModal && (

        <div
          style={{
            position:
              "fixed",

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

              width: "420px",

              borderRadius:
                "18px",

              padding:
                "30px",

              boxShadow:
                "0 8px 40px rgba(0,0,0,0.2)",
            }}
          >

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                marginBottom:
                  "24px",
              }}
            >

              <h2>
                {editingId
                  ? "Edit Customer"
                  : "Create Customer"}
              </h2>



              <button
                type="button"

                onClick={
                  resetForm
                }

                style={{
                  border:
                    "none",

                  background:
                    "transparent",

                  cursor:
                    "pointer",

                  fontSize:
                    "20px",
                }}
              >
                ✕
              </button>

            </div>



            <form
              onSubmit={
                handleSubmit
              }

              style={{
                display: "grid",

                gap: "16px",
              }}
            >

              <input
                type="text"

                placeholder="Enter customer name"

                value={
                  formData.name
                }

                onChange={(
                  event,
                ) =>
                  setFormData({
                    ...formData,

                    name:
                      event.target
                        .value,
                  })
                }

                style={{
                  padding:
                    "14px",

                  borderRadius:
                    "10px",

                  border:
                    "1px solid #cbd5e1",
                }}
              />



              <input
                type="email"

                placeholder="Enter email"

                value={
                  formData.email
                }

                onChange={(
                  event,
                ) =>
                  setFormData({
                    ...formData,

                    email:
                      event.target
                        .value,
                  })
                }

                style={{
                  padding:
                    "14px",

                  borderRadius:
                    "10px",

                  border:
                    "1px solid #cbd5e1",
                }}
              />



              <input
                type="text"

                placeholder="Enter phone number"

                value={
                  formData.phone
                }

                onChange={(
                  event,
                ) =>
                  setFormData({
                    ...formData,

                    phone:
                      event.target
                        .value,
                  })
                }

                style={{
                  padding:
                    "14px",

                  borderRadius:
                    "10px",

                  border:
                    "1px solid #cbd5e1",
                }}
              />



              {!editingId && (

                <input
                  type="password"

                  placeholder="Enter password"

                  value={
                    formData.password
                  }

                  onChange={(
                    event,
                  ) =>
                    setFormData({
                      ...formData,

                      password:
                        event.target
                          .value,
                    })
                  }

                  style={{
                    padding:
                      "14px",

                    borderRadius:
                      "10px",

                    border:
                      "1px solid #cbd5e1",
                  }}
                />

              )}



              <button
                type="submit"

                style={{
                  background:
                    "#0f6db2",

                  color:
                    "#ffffff",

                  border:
                    "none",

                  padding:
                    "15px",

                  borderRadius:
                    "10px",

                  fontWeight:
                    "700",

                  cursor:
                    "pointer",

                  marginTop:
                    "10px",
                }}
              >
                {editingId
                  ? "Update Customer"
                  : "Create Customer"}
              </button>

            </form>

          </div>

        </div>

      )}

    </section>
  );
}

export default CustomersPage;