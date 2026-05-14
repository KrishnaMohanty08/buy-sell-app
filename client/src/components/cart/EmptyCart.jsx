import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyCart({ compact = false, onAction }) {
  const navigate = useNavigate();

  const handleBrowse = () => {
    onAction?.();
    navigate("/explore");
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-gold-400/15 bg-white/[0.03] text-center ${
        compact ? "px-5 py-10" : "min-h-[420px] px-6 py-14"
      }`}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-gold-400/25 bg-gold-400/10 text-gold-400">
        <ShoppingBag className="h-7 w-7" strokeWidth={1.8} />
      </div>
      <h2 className="font-dm-sans text-xl font-semibold text-white">Your cart is empty</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">
        Save standout finds here and come back when you are ready to buy.
      </p>
      <button
        type="button"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-gold-400 to-orange-500 px-5 text-sm font-semibold text-brown-900 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gold-400"
        onClick={handleBrowse}
      >
        Explore listings
      </button>
    </div>
  );
}
