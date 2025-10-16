import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/request-otp", authController.requestOtp);
router.post("/verify-and-register", authController.verifyAndRegister);

export default router;
