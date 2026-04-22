import { useForm } from "react-hook-form";
import {
  FormInputWithError,
  FormSelectWithError,
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
        <FormInputWithError
          label="First Name"
          type="text"
          placeholder="John"
          registerProps={register("firstName", { required: "First name required" })}
          error={errors.firstName}
        />

        <FormInputWithError
          label="Last Name"
          type="text"
          placeholder="Doe"
          registerProps={register("lastName", { required: "Last name required" })}
          error={errors.lastName}
        />

        <FormInputWithError
          label="Email"
          type="email"
          placeholder="you@example.com"
          registerProps={register("email", {
            required: "Email required",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Valid email required" }
          })}
          error={errors.email}
          icon="email"
        />

        <FormInputWithError
          label="Password"
          type="password"
          placeholder="••••••••"
          registerProps={register("password", {
            required: "Password required",
            minLength: { value: 6, message: "Min 6 chars" }
          })}
          error={errors.password}
        />

        <FormSelectWithError
          label="Account Type"
          registerProps={register("accountType", { required: "Account type required" })}
          error={errors.accountType}
          options={ACCOUNT_TYPES}
        />

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
