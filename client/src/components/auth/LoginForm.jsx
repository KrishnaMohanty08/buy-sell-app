import { useForm } from "react-hook-form";
import {
  FormInputWithError,
  OrDivider,
  SocialButtons,
  SubmitButton,
} from "./AuthFields";
import { login } from "../../api/auth.js";

export default function LoginForm({ onSwitchToRegister }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try{
      const result = await login(data.email,data.password);
      console.log("Login successful:", result);
    }catch(error){
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <h3 style={styles.title}>Welcome back</h3>
      <p style={styles.sub}>Sign in to your BAZAAR account</p>
      <form onSubmit={handleSubmit(onSubmit)}>
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

      <p style={styles.forgot}>Forgot password?</p>
      </form>
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
