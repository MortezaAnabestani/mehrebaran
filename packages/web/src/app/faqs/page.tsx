import FaqSection from "@/components/views/faqs_co/FaqSection";
import api from "@/lib/api";
import { IFaq } from "common-types";

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

  return (
    <div className="w-full md:w-6/10 mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6 px-3">
        <span className="text-3xl">▪ </span>سوالات پرتکرار
      </h1>
      <div>
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <div key={faq._id}>
              <FaqSection answer={faq.answer} question={faq.question} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">در حال حاضر سوالی برای نمایش وجود ندارد.</p>
        )}
      </div>
    </div>
  );
}
