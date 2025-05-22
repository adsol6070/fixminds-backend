import express from "express";
import { authenticateUser } from "../../common/middleware/auth.middleware";
import InsuranceQuoteController from "./insurance-quote.controller";

const insuranceQuoteRoutes = express.Router();

const publicKey = Buffer.from(
  process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY!,
  "base64"
).toString("ascii");

insuranceQuoteRoutes.post("/", InsuranceQuoteController.createQuote);

insuranceQuoteRoutes.get(
  "/",
  authenticateUser(publicKey),
  InsuranceQuoteController.getAllQuotes
);

insuranceQuoteRoutes.get(
  "/:id",
  authenticateUser(publicKey),
  InsuranceQuoteController.getQuoteById
);

insuranceQuoteRoutes.patch(
  "/:id",
  authenticateUser(publicKey),
  InsuranceQuoteController.updateQuoteById
);

insuranceQuoteRoutes.delete(
  "/:id",
  authenticateUser(publicKey),
  InsuranceQuoteController.deleteQuoteById
);

export default insuranceQuoteRoutes;