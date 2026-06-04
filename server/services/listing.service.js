/**
 * Listing Service
 * Handles listing creation, retrieval, and filtering
 * Separates business logic from HTTP controllers
 */

import prisma from "../prisma/client.js";
import AppError from "../utils/AppError.js";

const CONDITION_MAP = {
  New: "NEW",
  "Like New": "LIKE_NEW",
  Good: "USED",
  Fair: "USED",
  "Just Working": "USED",
  NEW: "NEW",
  LIKE_NEW: "LIKE_NEW",
  USED: "USED",
};

const listingInclude = {
  category: true,
  images: true,
  seller: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
    },
  },
};

/**
 * Create new listing
 * @param {string} userId - Seller ID
 * @param {object} listingData - Listing details
 * @returns {object} Created listing
 * @throws {AppError} If validation fails
 */
export const createListingService = async (userId, listingData) => {
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const {
    title,
    description,
    brand,
    askingPrice,
    category,
    condition,
    tags,
    negotiable,
    stockQuantity,
    images,
  } = listingData;

  // Normalize data
  const mappedCondition = CONDITION_MAP[condition];
  if (!mappedCondition) {
    throw new AppError("Invalid condition value", 400);
  }

  const price = Number(askingPrice);
  if (Number.isNaN(price)) {
    throw new AppError("Invalid price value", 400);
  }

  const stock = stockQuantity === undefined ? 1 : Number(stockQuantity);
  if (!Number.isInteger(stock) || stock < 1) {
    throw new AppError("Stock quantity must be at least 1", 400);
  }

  // Create listing
  const listing = await prisma.listing.create({
    data: {
      title: String(title).trim(),
      description: String(description).trim(),
      brand: typeof brand === "string" && brand.trim() ? brand.trim() : null,
      price,
      stock,
      condition: mappedCondition,
      negotiable: Boolean(negotiable),
      tags: Array.isArray(tags)
        ? tags.map((tag) => (typeof tag === "string" ? tag.trim() : "")).filter(Boolean)
        : null,
      seller: {
        connect: { id: userId },
      },
      category: {
        connectOrCreate: {
          where: { name: String(category).trim() },
          create: { name: String(category).trim() },
        },
      },
      images: Array.isArray(images)
        ? {
            create: images
              .map((image) => {
                if (typeof image === "string") {
                  return image.trim();
                }
                if (image && typeof image === "object" && typeof image.url === "string") {
                  return image.url.trim();
                }
                return "";
              })
              .filter(Boolean)
              .map((url) => ({ url })),
          }
        : undefined,
    },
    include: listingInclude,
  });

  return listing;
};

/**
 * Get listings with filtering and pagination
 * @param {object} filters - Filter options (category, condition, price range, search, etc.)
 * @returns {object} { listings, pagination }
 */
export const getListingsService = async (filters = {}) => {
  const {
    category,
    condition,
    minPrice,
    maxPrice,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 12,
  } = filters;

  // Map user-friendly sort options to database fields
  const sortByMap = {
    newest: "createdAt",
    oldest: "createdAt",
    price: "price",
    title: "title",
    createdAt: "createdAt",
  };

  // Validate and normalize sortBy
  const validSortBy = sortByMap[sortBy.toLowerCase()] || "createdAt";
  
  // Validate sortOrder
  const validSortOrder = ["asc", "desc"].includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : "desc";

  const skip = (Number(page) - 1) * Number(limit);
  const where = {
    isSold: false,
    isActive: true,
    deletedAt: null,
    stock: { gt: 0 },
  };

  // Category filter
  if (category && category !== "All") {
    where.category = {
      name: category,
    };
  }

  // Condition filter
  if (condition) {
    const conditions = Array.isArray(condition) ? condition : [condition];
    where.condition = {
      in: conditions,
    };
  }

  // Price range filter
  if (minPrice) {
    where.price = { ...where.price, gte: Number(minPrice) };
  }
  if (maxPrice) {
    where.price = { ...where.price, lte: Number(maxPrice) };
  }

  // Search filter (title, description, brand)
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
    ];
  }

  // Get total count for pagination
  const total = await prisma.listing.count({ where });

  // Get listings
  const listings = await prisma.listing.findMany({
    where,
    include: listingInclude,
    orderBy: { [validSortBy]: validSortOrder },
    skip,
    take: Number(limit),
  });

  return {
    listings,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get single listing by ID
 * @param {string} listingId - Listing ID
 * @returns {object} Listing details
 * @throws {AppError} If listing not found
 */
export const getListingByIdService = async (listingId) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      ...listingInclude,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  return listing;
};

/**
 * Delete listing
 * @param {string} listingId - Listing ID
 * @param {string} userId - User ID (for ownership verification)
 * @returns {object} Deleted listing
 * @throws {AppError} If listing not found or user not authorized
 */
export const deleteListingService = async (listingId, userId) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  if (listing.sellerId !== userId) {
    throw new AppError("You do not have permission to delete this listing", 403);
  }

  // Soft delete
  const deletedListing = await prisma.listing.update({
    where: { id: listingId },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });

  return deletedListing;
};

/**
 * Update listing
 * @param {string} listingId - Listing ID
 * @param {string} userId - User ID (for ownership verification)
 * @param {object} updateData - Data to update
 * @returns {object} Updated listing
 * @throws {AppError} If listing not found or user not authorized
 */
export const updateListingService = async (listingId, userId, updateData) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  if (listing.sellerId !== userId) {
    throw new AppError("You do not have permission to update this listing", 403);
  }

  const { title, description, price, stock, condition, ...otherData } = updateData;

  const updatePayload = { ...otherData };

  if (title !== undefined) {
    updatePayload.title = String(title).trim();
  }
  if (description !== undefined) {
    updatePayload.description = String(description).trim();
  }
  if (price !== undefined) {
    updatePayload.price = Number(price);
  }
  if (stock !== undefined) {
    updatePayload.stock = Number(stock);
  }
  if (condition !== undefined) {
    updatePayload.condition = CONDITION_MAP[condition] || condition;
  }

  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: updatePayload,
    include: listingInclude,
  });

  return updatedListing;
};
