import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "AcvfR546_$sdfba",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  zarinpal: {
    merchantId: process.env.ZARINPAL_MERCHANT_ID || "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    sandboxMode: process.env.ZARINPAL_SANDBOX === "true" || false,
  },
};

export { config };
export default config;
