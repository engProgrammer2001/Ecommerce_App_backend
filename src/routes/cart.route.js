import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart.controller.js";
const router = express.Router();

router.get("/get-cart-items", getCart);
router.post("/add-to-cart", addToCart);
router.put("/update-cart-item/:productId", updateCartItem);
router.delete("/remove-from-cart/:productId", removeFromCart);
router.delete("/clear-cart", clearCart);

export default router;
