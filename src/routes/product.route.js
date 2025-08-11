import express from "express";
import {
  addProduct,
  getAllProduct,
  getProductById,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/add-product", addProduct);
router.get("/get-product-by-id/:id", getProductById);
router.get("/get-all-product", getAllProduct);

export default router;
