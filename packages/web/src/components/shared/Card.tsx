import React from "react";
import OptimizedImage from "../ui/OptimizedImage";
import SmartButton from "../ui/SmartButton";
import { CardType } from "@/types/types";

interface CardTypeCombine {
  cardItems: CardType;
  horizontal?: boolean;
}

const Card: React.FC<CardTypeCombine> = ({ cardItems, horizontal = false }) => {
  return (
    <div
      className={`flex ${
        horizontal ? "flex-row" : "flex-col"
      } bg-white rounded-xl shadow-md border border-mgray/65 overflow-hidden ${
        horizontal ? "h-40 md:h-50" : "h-full"
      } ${horizontal ? "w-full" : "w-full"}`}
    >
      <div className={`${horizontal ? "w-40 md:w-70 h-40 md:h-50" : "w-full h-100"} relative `}>
        <OptimizedImage
          src={cardItems.img}
          alt={cardItems.title}
          fill={true}
          className={`${horizontal ? "w-1/4 h-50" : "w-full"} h-50 object-cover`}
        />
      </div>
      <div className="p-1 md:p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-sm md:text-lg font-semibold mb-2">{cardItems.title}</h3>
          <p className="text-gray-600 text-xs md:text-sm">{cardItems.description}</p>
        </div>
        <div className="text-left">
          <SmartButton
            href={cardItems.href}
            variant="mblue"
            asLink={true}
            fullWidth={true}
            className="h-8 max-w-30 text-xs p-2 rounded-xs text-center mt-3 my-6 md:my-0"
            size="sm"
          >
            اطلاعات بیش‌تر
          </SmartButton>
        </div>
      </div>
    </div>
  );
};

export default Card;
