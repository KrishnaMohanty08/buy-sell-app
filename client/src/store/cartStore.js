import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../api/cart";
import { EMPTY_CART_TOTALS, calculateCartTotals, normalizeCartPayload } from "../utils/cart";

const emptyState = {
  cart: null,
  items: [],
  totals: EMPTY_CART_TOTALS,
};

const actionKey = (action, id) => `${action}:${id}`;

const applyCartPayload = (payload) => {
  const normalized = normalizeCartPayload(payload);
  return {
    cart: normalized.cart,
    items: normalized.items,
    totals: normalized.totals,
    lastSyncedAt: new Date().toISOString(),
  };
};

const buildOptimisticItem = (listing, quantity) => {
  const unitPrice = Number(listing?.price || 0);

  return {
    id: `optimistic-${listing?.id || Date.now()}`,
    cartId: null,
    listingId: listing?.id,
    quantity,
    priceSnapshot: unitPrice,
    unitPrice,
    lineTotal: unitPrice * quantity,
    snapshotTotal: unitPrice * quantity,
    priceChanged: false,
    isAvailable: true,
    status: null,
    maxQuantity: listing?.stock || 99,
    listing,
    optimistic: true,
  };
};

const withOptimisticAdd = (items, listingId, quantity, listing) => {
  const existingItem = items.find((item) => item.listingId === listingId);

  if (existingItem) {
    return items.map((item) =>
      item.listingId === listingId
        ? {
            ...item,
            quantity: item.quantity + quantity,
            lineTotal: Number(item.unitPrice || item.listing?.price || 0) * (item.quantity + quantity),
          }
        : item
    );
  }

  return listing ? [...items, buildOptimisticItem(listing, quantity)] : items;
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      ...emptyState,
      drawerOpen: false,
      loading: false,
      error: null,
      actionLoading: {},
      lastSyncedAt: null,

      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),

      setActionLoading: (key, value) =>
        set((state) => ({
          actionLoading: {
            ...state.actionLoading,
            [key]: value,
          },
        })),

      setCart: (payload) => set(applyCartPayload(payload)),

      resetCart: () =>
        set({
          ...emptyState,
          drawerOpen: false,
          loading: false,
          error: null,
          actionLoading: {},
          lastSyncedAt: null,
        }),

      fetchCart: async () => {
        if (!localStorage.getItem("authToken")) {
          get().resetCart();
          return emptyState;
        }

        set({ loading: true, error: null });

        try {
          const payload = await getCart();
          const nextState = applyCartPayload(payload);
          set({ ...nextState, loading: false });
          return payload;
        } catch (error) {
          if (error.status === 401) {
            get().resetCart();
          }

          set({ loading: false, error: error.message });
          throw error;
        }
      },

      addItem: async (listingId, quantity = 1, listing = null) => {
        const key = actionKey("add", listingId);
        const previous = {
          items: get().items,
          totals: get().totals,
          cart: get().cart,
        };
        const optimisticItems = withOptimisticAdd(previous.items, listingId, quantity, listing);

        if (optimisticItems !== previous.items) {
          set({
            items: optimisticItems,
            totals: calculateCartTotals(optimisticItems),
          });
        }

        get().setActionLoading(key, true);
        set({ error: null });

        try {
          const payload = await addToCart(listingId, quantity);
          set(applyCartPayload(payload));
          return payload;
        } catch (error) {
          set({ ...previous, error: error.message });
          throw error;
        } finally {
          get().setActionLoading(key, false);
        }
      },

      updateItemQuantity: async (cartItemId, quantity) => {
        const key = actionKey("quantity", cartItemId);
        const previous = {
          items: get().items,
          totals: get().totals,
          cart: get().cart,
        };
        const optimisticItems = previous.items.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity,
                lineTotal:
                  item.isAvailable === false
                    ? 0
                    : Number(item.unitPrice || item.listing?.price || 0) * quantity,
                snapshotTotal: Number(item.priceSnapshot || item.unitPrice || 0) * quantity,
              }
            : item
        );

        set({
          items: optimisticItems,
          totals: calculateCartTotals(optimisticItems),
          error: null,
        });
        get().setActionLoading(key, true);

        try {
          const payload = await updateCartItemQuantity(cartItemId, quantity);
          set(applyCartPayload(payload));
          return payload;
        } catch (error) {
          set({ ...previous, error: error.message });
          throw error;
        } finally {
          get().setActionLoading(key, false);
        }
      },

      removeItem: async (cartItemId) => {
        const key = actionKey("remove", cartItemId);
        const previous = {
          items: get().items,
          totals: get().totals,
          cart: get().cart,
        };
        const optimisticItems = previous.items.filter((item) => item.id !== cartItemId);

        set({
          items: optimisticItems,
          totals: calculateCartTotals(optimisticItems),
          error: null,
        });
        get().setActionLoading(key, true);

        try {
          const payload = await removeFromCart(cartItemId);
          set(applyCartPayload(payload));
          return payload;
        } catch (error) {
          set({ ...previous, error: error.message });
          throw error;
        } finally {
          get().setActionLoading(key, false);
        }
      },

      clear: async () => {
        const previous = {
          items: get().items,
          totals: get().totals,
          cart: get().cart,
        };

        set({ ...emptyState, error: null });
        get().setActionLoading("clear", true);

        try {
          const payload = await clearCart();
          set(applyCartPayload(payload));
          return payload;
        } catch (error) {
          set({ ...previous, error: error.message });
          throw error;
        } finally {
          get().setActionLoading("clear", false);
        }
      },
    }),
    {
      name: "bazaar-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        items: state.items,
        totals: state.totals,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);
