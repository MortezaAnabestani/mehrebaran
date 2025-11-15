import Card from "@/components/shared/Card";
import SmartButton from "@/components/ui/SmartButton";
import { CardType } from "@/types/types";
import React from "react";

interface HeroViewsProps {
  cardItems: CardType[];
  horizontal?: boolean;
  page?: "news" | "blog" | "blog/articles" | "blog/gallery" | "blog/videos";
}

const HeroShared_views: React.FC<HeroViewsProps> = ({ cardItems, horizontal = false, page = "blog" }) => {
  return (
    <>
      <div className="flex flex-wrap gap-8 items-center justify-between w-full my-10">
        {cardItems.map((card, index) => {
          if (index === 0) {
            return (
              <div
                className={`${
                  horizontal ? "md:flex-8/12" : "md:flex-7/12"
                } md:h-100 bg-mblue/70 bg-no-repeat text-white bg-cover object-cover rounded-lg flex flex-col items-start justify-end md:p-10`}
                style={{
                  backgroundImage: `url(${card.img})`,
                  backgroundPosition: "center",
                  backgroundBlendMode: "darken",
                  backgroundSize: "100%",
                }}
                key={index}
              >
                <h1 className="text-lg md:text-2xl font-bold p-5">{card.title}</h1>
                <p className="text-xs md:text-base font-bold p-5">{card.description}</p>
              </div>
            );
          } else {
            return (
              <div className={` ${horizontal ? "md:flex-5/12" : "md:flex-3/12 h-80 md:h-100"} `} key={index}>
                <Card cardItem={card} horizontal={horizontal} page={page} />
              </div>
            );
          }
        })}
      </div>
      {horizontal && (
        <SmartButton
          className="h-8 cursor-pointer mb-5"
          fullWidth={true}
          variant="mblue"
          href={page}
          asLink={true}
        >
          بیش‌تر...
        </SmartButton>
      )}
    </>
  );
};

export default HeroShared_views;
