import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  FormInputWithError,
  SocialButtons,
  SubmitButton,
} from "./AuthFields";
import { login, requestOtp, verifyOtp } from "../../api/auth.js";
import "../../styles/login.css";

export default function LoginForm({ onSwitchToRegister }) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: "",
      password: "",
      otp: "",
    },
  });

  const [activeMethod, setActiveMethod] = React.useState(null); // "password" | "otp" | "social"
  const [otpSent, setOtpSent] = React.useState(false);
  const [requestLoading, setRequestLoading] = React.useState(false);
  const [verifyLoading, setVerifyLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Password login
  const handlePasswordLogin = async (data) => {
    try {
      setErrorMessage("");
      const result = await login(data.email, data.password);
      console.log("Login successful:", result);
      navigate("/explore");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(error.message || "Login failed. Please try again.");
    }
  };

  // OTP request
  const handleRequestOtp = async (data) => {
    const email = data.email;
    if (!email) return;
    try {
      setErrorMessage("");
      setRequestLoading(true);
      await requestOtp(email);
      setOtpSent(true);
    } catch (err) {
      console.error('Request OTP failed', err);
      setErrorMessage(err.message || "Failed to send OTP. Please try again.");
      setOtpSent(false);
    } finally {
      setRequestLoading(false);
    }
  };

  // OTP verify
  const handleVerifyOtp = async (data) => {
    const email = data.email;
    const otp = data.otp;
    if (!email || !otp) return;
    try {
      setErrorMessage("");
      setVerifyLoading(true);
      const result = await verifyOtp(email, otp);
      console.log('OTP verify success', result);
      navigate('/explore');
    } catch (err) {
      console.error('Verify OTP failed', err);
      setErrorMessage(err.message || "Invalid OTP. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <>
      <h3 className="title">Welcome back</h3>
      <p className="sub">Sign in to your BAZAAR account</p>

      {/* Error message */}
      {errorMessage && (
        <div className="errorBox">
          <p className="errorText">{errorMessage}</p>
        </div>
      )}

      {/* No method selected: show 3 options */}
      {!activeMethod && (
        <div>
          <p className="methodLabel">Choose a login method</p>

          {/* Option 1: Email-Password */}
          <button
            type="button"
            className="methodButton"
            onClick={() => setActiveMethod("password")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 6l9 6 9-6" />
            </svg>
            <span>Email & Password</span>
          </button>

          {/* Option 2: Email-OTP */}
          <button
            type="button"
            className="methodButton"
            onClick={() => { setActiveMethod("otp"); setOtpSent(false); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="9" y1="7" x2="15" y2="7" />
              <line x1="9" y1="11" x2="15" y2="11" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <span>Email & OTP</span>
          </button>

          {/* Option 3: Social Login */}
          <button
            type="button"
            className="methodButton"
            onClick={() => setActiveMethod("social")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <circle cx="19" cy="12" r="1" fill="currentColor" />
              <circle cx="5" cy="12" r="1" fill="currentColor" />
            </svg>
            <span>Google / GitHub</span>
          </button>
        </div>
      )}

      {/* Method: Email-Password */}
      {activeMethod === "password" && (
        <form onSubmit={handleSubmit(handlePasswordLogin)}>
          <FormInputWithError
            label="Email"
            type="email"
            placeholder="you@example.com"
            registerProps={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            error={errors.email}
            autoComplete="email"
            icon="email"
          />

          <FormInputWithError
            label="Password"
            type="password"
            placeholder="••••••••"
            registerProps={register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
            error={errors.password}
            autoComplete="current-password"
          />

          <p className="forgot">Forgot password?</p>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </SubmitButton>

          <button
            type="button"
            className="backButton"
            onClick={() => setActiveMethod(null)}
          >
            Back
          </button>
        </form>
      )}

      {/* Method: Email-OTP */}
      {activeMethod === "otp" && (
        <form onSubmit={handleSubmit(otpSent ? handleVerifyOtp : handleRequestOtp)}>
          <FormInputWithError
            label="Email"
            type="email"
            placeholder="you@example.com"
            registerProps={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            error={errors.email}
            autoComplete="email"
            icon="email"
          />

          {!otpSent && (
            <p className="helperText">We'll send a one-time code to your email</p>
          )}

          {otpSent && (
            <FormInputWithError
              label="OTP"
              type="text"
              placeholder="Enter 6-digit code"
              registerProps={register("otp", {
                required: "OTP is required",
              })}
              error={errors.otp}
              autoComplete="one-time-code"
            />
          )}

          {!otpSent ? (
            <SubmitButton type="submit" disabled={requestLoading}>
              {requestLoading ? "Sending OTP..." : "Send OTP"}
            </SubmitButton>
          ) : (
            <>
              <SubmitButton type="submit" disabled={verifyLoading}>
                {verifyLoading ? "Verifying..." : "Verify OTP"}
              </SubmitButton>

              <div className="center-row">
                <button
                  type="button"
                  className="smallLink"
                  onClick={handleSubmit(handleRequestOtp)}
                  disabled={requestLoading}
                >
                  Resend
                </button>
              </div>
            </>
          )}

          <button
            type="button"
            className="backButton"
            onClick={() => { setActiveMethod(null); setOtpSent(false); }}
          >
            Back
          </button>
        </form>
      )}

      {/* Method: Social Login */}
      {activeMethod === "social" && (
        <div>
          <SocialButtons />

          <button
            type="button"
            className="backButton"
            onClick={() => setActiveMethod(null)}
          >
            Back
          </button>
        </div>
      )}

      {/* Footer: Register link */}
      <p className="switchText">
        Don't have an account?{" "}
        <span className="switchLink" onClick={onSwitchToRegister}>
          Register
        </span>
      </p>
    </>
  );
}

