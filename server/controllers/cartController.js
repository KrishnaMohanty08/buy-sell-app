import prisma from "../prisma/client.js";

/**
 * Add item to cart
 * POST /api/cart/add
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { listingId, quantity = 1 } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!listingId) {
      return res.status(400).json({ message: "Listing ID is required" });
    }

    // Check if listing exists and not sold
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.isSold) {
      return res.status(400).json({ message: "This listing has already been sold" });
    }

    // Check if user has a cart, if not create one
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user: {
            connect: { id: userId },
          },
        },
        include: { items: true },
      });
    }

    // Check if item already in cart
    const existingCartItem = cart.items.find(item => item.listingId === listingId);

    let cartItem;
    if (existingCartItem) {
      // Update quantity if item already exists
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
        include: {
          listing: {
            include: {
              images: true,
              category: true,
            },
          },
        },
      });
    } else {
      // Add new item to cart
      cartItem = await prisma.cartItem.create({
        data: {
          cart: {
            connect: { id: cart.id },
          },
          listing: {
            connect: { id: listingId },
          },
          quantity,
        },
        include: {
          listing: {
            include: {
              images: true,
              category: true,
            },
          },
        },
      });
    }

    res.status(200).json({
      message: "Item added to cart successfully",
      cartItem,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: error.message || "Failed to add item to cart" });
  }
};

/**
 * Get cart items for user
 * GET /api/cart
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            listing: {
              include: {
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
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        cart: null,
        items: [],
        totalPrice: 0,
      });
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.listing.price * item.quantity;
    }, 0);

    res.status(200).json({
      message: "Cart retrieved successfully",
      cart,
      items: cart.items,
      totalPrice,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch cart" });
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/:cartItemId
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { cartItemId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!cartItemId) {
      return res.status(400).json({ message: "Cart item ID is required" });
    }

    // Check if cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (cartItem.cart.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized access to this cart item" });
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    res.status(200).json({
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: error.message || "Failed to remove item from cart" });
  }
};

/**
 * Update cart item quantity
 * PATCH /api/cart/:cartItemId
 */
export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!cartItemId) {
      return res.status(400).json({ message: "Cart item ID is required" });
    }

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Check if cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (cartItem.cart.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized access to this cart item" });
    }

    // Update quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        listing: {
          include: {
            images: true,
            category: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Cart item updated successfully",
      cartItem: updatedCartItem,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: error.message || "Failed to update cart item" });
  }
};

/**
 * Clear entire cart
 * DELETE /api/cart
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Delete all cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.status(200).json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: error.message || "Failed to clear cart" });
  }
};
