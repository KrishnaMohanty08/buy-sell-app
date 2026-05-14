import { Loader2, Minus, Package, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  formatCurrency,
  getCartItemImage,
  getCartItemSeller,
  getCartItemTitle,
} from "../../utils/cart";

export default function CartItemRow({
  item,
  compact = false,
  isRemoving = false,
  isUpdating = false,
  onQuantityCommit,
  onRemoveRequest,
}) {
  const [quantityDraft, setQuantityDraft] = useState({
    itemId: item.id,
    serverQuantity: item.quantity,
    quantity: item.quantity,
  });
  const localQuantity =
    quantityDraft.itemId === item.id && quantityDraft.serverQuantity === item.quantity
      ? quantityDraft.quantity
      : item.quantity;
  const image = getCartItemImage(item);
  const title = getCartItemTitle(item);
  const seller = getCartItemSeller(item);
  const maxQuantity = Math.max(1, item.maxQuantity || 99);
  const canEditQuantity = item.isAvailable && !item.optimistic && !isRemoving;
  const displayedLineTotal = Number(item.unitPrice || item.listing?.price || 0) * localQuantity;

  useEffect(() => {
    if (localQuantity === item.quantity || item.optimistic) return undefined;

    const timeout = window.setTimeout(() => {
      onQuantityCommit(item.id, localQuantity);
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [item.id, item.optimistic, item.quantity, localQuantity, onQuantityCommit]);

  const setLocalQuantity = (updater) => {
    const nextQuantity = typeof updater === "function" ? updater(localQuantity) : updater;

    setQuantityDraft({
      itemId: item.id,
      serverQuantity: item.quantity,
      quantity: nextQuantity,
    });
  };

  const decreaseQuantity = () => {
    setLocalQuantity((value) => Math.max(1, value - 1));
  };

  const increaseQuantity = () => {
    setLocalQuantity((value) => Math.min(maxQuantity, value + 1));
  };

  return (
    <article className="rounded-lg border border-gold-400/15 bg-white/[0.03] p-3 transition hover:border-gold-400/30 sm:p-4">
      <div className={`grid gap-4 ${compact ? "grid-cols-[72px_1fr]" : "grid-cols-[88px_1fr] sm:grid-cols-[112px_1fr]"}`}>
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-brown-800">
          {image ? (
            <img src={image} alt={title} className="h-full min-h-24 w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-24 items-center justify-center text-gold-400/65">
              <Package className="h-8 w-8" strokeWidth={1.6} />
            </div>
          )}
          {!item.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 px-2 text-center text-[10px] font-semibold uppercase tracking-wide text-white">
              Unavailable
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-dm-sans text-sm font-semibold text-white sm:text-base">
                {title}
              </h3>
              <p className="mt-1 truncate text-xs text-white/45">Sold by {seller}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded bg-gold-400/10 px-2 py-1 text-xs font-medium text-gold-400">
                  {formatCurrency(item.unitPrice)}
                </span>
                {item.priceChanged && (
                  <span className="rounded bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-200">
                    Price updated
                  </span>
                )}
                {item.status && (
                  <span className="rounded bg-red-500/10 px-2 py-1 text-xs font-medium text-red-200">
                    {item.status}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              className="rounded-lg p-2 text-white/45 transition hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => onRemoveRequest(item)}
              disabled={isRemoving}
              aria-label={`Remove ${title}`}
            >
              {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex h-9 items-center overflow-hidden rounded-lg border border-gold-400/20 bg-brown-900/70">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center text-white/60 transition hover:bg-white/5 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 disabled:cursor-not-allowed disabled:opacity-35"
                onClick={decreaseQuantity}
                disabled={!canEditQuantity || localQuantity <= 1 || isUpdating}
                aria-label={`Decrease quantity for ${title}`}
              >
                <Minus className="h-4 w-4" strokeWidth={2} />
              </button>
              <span className="flex h-9 min-w-10 items-center justify-center border-x border-gold-400/15 px-3 text-sm font-semibold text-white">
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin text-gold-400" /> : localQuantity}
              </span>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center text-white/60 transition hover:bg-white/5 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 disabled:cursor-not-allowed disabled:opacity-35"
                onClick={increaseQuantity}
                disabled={!canEditQuantity || localQuantity >= maxQuantity || isUpdating}
                aria-label={`Increase quantity for ${title}`}
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="text-right">
              <div className="font-playfair text-lg font-semibold text-gold-400">
                {formatCurrency(item.isAvailable ? displayedLineTotal : 0)}
              </div>
              {item.maxQuantity > 0 && (
                <div className="text-xs text-white/35">{item.maxQuantity} available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
