import '../styles/globals.css';

export default function NavbarLoader() {
  return (
    <div className="h-16 flex items-center justify-between px-4 md:px-8 bg-brown-900/95 border-b border-gold-400/20 gap-8">
      {/* Logo skeleton */}
      <div className="skeleton w-20 h-6 flex-shrink-0"></div>

      {/* Links skeleton */}
      <div className="hidden md:flex gap-8 flex-1 justify-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton w-12 h-4"></div>
        ))}
      </div>

      {/* Actions skeleton */}
      <div className="flex gap-3 items-center ml-auto">
        <div className="skeleton w-8 h-8 rounded-full"></div>
        <div className="skeleton w-8 h-8 rounded-full"></div>
        <div className="skeleton w-8 h-8 rounded-full"></div>
        <div className="skeleton w-10 h-10 rounded-full"></div>
      </div>
    </div>
  );
}
