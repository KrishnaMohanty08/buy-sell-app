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