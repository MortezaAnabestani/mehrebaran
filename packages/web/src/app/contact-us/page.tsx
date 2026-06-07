import OptimizedImage from "@/components/ui/OptimizedImage";
import React from "react";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "تماس با ما | کانون مهرباران",
  description: "راه‌های ارتباطی با کانون مسئولیت اجتماعی مهرباران. نشانی، تلفن و شبکه‌های اجتماعی.",
  alternates: {
    canonical: "https://mehrbaran.com/contact-us",
  },
  openGraph: {
    title: "تماس با ما | کانون مهرباران",
    description: "راه‌های ارتباطی با کانون مسئولیت اجتماعی مهرباران. نشانی، تلفن و شبکه‌های اجتماعی.",
    url: "https://mehrbaran.com/contact-us",
    siteName: "کانون مهرباران",
    locale: "fa_IR",
    type: "website",
    images: [{ url: "https://mehrbaran.com/images/default-og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "تماس با ما | کانون مهرباران",
    description: "راه‌های ارتباطی با کانون مسئولیت اجتماعی مهرباران. نشانی، تلفن و شبکه‌های اجتماعی.",
  },
};

const ContactUs: React.FC = () => {
  return (
    <main className="flex flex-col h-fit justify-between w-9/10 md:w-6/10 mx-auto  gap-3 py-20 font-bold">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "ContactPage",
                "@id": "https://mehrbaran.com/contact-us",
                "url": "https://mehrbaran.com/contact-us",
                "name": "تماس با مهرباران",
                "description": "راه‌های ارتباطی با کانون مسئولیت اجتماعی مهرباران",
                "inLanguage": "fa-IR"
              },
              {
                "@type": "NGO",
                "@id": "https://mehrbaran.com/#organization",
                "name": "کانون مهرباران",
                "url": "https://mehrbaran.com",
                "logo": "https://mehrbaran.com/icons/logo.svg",
                "inLanguage": "fa-IR",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "مشهد",
                  "addressRegion": "خراسان رضوی",
                  "streetAddress": "میدان آزادی، پردیس دانشگاه فردوسی، سازمان مرکزی جهاد دانشگاهی خراسان رضوی، ساختمان معاونت فرهنگی، دفتر سازمان دانشجویان جهاد دانشگاهی",
                  "postalCode": "977949367"
                },
                "telephone": "+985131997333",
                "sameAs": [
                  "https://instagram.com/sdjdm.ir"
                ]
              }
            ]
          })
        }}
      />
      <h1 className="w-full text-right border-b-2 border-mblue pb-2 text-2xl">تماس با ما</h1>
      <OptimizedImage width={30} height={30} src="/icons/location.svg" alt="contact-us icon" />
      <p>
        نشانی: مشهد، میدان آزادی، پردیس دانشگاه فردوسی، سازمان مرکزی جهاد دانشگاهی خراسان رضوی، ساختمان معاونت
        فرهنگی، <span className="text-mblue">دفتر سازمان دانشجویان جهاد دانشگاهی</span>
      </p>
      <p>تلفن: <span className="inline-block" dir="ltr">05131997333</span></p>
      <p>کد پستی: <span className="inline-block" dir="ltr">977949367</span></p>
      <p>اینستاگرام: <span className="inline-block" dir="ltr">sdjdm.ir</span></p>
    </main>
  );
};

export default ContactUs;
