import express from "express";
import {
  getProfile,
  updateProfile,
  userLogin,
  userRegister,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlerware/isAuthenticated.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.put("/update-profile", isAuthenticated, updateProfile);
router.get("/get-profile", isAuthenticated, getProfile);

export default router;
