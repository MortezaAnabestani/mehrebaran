import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import ApiError from "../utils/apiError";

/**
 * Middleware برای validation داده‌های request با Zod schemas
 */
export const validate = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err: any) => {
          const path = err.path.join(".");
          return `${path}: ${err.message}`;
        });

        return next(new ApiError(400, errorMessages.join(", ")));
      }
      next(error);
    }
  };
};
