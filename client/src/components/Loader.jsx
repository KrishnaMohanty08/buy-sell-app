import { useEffect, useState } from "react";

const styles = `
  @keyframes shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes loadBar {
    0%   { width: 0%; }
    60%  { width: 70%; }
    100% { width: 100%; }
  }
  @keyframes dotPulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.35); }
  }
  .loader-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    background: linear-gradient(135deg, #F2B949, #F2E829, #F2B949);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 2s ease infinite;
  }
  .loader-bar-fill {
    height: 100%;
    width: 0;
    border-radius: 2px;
    background: linear-gradient(90deg, #F2B949, #F2E829);
    animation: loadBar 1.8s ease forwards;
  }
`;

export default function Loader({ onComplete }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setHidden(true);
      onComplete?.();
    }, 2200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <>
      <style>{styles}</style>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#1a1208",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          transition: "opacity 0.6s ease, visibility 0.6s",
          opacity: hidden ? 0 : 1,
          visibility: hidden ? "hidden" : "visible",
          pointerEvents: hidden ? "none" : "all",
        }}
      >
        {/* Logo */}
        <span className="loader-logo-text">BAZAAR</span>

        {/* Progress bar */}
        <div
          style={{
            width: 200,
            height: 2,
            background: "rgba(242,185,73,0.15)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div className="loader-bar-fill" />
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#EDD377",
                display: "inline-block",
                animation: `dotPulse 1.2s ease infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
