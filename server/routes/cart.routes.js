import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// All cart routes require authentication
router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:cartItemId", protect, removeFromCart);
router.patch("/:cartItemId", protect, updateCartItemQuantity);
router.delete("/", protect, clearCart);

export default router;
