import express from "express";
import {
  createCategory,
  getAllCategories,
} from "../controllers/category.controller.js";

const router = express.Router();

router.post("/create-category", createCategory);
router.get("/get-all-categories", getAllCategories);

export default router;
