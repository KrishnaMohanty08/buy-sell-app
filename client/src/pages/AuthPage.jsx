import { useState } from "react";
import AuthLeftPanel from "../components/auth/AuthLeftPanel";
import LoginForm    from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

import '../styles/globals.css';

const TABS = [
  { id: "login",    label: "Sign in" },
  { id: "register", label: "Register" },
];

export default function AuthPage() {
  const [tab, setTab] = useState("login");

  return (
    <div className="auth-page">

        {/* Left decorative panel */}
        <AuthLeftPanel />

        {/* Right form panel */}
        <div className="auth-right">
          <div className="auth-form-card">

            {/* Tab switcher */}
            <div className="auth-tab-row" role="tablist">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
                  className={`auth-tab-btn${tab === id ? " active" : ""}`}
                  onClick={() => setTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Forms */}
            {tab === "login"
              ? <LoginForm    onSwitchToRegister={() => setTab("register")} />
              : <RegisterForm onSwitchToLogin={()    => setTab("login")} />
            }

          </div>
        </div>

      </div>
  );
}
