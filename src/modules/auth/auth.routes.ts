import { Router } from "express";
import {
  validateLogin,
  validateRegistration,
  validateVerifyEmail,
} from "../user/user.validation";
import { validateRequest } from "../../common/middleware/validate.middleware";
import { authenticateUser } from "../../common/middleware/auth.middleware";
import AuthController from "./auth.controller";

const authRoutes = Router();

const publicKey = Buffer.from(
  process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY!,
  "base64"
).toString("ascii");

authRoutes.post(
  "/register",
  validateRegistration,
  validateRequest,
  AuthController.register
);

authRoutes.post("/login", validateLogin, validateRequest, AuthController.login);

authRoutes.post("/logout", authenticateUser(publicKey), AuthController.logout);

authRoutes.post(
  "/verify-email",
  validateVerifyEmail,
  validateRequest,
  AuthController.verifyEmail
);

authRoutes.post("/forgot-password", AuthController.forgotPassword);

authRoutes.post("/reset-password", AuthController.resetPassword);

authRoutes.post(
  "/resend-verification-email",
  AuthController.resendVerificationEmail
);

export default authRoutes;
