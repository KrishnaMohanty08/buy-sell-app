import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// All cart routes require authentication
router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/:cartItemId", authMiddleware, removeFromCart);
router.patch("/:cartItemId", authMiddleware, updateCartItemQuantity);
router.delete("/", authMiddleware, clearCart);

export default router;
