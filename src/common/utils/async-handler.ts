import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import { ApiError } from "./api-error";

const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      // Mongoose Validation Error
      if (err instanceof MongooseError.ValidationError) {
        const messages = Object.values(err.errors)
          .map((val: any) => val.message)
          .join(", ");

        const validationError = new ApiError(
          400,
          `Invalid input: ${messages}`,
          false,
          err.stack || ""
        );
        return next(validationError);
      }

      // Duplicate Key Error (e.g., unique email or username)
      if (err.code === 11000) {
        const fields = Object.keys(err.keyValue).join(", ");
        const message = `Duplicate value entered for field(s): ${fields}`;
        const duplicateError = new ApiError(
          400,
          message,
          false,
          err.stack || ""
        );
        return next(duplicateError);
      }

      // Cast Error (e.g., invalid ObjectId format)
      if (err instanceof MongooseError.CastError) {
        const castError = new ApiError(
          400,
          `Invalid ${err.path}: ${err.value}`,
          false,
          err.stack || ""
        );
        return next(castError);
      }

      // Custom application error
      if (err instanceof ApiError) {
        return next(err);
      }

      // Unknown error fallback
      const unknownError = new ApiError(
        500,
        "An unexpected server error occurred. Please try again later.",
        false,
        err.stack || ""
      );
      return next(unknownError);
    });
  };
};

export { asyncHandler };
