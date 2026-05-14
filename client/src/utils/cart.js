export const EMPTY_CART_TOTALS = {
  itemCount: 0,
  uniqueItemCount: 0,
  checkoutItemCount: 0,
  unavailableCount: 0,
  subtotal: 0,
  snapshotSubtotal: 0,
  total: 0,
  currency: "INR",
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const toMoney = (value) => Number(Number(value || 0).toFixed(2));

export const normalizeCartPayload = (payload = {}) => ({
  cart: payload.cart || null,
  items: Array.isArray(payload.items) ? payload.items : [],
  totals: {
    ...EMPTY_CART_TOTALS,
    ...(payload.totals || {}),
  },
});

export const calculateCartTotals = (items = []) => {
  const totals = items.reduce(
    (acc, item) => {
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(item.unitPrice ?? item.listing?.price ?? 0);
      const priceSnapshot = Number(item.priceSnapshot ?? unitPrice);
      const lineTotal = item.isAvailable === false ? 0 : unitPrice * quantity;

      acc.itemCount += quantity;
      acc.uniqueItemCount += 1;
      acc.snapshotSubtotal += priceSnapshot * quantity;

      if (item.isAvailable !== false) {
        acc.checkoutItemCount += quantity;
        acc.subtotal += lineTotal;
      } else {
        acc.unavailableCount += 1;
      }

      return acc;
    },
    { ...EMPTY_CART_TOTALS }
  );

  totals.subtotal = toMoney(totals.subtotal);
  totals.snapshotSubtotal = toMoney(totals.snapshotSubtotal);
  totals.total = totals.subtotal;

  return totals;
};

export const getCartItemImage = (item) => item?.listing?.images?.[0]?.url || null;

export const getCartItemTitle = (item) => item?.listing?.title || "Unavailable listing";

export const getCartItemSeller = (item) => {
  const seller = item?.listing?.seller;
  if (!seller) return "Seller";
  return `${seller.firstName || ""} ${seller.lastName || ""}`.trim() || seller.email || "Seller";
};
