import asyncHandler from "../utils/asyncHandler.js";
import {
  validateCreateListing,
} from "../validation/schemas.js";
import * as listingService from "../services/listing.service.js";

/**
 * Create new listing
 * POST /api/listings
 * Requires: Authorization header with Bearer token
 */
export const createListing = asyncHandler(async (req, res) => {
  validateCreateListing(req.body);

  const listing = await listingService.createListingService(req.user.id, req.body);

  res.status(201).json({
    message: "Listing created successfully",
    listing,
  });
});

/**
 * Get listings with filtering and pagination
 * GET /api/listings
 * Query params: category, condition, minPrice, maxPrice, search, sortBy, sortOrder, page, limit
 */
export const getListings = asyncHandler(async (req, res) => {
  const result = await listingService.getListingsService(req.query);
  res.status(200).json(result);
});

/**
 * Get single listing by ID
 * GET /api/listings/:id
 */
export const getListingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Listing ID is required" });
  }

  const listing = await listingService.getListingByIdService(id);

  // Calculate average rating
  const avgRating =
    listing.reviews && listing.reviews.length > 0
      ? (listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length).toFixed(1)
      : 0;

  res.status(200).json({
    ...listing,
    avgRating,
  });
});

/**
 * Delete listing
 * DELETE /api/listings/:id
 * Requires: Authorization header with Bearer token
 */
export const deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Listing ID is required" });
  }

  const deletedListing = await listingService.deleteListingService(id, req.user.id);

  res.status(200).json({
    message: "Listing deleted successfully",
    listing: deletedListing,
  });
});

/**
 * Update listing
 * PATCH /api/listings/:id
 * Requires: Authorization header with Bearer token
 */
export const updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Listing ID is required" });
  }

  const updatedListing = await listingService.updateListingService(id, req.user.id, req.body);

  res.status(200).json({
    message: "Listing updated successfully",
    listing: updatedListing,
  });
});
