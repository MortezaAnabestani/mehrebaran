// src/core/utils/token.utils.ts
import jwt from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: "7d",
  });
};
