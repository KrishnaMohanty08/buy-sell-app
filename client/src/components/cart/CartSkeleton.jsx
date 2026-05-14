export default function CartSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[84px_1fr] gap-4 rounded-lg border border-gold-400/15 bg-white/[0.03] p-4"
        >
          <div className="h-24 rounded-lg bg-gold-400/10 animate-pulse" />
          <div className="space-y-3 py-1">
            <div className="h-4 w-2/3 rounded bg-gold-400/10 animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-white/10 animate-pulse" />
            <div className="flex items-center justify-between pt-5">
              <div className="h-8 w-28 rounded bg-white/10 animate-pulse" />
              <div className="h-5 w-20 rounded bg-gold-400/10 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
