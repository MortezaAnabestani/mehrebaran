import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2015", // کد مدرن‌تر تولید می‌کند
    minify: "terser", // بهتر از esbuild برای حذف dead code
    cssMinify: true,
    sourcemap: false,
    brotliSize: true, // اندازه gzip/brotli را نشان می‌دهد
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: ["axios", "lodash"], // پکیج‌های عمومی جدا شود
        },
      },
    },
  },
});
