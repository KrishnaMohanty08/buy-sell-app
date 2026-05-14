import '../styles/globals.css';

export default function NavbarLoader() {
  return (
    <div className="navbar-loader">
      {/* Logo skeleton */}
      <div className="loader-skeleton loader-logo"></div>

      {/* Links skeleton */}
      <div className="loader-links">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="loader-skeleton loader-link"></div>
        ))}
      </div>

      {/* Actions skeleton */}
      <div className="loader-actions">
        <div className="loader-skeleton loader-icon"></div>
        <div className="loader-skeleton loader-icon"></div>
        <div className="loader-skeleton loader-icon"></div>
        <div className="loader-skeleton loader-avatar"></div>
      </div>
    </div>
  );
}
