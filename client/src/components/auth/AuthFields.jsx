import { useState } from "react";

/* ─── Shared inline styles ─── */
const S = {
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
  wrap: { position: "relative" },
  input: {
    width: "100%",
    height: 44,
    padding: "0 42px 0 14px",
    background: "rgba(255,255,255,0.04)",
    borderWidth: "0.5px",           // ← Replace border
    borderStyle: "solid",           // ← Replace border
    borderColor: "rgba(242,185,73,0.22)",  // ← Replace border
    borderRadius: 10,
    color: "#fff",
    fontSize: "0.88rem",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color .2s, background .2s",
    boxSizing: "border-box",
  },
  iconRight: {
    position: "absolute",
    right: 13,
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(255,255,255,0.32)",
    pointerEvents: "none",
    display: "flex",
  },
  eyeBtn: {
    position: "absolute",
    right: 13,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgba(255,255,255,0.32)",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
};

const focusStyle = "border-color:#F2B949;background:rgba(255,255,255,0.07);";

/* ─── EmailIcon ─── */
const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="1" y="3" width="14" height="10" rx="2" />
    <path d="M1 5l7 5 7-5" />
  </svg>
);

/* ─── EyeIcon ─── */
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
      <circle cx="8" cy="8" r="2" />
      <line x1="2" y1="2" x2="14" y2="14" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );

/* ─── FormField — generic text / email / password input ─── */
export function FormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,         // "email" | undefined
  autoComplete,
  name,
}) {
  const [focused, setFocused] = useState(false);
  const [show, setShow]       = useState(false);

  const isPassword = type === "password";
  const inputType  = isPassword ? (show ? "text" : "password") : type;

  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label style={S.label}>{label}</label>}
      <div style={S.wrap}>
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...S.input,
            ...(focused
              ? { borderColor: "#F2B949", background: "rgba(255,255,255,0.07)" }
              : {}),
          }}
        />

        {/* Right adornment — eye toggle for password, icon for others */}
        {isPassword ? (
          <button
            type="button"
            style={S.eyeBtn}
            onClick={() => setShow((v) => !v)}
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
          >
            <EyeIcon open={show} />
          </button>
        ) : icon === "email" ? (
          <span style={S.iconRight}>
            <EmailIcon />
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* ─── SelectField ─── */
export function SelectField({ label, value, onChange, options, name }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label style={S.label}>{label}</label>}
      <div style={S.wrap}>
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...S.input,
            padding: "0 2.5rem 0 14px",
            cursor: "pointer",
            background: focused
              ? "rgba(255,255,255,0.07)"
              : "#221809",
            borderColor: focused
              ? "#F2B949"
              : "rgba(242,185,73,0.22)",
            appearance: "none",
            WebkitAppearance: "none",
            color: value ? "#fff" : "rgba(255,255,255,0.32)",
          }}
        >
          <option value="" disabled style={{ color: "#888", background: "#221809" }}>
            {options[0]?.placeholder ?? "Select…"}
          </option>
          {options.map(({ value: v, label: l }) => (
            <option key={v} value={v} style={{ color: "#fff", background: "#221809" }}>
              {l}
            </option>
          ))}
        </select>
        {/* chevron */}
        <span style={{ ...S.iconRight, pointerEvents: "none" }}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 1l5 5 5-5" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/* ─── PasswordStrength bar ─── */
export function PasswordStrength({ value }) {
  const score = [
    value.length >= 8,
    /[A-Z]/.test(value),
    /[0-9]/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length;

  const color =
    score <= 1 ? "#F27430" :
    score <= 2 ? "#F2B949" :
                 "#4ade80";

  return (
    <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 2,
            borderRadius: 2,
            background: i <= score ? color : "rgba(255,255,255,0.1)",
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Divider with text ─── */
export function OrDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.25rem 0" }}>
      <div style={{ flex: 1, height: "0.5px", background: "rgba(242,185,73,0.22)" }} />
      <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans',sans-serif" }}>
        or
      </span>
      <div style={{ flex: 1, height: "0.5px", background: "rgba(242,185,73,0.22)" }} />
    </div>
  );
}

/* ─── Social OAuth buttons ─── */
export function SocialButtons() {
  const btnStyle = {
    width: "100%",
    height: 42,
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(242,185,73,0.22)",
    borderRadius: 9999,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.82rem",
    color: "rgba(255,255,255,0.55)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: "0.6rem",
    transition: "all 0.2s",
  };

  return (
    <>
      <button
        type="button"
        style={btnStyle}
        onMouseEnter={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.color="#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="rgba(255,255,255,0.55)"; }}
      >
        {/* Google */}
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <button
        type="button"
        style={btnStyle}
        onMouseEnter={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.color="#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="rgba(255,255,255,0.55)"; }}
      >
        {/* GitHub */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
        Continue with GitHub
      </button>
    </>
  );
}

/* ─── Primary submit button ─── */
export function SubmitButton({ children, onClick, type = "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        width: "100%",
        height: 46,
        background: "linear-gradient(135deg, #F2B949, #F27430)",
        border: "none",
        borderRadius: 9999,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.9rem",
        fontWeight: 500,
        color: "#1a1208",
        cursor: "pointer",
        marginBottom: "1rem",
        transition: "opacity .2s, transform .15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1";    e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {children}
    </button>
  );
}
