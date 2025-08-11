import express from "express";
import {
  createOrder,
  createTransaction,
  getOrderByUserId,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-transaction", createTransaction);
router.post("/create-order", createOrder);
router.post("/get-order-by-user-id", getOrderByUserId);

export default router;
