import { useForm } from "react-hook-form";
import {
  OrDivider,
  SocialButtons,
  SubmitButton,
} from "./AuthFields";

const ACCOUNT_TYPES = [
  { value: "buyer", label: "Buy items" },
  { value: "seller", label: "Sell items" },
  { value: "both", label: "Buy and sell" },
];

export default function RegisterForm({ onSwitchToLogin }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      accountType: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // TODO: connect to POST /api/auth/register
      console.log("Register payload →", data);
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  

  return (
    <>
      <h3 style={styles.title}>Create Account</h3>
      <p style={styles.sub}>Join BAZAAR to start trading</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label style={styles.label}>First Name</label>
        <input {...register("firstName", { required: "First name required" })} type="text" placeholder="John" style={{ ...styles.input, ...(errors.firstName ? { borderColor: "#F27430" } : {}) }} />
        {errors.firstName && <p style={styles.err}>{errors.firstName.message}</p>}

        <label style={styles.label}>Last Name</label>
        <input {...register("lastName", { required: "Last name required" })} type="text" placeholder="Doe" style={{ ...styles.input, ...(errors.lastName ? { borderColor: "#F27430" } : {}) }} />
        {errors.lastName && <p style={styles.err}>{errors.lastName.message}</p>}

        <label style={styles.label}>Email</label>
        <input {...register("email", { required: "Email required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Valid email required" } })} type="email" placeholder="you@example.com" style={{ ...styles.input, ...(errors.email ? { borderColor: "#F27430" } : {}) }} />
        {errors.email && <p style={styles.err}>{errors.email.message}</p>}

        <label style={styles.label}>Password</label>
        <input {...register("password", { required: "Password required", minLength: { value: 6, message: "Min 6 chars" } })} type="password" placeholder="••••••••" style={{ ...styles.input, ...(errors.password ? { borderColor: "#F27430" } : {}) }} />
        {errors.password && <p style={styles.err}>{errors.password.message}</p>}

        <label style={styles.label}>Account Type</label>
        <select {...register("accountType", { required: "Account type required" })} style={{ ...styles.select, ...(errors.accountType ? { borderColor: "#F27430" } : {}) }}>
          <option value="">Select account type</option>
          {ACCOUNT_TYPES.map((type) => (<option key={type.value} value={type.value}>{type.label}</option>))}
        </select>
        {errors.accountType && <p style={styles.err}>{errors.accountType.message}</p>}

        <p style={styles.terms}>By registering, you agree to our <span style={styles.link}>Terms</span> and <span style={styles.link}>Privacy</span></p>

        <SubmitButton onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </SubmitButton>

        <OrDivider />
        <SocialButtons />
      </form>

      <p style={styles.switchText}>Already have an account? <span style={styles.switchLink} onClick={onSwitchToLogin}>Sign in</span></p>
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
  select: {
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
    appearance: "none",
    WebkitAppearance: "none",
  },
  err: {
    fontSize: "0.72rem",
    color: "#F27430",
    fontFamily: "'DM Sans', sans-serif",
    marginTop: "-0.6rem",
    marginBottom: "0.5rem",
  },
  terms: {
    fontSize: "0.72rem",
    color: "rgba(255,255,255,0.32)",
    textAlign: "center",
    lineHeight: 1.6,
    marginTop: "-0.25rem",
    marginBottom: "0.25rem",
    fontFamily: "'DM Sans', sans-serif",
  },
  link: {
    color: "#EDD377",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  switchText: {
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.38)",
    textAlign: "center",
    marginTop: "0.75rem",
    fontFamily: "'DM Sans', sans-serif",
  },
  switchLink: {
    color: "#EDD377",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
};
