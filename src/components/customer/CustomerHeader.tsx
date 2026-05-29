// components/customer/CustomerHeader.tsx

import { MouseEvent } from "react";

import { useNavigate }
  from "react-router-dom";

type CustomerHeaderProps = {
  accountMenuOpen: boolean;

  onAccountMenuToggle: () => void;
};

function CustomerHeader({
  accountMenuOpen,
  onAccountMenuToggle,
}: CustomerHeaderProps) {
  const navigate = useNavigate();

  const customer =
    localStorage.getItem(
      "travelmithra_customer_details",
    );

  const loggedUser =
    customer
      ? JSON.parse(customer)
      : null;

  const handleLogout = () => {
    localStorage.removeItem(
      "travelmithra_customer_details",
    );

    localStorage.removeItem(
      "travelmithra_customer_token",
    );

    navigate("/");
  };

  return (
    <header className="site-header">

      <a
        className="site-logo"
        href="#home"
        aria-label="Travel Mithra home"
      >
        <img
          src="/assets/pdf-image-1.jpeg"
          alt="Travel Mithra"
        />
      </a>



      <nav
        className="site-nav"
        aria-label="Main navigation"
      >

        <a href="#home">
          Home
        </a>

        <a href="#about">
          About
        </a>

        <a href="#tours">
          Tours
        </a>

        <a href="#destination">
          Destination
        </a>

        <a href="#contact">
          Contact
        </a>

      </nav>



      <div className="site-actions">

        <button
          className="circle-button search-icon"
          type="button"
          aria-label="Search tours"
          title="Search"
          onClick={() => {
            document
              .querySelector(
                ".trip-search-panel",
              )
              ?.scrollIntoView({
                behavior:
                  "smooth",

                block:
                  "center",
              });

            (
              document.querySelector(
                "#homeDestination",
              ) as HTMLSelectElement | null
            )?.focus();
          }}
        />



        <div
          className="account-menu-wrap"
          onClick={(
            event: MouseEvent,
          ) =>
            event.stopPropagation()
          }
        >

          <button
            className="circle-button user-icon"
            type="button"
            aria-label="Account menu"
            title="Account"
            onClick={
              onAccountMenuToggle
            }
          />



          <div
            className={`account-menu ${
              accountMenuOpen
                ? ""
                : "hidden"
            }`}
          >

            {loggedUser ? (
              <>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/customer/portal",
                    )
                  }
                >
                  Portal
                </button>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                >
                  Logout
                </button>

              </>
            ) : (
              <>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/customer/login",
                    )
                  }
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/customer/login",
                    )
                  }
                >
                  Registration
                </button>

              </>
            )}

          </div>

        </div>

      </div>

    </header>
  );
}

export default CustomerHeader;