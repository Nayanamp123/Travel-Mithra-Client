// pages/customer/CustomerPortalPage.tsx

import { useNavigate }
  from "react-router-dom";

import CustomerPortal
  from "../../components/customer/CustomerPortal";
import { customerService } from "../../services/customerService";

function CustomerPortalPage() {
  const navigate = useNavigate();

  const customer =
    localStorage.getItem(
      "travelmithra_customer_details",
    );

  const loggedUser =
    customer
      ? JSON.parse(customer)
      : null;

  return (
    <CustomerPortal

      loggedUser={loggedUser}

      userTrips={[]}

      onLogout={async() => {
        await customerService.logout();
        localStorage.removeItem(
          "travelmithra_customer_details",
        );

        localStorage.removeItem(
          "travelmithra_customer_token",
        );
        navigate(
          "/customer/login",
        );
      }}

    />
  );
}

export default CustomerPortalPage;