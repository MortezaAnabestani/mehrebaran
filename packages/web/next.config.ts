import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Use remotePatterns instead of custom loader for Next.js 16 compatibility
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.w3schools.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.soundhelix.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.w3.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
    // Disable optimization for development to bypass private IP restriction
    unoptimized: true,
  },
};

export default nextConfig;
