import express from "express";
import {
  registerController,
  loginController,
  testController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// Router Object
const router = express.Router();

// Routing

// Register || METHOD POST
router.post("/register", registerController);

// Login || METHOD POST
router.post("/login", loginController);

// Test route
router.get("/test", requireSignIn, isAdmin, testController);

export default router;
