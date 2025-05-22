import express from "express";
import { authenticateUser } from "../../common/middleware/auth.middleware";
import UserController from "./user.controller";

const userRoutes = express.Router();

const publicKey = Buffer.from(
  process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY!,
  "base64"
).toString("ascii");

userRoutes.use(authenticateUser(publicKey));

userRoutes.get("/me", UserController.getMe);

userRoutes.get("/", UserController.getAllUsers);

userRoutes.get("/:id", UserController.getUserById);

userRoutes.patch("/:id", UserController.updateUserById);

userRoutes.delete("/:id", UserController.deleteUserById);

export default userRoutes;
