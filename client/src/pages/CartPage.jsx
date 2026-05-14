import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItemRow from "../components/cart/CartItemRow";
import CartSkeleton from "../components/cart/CartSkeleton";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";
import RemoveCartItemModal from "../components/cart/RemoveCartItemModal";
import { useCartStore } from "../store/cartStore";
import { useToastStore } from "../store/toastStore";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    totals,
    loading,
    actionLoading,
    fetchCart,
    updateItemQuantity,
    removeItem,
    clear,
  } = useCartStore();
  const showSuccess = useToastStore((state) => state.success);
  const showError = useToastStore((state) => state.error);
  const [itemToRemove, setItemToRemove] = useState(null);

  useEffect(() => {
    fetchCart().catch((error) => {
      showError(error.message || "Unable to load cart");
    });
  }, [fetchCart, showError]);

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

  const handleClear = async () => {
    try {
      await clear();
      showSuccess("Cart cleared");
    } catch (error) {
      showError(error.message || "Unable to clear cart");
    }
  };

  return (
    <main className="min-h-screen bg-brown-900 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-1 py-2 text-sm text-white/55 transition hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
          onClick={() => navigate("/explore")}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Continue shopping
        </button>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-gold-400/20 bg-gold-400/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gold-400">
              <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2} />
              Cart
            </div>
            <h1 className="font-playfair text-3xl font-semibold text-white sm:text-4xl">Shopping cart</h1>
            <p className="mt-2 text-sm text-white/50">
              {totals.itemCount ? `${totals.itemCount} item${totals.itemCount === 1 ? "" : "s"} saved` : "Ready when you find something you love"}
            </p>
          </div>

          {loading && items.length > 0 && (
            <div className="inline-flex items-center gap-2 text-sm text-gold-400">
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              Syncing cart
            </div>
          )}
        </div>

        {loading && !items.length ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <CartSkeleton rows={4} />
            <CartSummary totals={totals} onClear={handleClear} clearLoading={Boolean(actionLoading.clear)} />
          </div>
        ) : items.length ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  isUpdating={Boolean(actionLoading[`quantity:${item.id}`])}
                  isRemoving={Boolean(actionLoading[`remove:${item.id}`])}
                  onQuantityCommit={handleQuantityCommit}
                  onRemoveRequest={setItemToRemove}
                />
              ))}
            </section>
            <CartSummary totals={totals} onClear={handleClear} clearLoading={Boolean(actionLoading.clear)} />
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>

      <RemoveCartItemModal
        item={itemToRemove}
        loading={Boolean(itemToRemove && actionLoading[`remove:${itemToRemove.id}`])}
        onCancel={() => setItemToRemove(null)}
        onConfirm={confirmRemove}
      />
    </main>
  );
}
