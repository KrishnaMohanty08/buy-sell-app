import prisma from "../prisma/client.js";
import AppError from "../utils/AppError.js";

const MAX_CART_QUANTITY = 99;

const listingInclude = {
  images: true,
  category: true,
  seller: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
};

const cartInclude = {
  items: {
    orderBy: { createdAt: "asc" },
    include: {
      listing: {
        include: listingInclude,
      },
    },
  },
};

const toMoney = (value) => Number(Number(value || 0).toFixed(2));

const parseQuantity = (value) => {
  const quantity = Number(value);

  if (!Number.isInteger(quantity)) {
    throw new AppError("Quantity must be a whole number", 400);
  }

  if (quantity < 1) {
    throw new AppError("Quantity must be at least 1", 400);
  }

  if (quantity > MAX_CART_QUANTITY) {
    throw new AppError(`Quantity cannot exceed ${MAX_CART_QUANTITY}`, 400);
  }

  return quantity;
};

const getListingUnavailableReason = (listing) => {
  if (!listing) return "This listing is no longer available";
  if (listing.deletedAt) return "This listing was removed";
  if (!listing.isActive) return "This listing is inactive";
  if (listing.isSold) return "This listing has already been sold";
  if (listing.stock < 1) return "This listing is out of stock";

  return null;
};

const assertListingCanBePurchased = (listing, quantity) => {
  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  const unavailableReason = getListingUnavailableReason(listing);

  if (unavailableReason) {
    throw new AppError(unavailableReason, 409);
  }

  if (quantity > listing.stock) {
    throw new AppError(`Only ${listing.stock} item${listing.stock === 1 ? "" : "s"} available`, 409, {
      availableStock: listing.stock,
    });
  }
};

const findUserCartItem = async (client, userId, cartItemId) => {
  const cartItem = await client.cartItem.findUnique({
    where: { id: cartItemId },
    include: {
      cart: true,
      listing: true,
    },
  });

  if (!cartItem) {
    throw new AppError("Cart item not found", 404);
  }

  if (cartItem.cart.userId !== userId) {
    throw new AppError("You do not have access to this cart item", 403);
  }

  return cartItem;
};

const getOrCreateCart = (client, userId) => {
  return client.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
};

const fetchCartById = (client, cartId) => {
  return client.cart.findUnique({
    where: { id: cartId },
    include: cartInclude,
  });
};

const fetchCartByUserId = (client, userId) => {
  return client.cart.findUnique({
    where: { userId },
    include: cartInclude,
  });
};

const emptyCartPayload = (cart = null) => ({
  message: "Cart is empty",
  cart: cart
    ? {
        id: cart.id,
        userId: cart.userId,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      }
    : null,
  items: [],
  totals: {
    itemCount: 0,
    uniqueItemCount: 0,
    checkoutItemCount: 0,
    unavailableCount: 0,
    subtotal: 0,
    snapshotSubtotal: 0,
    total: 0,
    currency: "INR",
  },
  totalPrice: 0,
});

const formatCart = (cart, message = "Cart retrieved successfully") => {
  if (!cart || !cart.items?.length) {
    return {
      ...emptyCartPayload(cart),
      message,
    };
  }

  const items = cart.items.map((item) => {
    const listing = item.listing;
    const unavailableReason = getListingUnavailableReason(listing);
    const quantityIssue =
      !unavailableReason && item.quantity > listing.stock
        ? `Only ${listing.stock} item${listing.stock === 1 ? "" : "s"} available`
        : null;
    const status = unavailableReason || quantityIssue;
    const isAvailable = !status;
    const unitPrice = toMoney(listing?.price);
    const priceSnapshot = toMoney(item.priceSnapshot);
    const lineTotal = isAvailable ? toMoney(unitPrice * item.quantity) : 0;
    const snapshotTotal = toMoney(priceSnapshot * item.quantity);

    return {
      id: item.id,
      cartId: item.cartId,
      listingId: item.listingId,
      quantity: item.quantity,
      priceSnapshot,
      unitPrice,
      lineTotal,
      snapshotTotal,
      priceChanged: priceSnapshot !== unitPrice,
      isAvailable,
      status,
      maxQuantity: listing ? Math.min(listing.stock, MAX_CART_QUANTITY) : 0,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      listing: listing
        ? {
            id: listing.id,
            title: listing.title,
            description: listing.description,
            brand: listing.brand,
            price: listing.price,
            condition: listing.condition,
            negotiable: listing.negotiable,
            isSold: listing.isSold,
            isActive: listing.isActive,
            deletedAt: listing.deletedAt,
            stock: listing.stock,
            category: listing.category,
            images: listing.images,
            seller: listing.seller,
          }
        : null,
    };
  });

  const totals = items.reduce(
    (acc, item) => {
      acc.itemCount += item.quantity;
      acc.uniqueItemCount += 1;

      if (item.isAvailable) {
        acc.checkoutItemCount += item.quantity;
        acc.subtotal += item.lineTotal;
      } else {
        acc.unavailableCount += 1;
      }

      acc.snapshotSubtotal += item.snapshotTotal;
      return acc;
    },
    {
      itemCount: 0,
      uniqueItemCount: 0,
      checkoutItemCount: 0,
      unavailableCount: 0,
      subtotal: 0,
      snapshotSubtotal: 0,
      total: 0,
      currency: "INR",
    }
  );

  totals.subtotal = toMoney(totals.subtotal);
  totals.snapshotSubtotal = toMoney(totals.snapshotSubtotal);
  totals.total = totals.subtotal;

  return {
    message,
    cart: {
      id: cart.id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    },
    items,
    totals,
    totalPrice: totals.total,
  };
};

export const getCart = async (userId) => {
  const cart = await fetchCartByUserId(prisma, userId);
  return formatCart(cart);
};

export const addToCart = async (userId, { listingId, quantity = 1 }) => {
  if (!listingId) {
    throw new AppError("Listing ID is required", 400);
  }

  const quantityToAdd = parseQuantity(quantity);

  return prisma.$transaction(async (tx) => {
    const listing = await tx.listing.findUnique({
      where: { id: listingId },
    });

    assertListingCanBePurchased(listing, quantityToAdd);

    const cart = await getOrCreateCart(tx, userId);
    const existingItem = await tx.cartItem.findUnique({
      where: {
        cartId_listingId: {
          cartId: cart.id,
          listingId,
        },
      },
    });

    const nextQuantity = existingItem ? existingItem.quantity + quantityToAdd : quantityToAdd;
    assertListingCanBePurchased(listing, nextQuantity);

    if (existingItem) {
      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: nextQuantity },
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          listingId,
          quantity: quantityToAdd,
          priceSnapshot: listing.price,
        },
      });
    }

    const updatedCart = await fetchCartById(tx, cart.id);
    return {
      statusCode: existingItem ? 200 : 201,
      ...formatCart(
        updatedCart,
        existingItem ? "Cart item quantity increased" : "Item added to cart successfully"
      ),
    };
  });
};

export const updateCartItem = async (userId, cartItemId, quantity) => {
  if (!cartItemId) {
    throw new AppError("Cart item ID is required", 400);
  }

  const nextQuantity = parseQuantity(quantity);

  return prisma.$transaction(async (tx) => {
    const cartItem = await findUserCartItem(tx, userId, cartItemId);
    assertListingCanBePurchased(cartItem.listing, nextQuantity);

    await tx.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: nextQuantity },
    });

    const updatedCart = await fetchCartById(tx, cartItem.cartId);
    return formatCart(updatedCart, "Cart item updated successfully");
  });
};

export const removeCartItem = async (userId, cartItemId) => {
  if (!cartItemId) {
    throw new AppError("Cart item ID is required", 400);
  }

  return prisma.$transaction(async (tx) => {
    const cartItem = await findUserCartItem(tx, userId, cartItemId);

    await tx.cartItem.delete({
      where: { id: cartItemId },
    });

    const updatedCart = await fetchCartById(tx, cartItem.cartId);
    return formatCart(updatedCart, "Item removed from cart successfully");
  });
};

export const clearCart = async (userId) => {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return emptyCartPayload();
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    const updatedCart = await fetchCartById(tx, cart.id);
    return formatCart(updatedCart, "Cart cleared successfully");
  });
};
