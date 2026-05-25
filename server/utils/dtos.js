/**
 * Data Transfer Objects (DTOs) - Serialize domain models to API responses
 * Ensures consistent data format and prevents data leaks
 */

/**
 * Serialize user to safe public response (no sensitive fields)
 * @param {object} user - Prisma user model
 * @param {object} options - Serialization options
 * @returns {object} Safe user data
 */
export const serializeUser = (user, options = {}) => {
  const {
    includeEmail = true,
    includeListing = false,
  } = options;

  const serialized = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImage: user.profileImage,
  };

  if (includeEmail) {
    serialized.email = user.email;
  }

  if (includeListing && user.listings) {
    serialized.listings = user.listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      createdAt: listing.createdAt,
    }));
  }

  return serialized;
};

/**
 * Create consistent auth response (register/login)
 * @param {object} user - Prisma user model
 * @param {string} token - JWT token
 * @param {string} message - Response message
 * @returns {object} Auth response
 */
export const createAuthResponse = (user, token, message = "Success") => ({
  message,
  token,
  user: serializeUser(user, { includeEmail: true, includeListing: false }),
});

/**
 * Create user profile response
 * @param {object} user - Prisma user model with listings
 * @returns {object} Profile response
 */
export const createUserProfileResponse = (user) => ({
  ...serializeUser(user, { includeEmail: true, includeListing: true }),
});

/**
 * Serialize listing for API response
 * @param {object} listing - Prisma listing model
 * @returns {object} Serialized listing
 */
export const serializeListing = (listing) => ({
  id: listing.id,
  title: listing.title,
  description: listing.description,
  brand: listing.brand,
  price: listing.price,
  condition: listing.condition,
  negotiable: listing.negotiable,
  stock: listing.stock,
  tags: listing.tags,
  isSold: listing.isSold,
  isActive: listing.isActive,
  createdAt: listing.createdAt,
  category: listing.category ? { id: listing.category.id, name: listing.category.name } : null,
  images: listing.images ? listing.images.map(img => ({ id: img.id, url: img.url })) : [],
  seller: listing.seller ? serializeUser(listing.seller, { includeEmail: false }) : null,
});

/**
 * Serialize cart item for API response
 * @param {object} item - Prisma cartItem model
 * @returns {object} Serialized cart item
 */
export const serializeCartItem = (item) => ({
  id: item.id,
  cartId: item.cartId,
  listingId: item.listingId,
  quantity: item.quantity,
  priceSnapshot: item.priceSnapshot,
  createdAt: item.createdAt,
  listing: item.listing ? serializeListing(item.listing) : null,
});

/**
 * Serialize entire cart for API response
 * @param {object} cart - Prisma cart model with items
 * @returns {object} Serialized cart
 */
export const serializeCart = (cart) => ({
  id: cart.id,
  userId: cart.userId,
  items: cart.items ? cart.items.map(serializeCartItem) : [],
  createdAt: cart.createdAt,
  updatedAt: cart.updatedAt,
});
