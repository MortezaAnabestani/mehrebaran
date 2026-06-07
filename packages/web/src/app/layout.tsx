import type { Metadata, Viewport } from "next";
import "@/env";
import "./globals.css";
import localFont from "next/font/local";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import ClientSideEffect from "@/utils/ClientSideEffect";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

const noora = localFont({
  src: [
    { path: "../../public/fonts/Noora-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../../public/fonts/Noora-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Noora-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Noora-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Noora-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../../public/fonts/Noora-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-noora",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mehrbaran.com"),
  title: {
    template: "%s | کانون مهرباران",
    default: "کانون مسئولیت اجتماعی مهرباران",
  },
  description: "فعالیت‌های داوطلبانه سازمان دانشجویان جهاد دانشگاهی خراسان رضوی",
  icons: {
    icon: "/icons/logo.svg",
    shortcut: "/icons/logo.svg",
    apple: "/icons/logo.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "کانون مسئولیت اجتماعی مهرباران",
    description: "فعالیت‌های داوطلبانه سازمان دانشجویان جهاد دانشگاهی خراسان رضوی",
    siteName: "کانون مهرباران",
    locale: "fa_IR",
    type: "website",
    url: "https://mehrbaran.com",
    images: [
      {
        url: "/icons/logo.svg",
        width: 1200,
        height: 630,
        alt: "کانون مسئولیت اجتماعی مهرباران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "کانون مسئولیت اجتماعی مهرباران",
    description: "فعالیت‌های داوطلبانه سازمان دانشجویان جهاد دانشگاهی خراسان رضوی",
    images: ["/icons/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${noora.variable} ${noora.className} font-noora antialiased w-full min-h-screen flex flex-col`}>
        <ReactQueryProvider>
          <AuthProvider>
            <ClientSideEffect />
            <Header />
            <main className="flex-1 flex flex-col w-full relative">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
