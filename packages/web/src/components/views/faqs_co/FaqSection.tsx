"use client";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { FAQsType } from "@/types/types";
import { useState, FC } from "react";

const FaqSection: FC<FAQsType> = ({ question, answer }) => {
  const [faqOpen, setFaqOpen] = useState<boolean>(false);

  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center bg-mgray p-3 cursor-pointer rounded-t-lg"
        onClick={() => setFaqOpen((prev) => !prev)}
      >
        <p className="font-bold">{question}</p>
        {faqOpen ? (
          <OptimizedImage
            width={25}
            height={25}
            className="duration-300 bg-mblue p-1 rounded-full"
            src="/icons/chevron_down.svg"
            alt="arrow down"
          />
        ) : (
          <OptimizedImage
            width={25}
            height={25}
            className="-rotate-90 duration-300 bg-mblue p-1 rounded-full"
            src="/icons/chevron_down.svg"
            alt="arrow down"
          />
        )}
      </div>
      {faqOpen && <p className="text-justify p-4 bg-mblue text-white text-base/8 rounded-b-lg">{answer}</p>}
    </div>
  );
};

export default FaqSection;
