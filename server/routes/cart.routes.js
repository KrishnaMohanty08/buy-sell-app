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

router.use(protect);

router.post("/add", addToCart);
router.get("/", getCart);
router.patch("/item/:id", updateCartItemQuantity);
router.delete("/item/:id", removeFromCart);
router.delete("/clear", clearCart);

// Backward-compatible aliases for older client calls.
router.patch("/:id", updateCartItemQuantity);
router.delete("/:id", removeFromCart);
router.delete("/", clearCart);

export default router;
