import express from "express"
import protect from "../middleware/authMiddleware.js";
import { createListing } from "../controllers/listingController.js";

const router=express.Router();

router.post("/", protect, createListing);

export default router;