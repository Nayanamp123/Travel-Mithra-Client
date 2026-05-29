// AdminLoginPage.tsx

import {
  FormEvent,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  adminService,
} from "../../services/adminService";



function AdminLoginPage() {

  const navigate =
    useNavigate();

  const [showPassword,
    setShowPassword,
  ] = useState(false);

  const [loginError,
    setLoginError,
  ] = useState("");

  const [isSubmitting,
    setIsSubmitting,
  ] = useState(false);



  const handleLogin = async (
    event:
      FormEvent<HTMLFormElement>,
  ) => {

    event.preventDefault();

    const formData =
      new FormData(
        event.currentTarget,
      );

    const email =
      String(
        formData.get(
          "email",
        ) || "",
      ).trim();

    const password =
      String(
        formData.get(
          "password",
        ) || "",
      );



    if (
      !email ||
      !password
    ) {

      setLoginError(
        "Email and password are required",
      );

      return;
    }



    try {

      setIsSubmitting(
        true,
      );

      setLoginError("");

      await adminService.login(
        email,
        password,
      );

      navigate(
        "/admin/dashboard",
        {
          replace: true,
        },
      );

    } catch (error) {

      setLoginError(
        error instanceof Error
          ? error.message
          : "Invalid admin credentials",
      );

    } finally {

      setIsSubmitting(
        false,
      );

    }
  };



  return (
    <section className="login-view admin-login-page">
      <div className="login-panel">
        <Link
          className="auth-close"
          to="/"
          aria-label="Close login page"
        >
          &times;
        </Link>



        <img
          className="brand-logo"
          src="/assets/pdf-image-1.jpeg"
          alt="Travel Mithra"
        />



        <section className="access-panel">

          <div className="auth-tabs">

            <button
              className="is-active"
              type="button"
            >
              Admin Login
            </button>

          </div>



          <form
            className="login-form"
            onSubmit={
              handleLogin
            }
          >

            <label>

              Email

              <input
                name="email"
                type="email"
                placeholder="Enter email"
                autoComplete="email"
              />

            </label>



            <label>

              Password

              <span className="password-field">

                <input
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter password"
                  autoComplete="current-password"
                />



                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (
                        current,
                      ) =>
                        !current,
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "View"}
                </button>

              </span>

            </label>



            {loginError && (
              <p className="error-text">
                {loginError}
              </p>
            )}



            <button
              type="submit"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting
                ? "Logging in..."
                : "Admin Login"}
            </button>

          </form>

        </section>

      </div>

    </section>
  );
}

export default AdminLoginPage;