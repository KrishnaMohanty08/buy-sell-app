import prisma from "../prisma/client.js";

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

export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      brand,
      askingPrice,
      category,
      condition,
      tags,
      negotiable,
      images,
    } = req.body;

    const sellerId = req.user?.id;

    if (!sellerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !description || askingPrice === undefined || !category || !condition) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const mappedCondition = CONDITION_MAP[condition];
    if (!mappedCondition) {
      return res.status(400).json({ message: "Invalid condition value" });
    }

    const price = Number(askingPrice);
    if (Number.isNaN(price)) {
      return res.status(400).json({ message: "Invalid price value" });
    }

    const listing = await prisma.listing.create({
      data: {
        title: String(title).trim(),
        description: String(description).trim(),
        brand: typeof brand === "string" && brand.trim() ? brand.trim() : null,
        price,
        condition: mappedCondition,
        negotiable: Boolean(negotiable),
        tags: Array.isArray(tags)
          ? tags.map((tag) => (typeof tag === "string" ? tag.trim() : "")).filter(Boolean)
          : null,
        seller: {
          connect: { id: sellerId },
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
                .map((url) => ({ url }))
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return res.status(201).json({
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Create listing failed:", error);
    return res.status(500).json({ message: error.message || "Failed to create listing" });
  }
};

export const getListings = async (req, res) => {
  try {
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
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where = { isSold: false };

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

    // Sorting
    const orderBy = {};
    if (sortBy === "price") {
      orderBy.price = sortOrder;
    } else if (sortBy === "newest") {
      orderBy.createdAt = sortOrder;
    } else {
      orderBy.createdAt = "desc";
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          category: true,
          images: true,
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: { reviews: true },
          },
        },
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.listing.count({ where }),
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    return res.json({
      listings,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get listings failed:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch listings" });
  }
};

export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Listing ID is required" });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Calculate average rating
    const avgRating =
      listing.reviews.length > 0
        ? (listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length).toFixed(1)
        : 0;

    return res.json({
      ...listing,
      avgRating,
    });
  } catch (error) {
    console.error("Get listing by ID failed:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch listing" });
  }
};
