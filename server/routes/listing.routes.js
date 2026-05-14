import express from "express"
import protect from "../middleware/authMiddleware.js";
import { createListing, getListings, getListingById } from "../controllers/listingController.js";

const router = express.Router();

router.post("/", protect, createListing);
router.get("/", getListings);
router.get("/:id", getListingById);

export default router;