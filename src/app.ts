import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import errorHandler from "./common/middleware/error.middleware";
import { ApiError } from "./common/utils/api-error";

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:4173", "http://localhost:3000", "http://127.0.0.1:5500"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// Middlewares
// app.use(
//   cors({
//     origin: process.env.ORIGIN,
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Routes
app.use("/api", routes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Error Handling
app.use(errorHandler);

export default app;
