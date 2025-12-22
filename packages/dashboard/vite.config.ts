import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1", // یا '0.0.0.0' برای دسترسی از شبکه
    port: 5173,
    strictPort: false, // اگر پورت اشغال بود، پورت دیگری انتخاب کند
    open: false, // مرورگر را به صورت خودکار باز نکند
  },
});
