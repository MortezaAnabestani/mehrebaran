import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Custom loader to prevent empty strings from reaching picomatch
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.w3schools.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.soundhelix.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.w3.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
