import React from "react";
import OptimizedImage from "../ui/OptimizedImage";
import SmartButton from "../ui/SmartButton";
import { INews, IArticle, IProject, IVideo, IGallery } from "common-types";

type CardItem = (INews | IArticle | IProject | IVideo | IGallery) & {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
};

interface CardProps {
  cardItem?: CardItem;
  horizontal?: boolean;
  page?: "news" | "articles" | "projects" | "videos" | "galleries";
}

const Card: React.FC<CardProps> = ({ cardItem, horizontal = false, page = "news" }) => {
  if (!cardItem) {
    return null;
  }

  return (
    <div
      className={`flex ${
        horizontal ? "flex-row" : "flex-col"
      } bg-white rounded-xl shadow-md border border-mgray/65 overflow-hidden h-full w-full`}
    >
      <div className={`${horizontal ? "w-40 md:w-70" : "w-full h-48"} relative `}>
        <OptimizedImage
          src={cardItem.featuredImage.desktop}
          alt={cardItem.title}
          fill={true}
          className="object-cover min-h-43 max-h-43"
        />
      </div>
      <div className="p-1 md:p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-sm md:text-lg font-semibold mb-2">{cardItem.title}</h3>
          <p className="text-gray-600 text-xs md:text-sm text-justify line-clamp-3">{cardItem.excerpt}</p> //
        </div>
        <div className="text-left mt-3">
          <SmartButton
            href={`/${page}/${cardItem.slug}`}
            variant="mblue"
            asLink={true}
            className="h-8 max-w-30 text-xs p-2 rounded-xs text-center"
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
