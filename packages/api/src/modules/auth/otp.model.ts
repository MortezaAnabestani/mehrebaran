import { Schema, model } from "mongoose";

interface IOtp {
  mobile: string;
  code: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
  mobile: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// TTL index for automatic expiration after 5 minutes
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 300 });

export const OtpModel = model<IOtp>("Otp", otpSchema);
