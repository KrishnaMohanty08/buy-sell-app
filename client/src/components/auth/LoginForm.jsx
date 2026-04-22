import { useForm } from "react-hook-form";
import {
  OrDivider,
  SocialButtons,
  SubmitButton,
} from "./AuthFields";

export default function LoginForm({ onSwitchToRegister }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // TODO: connect to POST /api/auth/login
      console.log("Login payload →", data);
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <h3 style={styles.title}>Welcome back</h3>
      <p style={styles.sub}>Sign in to your BAZAAR account</p>

      <label style={styles.label}>Email</label>
      <input
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email address",
          },
        })}
        type="email"
        placeholder="you@example.com"
        style={{ ...styles.input, ...(errors.email ? { borderColor: "#F27430" } : {}) }}
        autoComplete="email"
      />
      {errors.email && <p style={styles.err}>{errors.email.message}</p>}

      <label style={styles.label}>Password</label>
      <input
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Min 6 characters" },
        })}
        type="password"
        placeholder="••••••••"
        style={{ ...styles.input, ...(errors.password ? { borderColor: "#F27430" } : {}) }}
        autoComplete="current-password"
      />
      {errors.password && <p style={styles.err}>{errors.password.message}</p>}

      <p style={styles.forgot}>Forgot password?</p>

      <SubmitButton onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </SubmitButton>

      <OrDivider />
      <SocialButtons />

      <p style={styles.switchText}>
        Don't have an account?{" "}
        <span style={styles.switchLink} onClick={onSwitchToRegister}>
          Register
        </span>
      </p>
    </>
  );
}

const styles = {
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.55rem",
    fontWeight: 600,
    color: "#fff",
    marginBottom: "0.3rem",
  },
  sub: {
    fontSize: "0.8rem",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 300,
    color: "rgba(255,255,255,0.52)",
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
    marginBottom: 6,
    fontFamily: "'DM Sans', sans-serif",
  },
  input: {
    width: "100%",
    height: 44,
    padding: "0 14px",
    background: "rgba(255,255,255,0.04)",
    borderWidth: "0.5px",
    borderStyle: "solid",
    borderColor: "rgba(242,185,73,0.22)",
    borderRadius: 10,
    color: "#fff",
    fontSize: "0.88rem",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    marginBottom: "1rem",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
  },
  err: {
    fontSize: "0.72rem",
    color: "#F27430",
    fontFamily: "'DM Sans', sans-serif",
    marginTop: "-0.6rem",
    marginBottom: "0.6rem",
  },
  forgot: {
    fontSize: "0.75rem",
    color: "#EDD377",
    textAlign: "right",
    marginTop: "-0.5rem",
    marginBottom: "1rem",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  switchText: {
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.38)",
    textAlign: "center",
    marginTop: "1rem",
    fontFamily: "'DM Sans', sans-serif",
  },
  switchLink: {
    color: "#EDD377",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
};
