import { FormEvent, useState } from "react";
import { destinationService } from "../../services/destinationService";

function DestinationManagement() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Destination name is required");
      setMessage(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      await destinationService.createDestination(name.trim(), description.trim() || undefined);

      setMessage("Destination created successfully.");
      setName("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create destination");
    } finally {
      setLoading(false);
    }
  };

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
        }}
      >
        <h1
          style={{
            marginBottom: "24px",
            fontSize: "28px",
            fontWeight: 700,
            color: "#152334",
          }}
        >
          Create Destination
        </h1>

        <p
          style={{
            marginBottom: "24px",
            color: "#475569",
            lineHeight: 1.7,
          }}
        >
          This page is only available to super admins. Add a new travel destination by providing its name and an optional description.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              Destination Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter destination name"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "16px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter destination description"
              rows={5}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "16px",
                resize: "vertical",
              }}
            />
          </div>

          {message && (
            <div
              style={{
                marginBottom: "20px",
                padding: "16px",
                borderRadius: "12px",
                background: "#ecfdf5",
                color: "#166534",
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "16px",
                borderRadius: "12px",
                background: "#fef2f2",
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#152334",
              color: "#ffffff",
              border: "none",
              padding: "14px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 700,
              minWidth: "160px",
            }}
          >
            {loading ? "Creating..." : "Create Destination"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default DestinationManagement;
