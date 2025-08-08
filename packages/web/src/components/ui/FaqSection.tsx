"use client";
import { FAQsType } from "@/types/types";
import { useState, FC } from "react";
import OptimizedImage from "./OptimizedImage";

const FaqSection: FC<FAQsType> = ({ question, answer }) => {
  const [faqOpen, setFaqOpen] = useState<boolean>(false);

  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center bg-red-500 p-3 cursor-pointer"
        onClick={() => setFaqOpen((prev) => !prev)}
      >
        <p className="text-white font-bold">{question}</p>
        {faqOpen ? (
          <OptimizedImage
            width={15}
            height={15}
            className="w-[20px] duration-300"
            src="/icons/chevron_down.svg"
            alt="arrow down"
          />
        ) : (
          <OptimizedImage
            width={15}
            height={15}
            className="w-[20px] -rotate-90 duration-300"
            src="/icons/chevron_down.svg"
            alt="arrow down"
          />
        )}
      </div>
      {faqOpen && <p className="text-justify p-4 bg-stone-600 text-white text-base/8">{answer}</p>}
    </div>
  );
};

export default FaqSection;
