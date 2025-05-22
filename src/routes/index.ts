import { Router } from "express";
import { authRoutes } from "../modules/auth";
import { userRoutes } from "../modules/user";
import { insuranceQuoteRoutes } from "../modules/insurance-quote";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/insurance-quotes", insuranceQuoteRoutes);

export default router;
