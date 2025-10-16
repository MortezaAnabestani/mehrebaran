import { Schema, model } from "mongoose";

interface IOtp {
  mobile: string;
  code: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
  mobile: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: "5m" },
});

export const OtpModel = model<IOtp>("Otp", otpSchema);
