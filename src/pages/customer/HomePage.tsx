// pages/customer/HomePage.tsx

import CustomerHeader
  from "../../components/customer/CustomerHeader";

import type {
  AuthMode,
  PendingTripSearch,
} from "../../types/travel";

type HomePageProps = {
  accountMenuOpen: boolean;

  filterMenuOpen: boolean;

  homeSearch: PendingTripSearch;

  tourFilter: string;

  onAuthOpen: (
    mode: AuthMode,
  ) => void;

  onHomeSearchChange: (
    search: PendingTripSearch,
  ) => void;

  onTourFilterChange: (
    filter: string,
  ) => void;

  onAccountMenuToggle: () => void;

  onFilterMenuToggle: () => void;

  onAccountMenuClose: () => void;

  onFilterMenuClose: () => void;

  onTripSelection: () => void;
};

function HomePage({
  accountMenuOpen,
  onAccountMenuToggle,
  onTripSelection,
}: HomePageProps) {

  return (
    <section
      id="customerHomeView"
      className="customer-home-view"
    >

      <CustomerHeader
        accountMenuOpen={
          accountMenuOpen
        }
        onAccountMenuToggle={
          onAccountMenuToggle
        }
      />



      <section
        className="home-hero-section"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.45)), url('/assets/cover-image-1.jpg')",

          backgroundSize:
            "cover",

          backgroundPosition:
            "center",

          backgroundRepeat:
            "no-repeat",

          minHeight: "100vh",

          display: "flex",

          alignItems: "center",

          justifyContent:
            "center",

          padding:
            "120px 40px 40px",
        }}
      >

        <div
          style={{
            textAlign: "center",

            color: "#ffffff",

            maxWidth: "900px",
          }}
        >

          <p
            style={{
              letterSpacing: "4px",

              fontSize: "15px",

              marginBottom: "20px",

              textTransform:
                "uppercase",

              color:
                "rgba(255,255,255,0.85)",
            }}
          >
            Explore • Discover • Travel
          </p>



          <h1
            style={{
              fontSize: "72px",

              lineHeight: "88px",

              fontWeight: "800",

              marginBottom: "28px",

              textShadow:
                "0 4px 18px rgba(0,0,0,0.35)",
            }}
          >
            Explore The World
            <br />
            With Travel Mithra
          </h1>



          <p
            style={{
              fontSize: "20px",

              lineHeight: "36px",

              maxWidth: "720px",

              margin:
                "0 auto",

              color:
                "rgba(255,255,255,0.92)",
            }}
          >
            Discover breathtaking destinations,
            unforgettable adventures,
            and premium travel experiences
            crafted specially for you.
          </p>



          <div
            style={{
              marginTop: "40px",

              display: "flex",

              justifyContent:
                "center",

              gap: "18px",

              flexWrap: "wrap",
            }}
          >

            <button
              type="button"

              style={{
                padding:
                  "16px 38px",

                border:
                  "2px solid transparent",

                borderRadius:
                  "10px",

                background:
                  "#ffffff",

                color:
                  "#111827",

                cursor:
                  "pointer",

                fontSize:
                  "16px",

                fontWeight:
                  "700",

                transition:
                  "0.3s ease",
              }}

              onClick={
                onTripSelection
              }
            >
              Book Your Trip
            </button>



            <button
              type="button"

              style={{
                padding:
                  "16px 38px",

                border:
                  "2px solid rgba(255,255,255,0.7)",

                borderRadius:
                  "10px",

                background:
                  "transparent",

                color:
                  "#ffffff",

                cursor:
                  "pointer",

                fontSize:
                  "16px",

                fontWeight:
                  "700",
              }}
            >
              Explore Destinations
            </button>

          </div>

        </div>

      </section>

    </section>
  );
}

export default HomePage;