import FaqSection from "@/components/views/faqs_co/FaqSection";
import api from "@/lib/api";
import { IFaq } from "common-types";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "سوالات متداول | کانون مهرباران",
  description: "پاسخ به سوالات پرتکرار شما درباره کمک‌ها، پروژه‌ها و فعالیت‌های کانون مسئولیت اجتماعی مهرباران",
  alternates: {
    canonical: "https://mehrbaran.com/faqs",
  },
  openGraph: {
    title: "سوالات متداول | کانون مهرباران",
    description: "پاسخ به سوالات پرتکرار شما درباره کمک‌ها، پروژه‌ها و فعالیت‌های کانون مسئولیت اجتماعی مهرباران",
    url: "https://mehrbaran.com/faqs",
    siteName: "کانون مهرباران",
    locale: "fa_IR",
    type: "website",
    images: [{ url: "https://mehrbaran.com/images/default-og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "سوالات متداول | کانون مهرباران",
    description: "پاسخ به سوالات پرتکرار شما درباره کمک‌ها، پروژه‌ها و فعالیت‌های کانون مسئولیت اجتماعی مهرباران",
  },
};

async function getFaqs(): Promise<IFaq[]> {
  try {
    const response = await api.get("/faqs/client");
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    return [];
  }
}

export default async function FaqsPage() {
  const faqs = await getFaqs();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": "fa-IR",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <main className="w-full md:w-6/10 mx-auto my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-2xl font-bold mb-6 px-3">
        <span className="text-3xl">▪ </span>سوالات پرتکرار
      </h1>
      <div>
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <FaqSection key={faq._id} answer={faq.answer} question={faq.question} />
          ))
        ) : (
          <p className="text-center text-gray-600">در حال حاضر سوالی برای نمایش وجود ندارد.</p>
        )}
      </div>
    </main>
  );
}
