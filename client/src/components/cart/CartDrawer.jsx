import { ArrowRight, Loader2, ShoppingCart, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useToastStore } from "../../store/toastStore";
import { formatCurrency } from "../../utils/cart";
import CartItemRow from "./CartItemRow";
import CartSkeleton from "./CartSkeleton";
import EmptyCart from "./EmptyCart";
import RemoveCartItemModal from "./RemoveCartItemModal";

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    drawerOpen,
    closeDrawer,
    fetchCart,
    items,
    totals,
    loading,
    actionLoading,
    updateItemQuantity,
    removeItem,
  } = useCartStore();
  const showSuccess = useToastStore((state) => state.success);
  const showError = useToastStore((state) => state.error);
  const [itemToRemove, setItemToRemove] = useState(null);

  useEffect(() => {
    if (!drawerOpen) return;

    fetchCart().catch((error) => {
      showError(error.message || "Unable to load cart");
    });
  }, [drawerOpen, fetchCart, showError]);

  useEffect(() => {
    if (!drawerOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeDrawer, drawerOpen]);

  const handleQuantityCommit = useCallback(
    async (cartItemId, quantity) => {
      try {
        await updateItemQuantity(cartItemId, quantity);
      } catch (error) {
        showError(error.message || "Unable to update quantity");
      }
    },
    [showError, updateItemQuantity]
  );

  const confirmRemove = async () => {
    if (!itemToRemove) return;

    try {
      await removeItem(itemToRemove.id);
      showSuccess("Item removed from cart");
      setItemToRemove(null);
    } catch (error) {
      showError(error.message || "Unable to remove item");
    }
  };

  const goToCart = () => {
    closeDrawer();
    navigate("/cart");
  };

  if (!drawerOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" onClick={closeDrawer} />
      <aside className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col border-l border-gold-400/20 bg-brown-900 shadow-2xl sm:w-[420px]">
        <header className="flex h-16 items-center justify-between border-b border-gold-400/15 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400/10 text-gold-400">
              <ShoppingCart className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-dm-sans text-base font-semibold text-white">Cart</h2>
              <p className="text-xs text-white/45">{totals.itemCount} item{totals.itemCount === 1 ? "" : "s"}</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-white/55 transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-400"
            onClick={closeDrawer}
            aria-label="Close cart"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading && !items.length ? (
            <CartSkeleton rows={3} />
          ) : items.length ? (
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  compact
                  isUpdating={Boolean(actionLoading[`quantity:${item.id}`])}
                  isRemoving={Boolean(actionLoading[`remove:${item.id}`])}
                  onQuantityCommit={handleQuantityCommit}
                  onRemoveRequest={setItemToRemove}
                />
              ))}
            </div>
          ) : (
            <EmptyCart compact onAction={closeDrawer} />
          )}
        </div>

        <footer className="border-t border-gold-400/15 bg-brown-900/95 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-white/60">Subtotal</span>
            <span className="font-playfair text-2xl font-semibold text-gold-400">
              {formatCurrency(totals.total)}
            </span>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-orange-500 px-4 text-sm font-semibold text-brown-900 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gold-400 disabled:cursor-not-allowed disabled:opacity-45"
            onClick={goToCart}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "View cart"}
            {!loading && <ArrowRight className="h-4 w-4" strokeWidth={2} />}
          </button>
        </footer>
      </aside>

      <RemoveCartItemModal
        item={itemToRemove}
        loading={Boolean(itemToRemove && actionLoading[`remove:${itemToRemove.id}`])}
        onCancel={() => setItemToRemove(null)}
        onConfirm={confirmRemove}
      />
    </>
  );
}
