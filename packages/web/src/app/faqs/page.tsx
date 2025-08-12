import FaqSection from "@/components/views/faqs_co/FaqSection";
import { FaqsItems } from "@/fakeData/fakeData";
import React from "react";

const FAQs: React.FC = ({}) => {
  return (
    <div className="w-full md:w-6/10 mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6 px-3">
        <span className="text-3xl">▪ </span>سوالات پرتکرار
      </h1>
      <div>
        {FaqsItems.map((faq, index) => (
          <div key={index}>
            <FaqSection answer={faq.answer} question={faq.question} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
