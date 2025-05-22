import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { ApiError } from "../utils/api-error";

export const authenticateUser = (publicKey: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      if (!token) {
        return next(new ApiError(401, "You are not logged in"));
      }

      const decoded = verifyJwt<{ sub: string }>(token, publicKey);

      if (!decoded?.sub) {
        return next(new ApiError(401, "Invalid or expired token"));
      }

      res.locals.user = { id: decoded.sub };
      next();
    } catch (err) {
      next(err);
    }
  };
};
