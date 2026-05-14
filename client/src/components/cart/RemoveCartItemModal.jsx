import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { getCartItemTitle } from "../../utils/cart";

export default function RemoveCartItemModal({ item, loading = false, onCancel, onConfirm }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-gold-400/20 bg-brown-900 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15 text-orange-500">
              <AlertTriangle className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-dm-sans text-lg font-semibold text-white">Remove item?</h2>
              <p className="mt-1 text-sm text-white/55">{getCartItemTitle(item)}</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded p-1 text-white/50 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-400"
            onClick={onCancel}
            aria-label="Close remove confirmation"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="h-10 rounded-lg border border-gold-400/25 px-4 text-sm font-medium text-white/75 transition hover:border-gold-400/50 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
            onClick={onCancel}
            disabled={loading}
          >
            Keep item
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} /> : <Trash2 className="h-4 w-4" strokeWidth={2} />}
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
