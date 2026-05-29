// pages/customer/customerLoginPage.tsx

import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { customerService } from "../../services/customerService";

function CustomerLoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loginError, setLoginError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget,
    );

    const email = String(
      formData.get("email") || "",
    ).trim();

    const password = String(
      formData.get("password") || "",
    );

    if (!email || !password) {
      setLoginError(
        "Email and password are required",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      setLoginError("");

      await customerService.login(
        email,
        password,
      );

      navigate("/customer/portal", {
        replace: true,
      });
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : "Invalid login details",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-view customer-login-page">
      <div className="login-panel">
        <Link
          className="auth-close"
          to="/"
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
              Customer Login
            </button>
          </div>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >
            <label>
              Email

              <input
                name="email"
                type="email"
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
                  autoComplete="current-password"
                />

                <button
                  className="password-toggle"
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                >
                  <span>
                    {showPassword
                      ? "Hide"
                      : "View"}
                  </span>
                </button>
              </span>
            </label>

            <p className="error-text">
              {loginError}
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Logging in..."
                : "Login"}
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}

export default CustomerLoginPage;