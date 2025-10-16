import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../core/config";
import { Document } from "mongoose";
import { UserModel } from "../users/user.model";
import { IUser, UserRole } from "common-types";

export type AuthenticatedUser = IUser & Document;

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      req.user = await UserModel.findById<AuthenticatedUser>(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "کاربر یافت نشد." });
      }
      return next();
    } catch (error) {
      console.error("TOKEN VERIFICATION FAILED:", error);
      return res.status(401).json({ message: "توکن نامعتبر است، دسترسی مجاز نیست." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "توکن وجود ندارد، دسترسی مجاز نیست." });
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "خطای داخلی: اطلاعات کاربر در این مرحله یافت نشد. لطفاً با پشتیبانی تماس بگیرید.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "شما اجازه دسترسی به این بخش را ندارید.",
      });
    }

    next();
  };
};

export const protectOptional = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

      const user = await UserModel.findById(decoded.id).select("-password");

      if (user) {
        req.user = user;
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: "توکن ارائه شده نامعتبر است." });
    }
  }

  next();
};
