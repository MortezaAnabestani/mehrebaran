import { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

const siteUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3000";
const url = `${siteUrl}/privacy`;

export const metadata: Metadata = {
  title: "قوانین و مقررات | کانون مهر باران",
  description: "قوانین و مقررات ارسال درخواست کمک به کانون مسئولیت اجتماعی مهر باران و حفظ حریم خصوصی کاربران.",
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: "قوانین و مقررات | کانون مهر باران",
    description: "قوانین، مقررات و حریم خصوصی در کانون مهر باران را مطالعه کنید.",
    url,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "قوانین و مقررات | کانون مهر باران",
    description: "قوانین، مقررات و حریم خصوصی در کانون مهر باران را مطالعه کنید.",
  },
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "قوانین و مقررات",
  description: "قوانین و مقررات ارسال درخواست کمک به کانون مسئولیت اجتماعی مهر باران.",
  url,
  inLanguage: "fa-IR",
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "خانه",
      item: siteUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "قوانین و مقررات",
      item: url,
    },
  ],
};

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <PrivacyContent />
    </>
  );
}
