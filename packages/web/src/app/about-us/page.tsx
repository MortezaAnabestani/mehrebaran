import { Metadata } from "next";
import AboutSection from "@/components/features/about-us/AboutSection";
import AboutUs_ActivitiesSection from "@/components/features/about-us/AboutUs_ActivitiesSection";
import AboutUs_ContactSection from "@/components/features/about-us/AboutUs_ContactSection";
import AboutUs_HeroSection from "@/components/features/about-us/AboutUs_HeroSection";
import React from "react";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "درباره ما | کانون مهرباران",
  description: "آشنایی با کانون مسئولیت اجتماعی مهرباران، اهداف، حوزه‌های فعالیت و راه‌های ارتباطی با ما.",
  alternates: {
    canonical: "https://mehrbaran.com/about-us",
  },
  openGraph: {
    title: "درباره کانون مهرباران",
    description: "آشنایی با کانون مسئولیت اجتماعی مهرباران، اهداف، حوزه‌های فعالیت و راه‌های ارتباطی با ما.",
    url: "https://mehrbaran.com/about-us",
    siteName: "کانون مهرباران",
    type: "website",
    images: [{ url: "https://mehrbaran.com/images/default-og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "درباره ما | کانون مهرباران",
    description: "آشنایی با کانون مسئولیت اجتماعی مهرباران، اهداف، حوزه‌های فعالیت و راه‌های ارتباطی با ما.",
    images: ["https://mehrbaran.com/images/default-og.jpg"],
  },
};

const AboutUs: React.FC = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["AboutPage", "NGO"],
    "inLanguage": "fa-IR",
    "name": "درباره کانون مهرباران",
    "description": "آشنایی با کانون مسئولیت اجتماعی مهرباران، اهداف، حوزه‌های فعالیت و راه‌های ارتباطی با ما.",
    "url": "https://mehrbaran.com/about-us",
    "mainEntity": {
      "@type": "NGO",
      "name": "کانون مهرباران",
      "alternateName": "کانون مسئولیت اجتماعی مهرباران",
    }
  };

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutUs_HeroSection />
      <AboutSection />
      <AboutUs_ActivitiesSection />
      <AboutUs_ContactSection />
    </main>
  );
};

export default AboutUs;
