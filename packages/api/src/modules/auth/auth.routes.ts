import { Router } from "express";
import { authController } from "./auth.controller";
import { protect } from "./auth.middleware";

const router = Router();

// OTP-based auth routes
router.post("/request-otp", authController.requestOtp);
router.post("/verify-and-register", authController.verifyAndRegister);

// Password-based auth routes
router.post("/login", authController.login);
router.post("/signup", authController.signup);

// Protected routes
router.get("/me", protect, authController.getCurrentUser);

export default router;
