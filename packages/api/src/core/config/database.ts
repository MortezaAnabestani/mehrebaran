import mongoose from "mongoose";
import { config } from "./";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
