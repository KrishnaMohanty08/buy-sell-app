import { ArrowRight, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/cart";
import { useNavigate } from "react-router-dom";

export default function CartSummary({ totals, onClear, clearLoading = false }) {
  const hasItems = totals.itemCount > 0;
  const canCheckout = totals.checkoutItemCount > 0 && totals.unavailableCount === 0;
  const navigate = useNavigate();
  console.log('totals:', totals);
console.log('canCheckout:', canCheckout);
  return (
    <aside className="sticky top-20 rounded-lg border border-gold-400/20 bg-white/[0.04] p-5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-dm-sans text-base font-semibold text-white">Order summary</h2>
        {hasItems && (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-white/45 transition hover:bg-white/5 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-gold-400 disabled:opacity-60"
            onClick={onClear}
            disabled={clearLoading}
          >
            {clearLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Clear
          </button>
        )}
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between text-white/60">
          <span>Items</span>
          <span>{totals.checkoutItemCount}</span>
        </div>
        <div className="flex items-center justify-between text-white/60">
          <span>Subtotal</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-white/60">
          <span>Shipping</span>
          <span className="text-gold-400">Calculated later</span>
        </div>
        {totals.unavailableCount > 0 && (
          <div className="rounded-lg border border-orange-500/25 bg-orange-500/10 px-3 py-2 text-xs leading-5 text-orange-100">
            {totals.unavailableCount} item{totals.unavailableCount === 1 ? "" : "s"} need attention before checkout.
          </div>
        )}
      </div>

      <div className="my-5 h-px bg-gold-400/15" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">Total</span>
        <span className="font-playfair text-2xl font-semibold text-gold-400">
          {formatCurrency(totals.total)}
        </span>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        disabled={!canCheckout}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${canCheckout ? 'bg-gradient-to-r from-gold-400 to-orange-400 text-gray-900 hover:from-gold-500 hover:to-orange-500' : 'bg-gold-400/30 text-white/50 cursor-not-allowed'}`}
      >
        Checkout
      </button>

      <div className="mt-4 flex items-center gap-2 text-xs leading-5 text-white/45">
        <ShieldCheck className="h-4 w-4 flex-shrink-0 text-gold-400" strokeWidth={2} />
        <span>Protected marketplace payments and seller checks are applied at purchase.</span>
      </div>
    </aside>
  );
}
