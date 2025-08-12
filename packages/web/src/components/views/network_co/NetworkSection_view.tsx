import OptimizedImage from "@/components/ui/OptimizedImage";
import { NeedsNetworkSectionsType } from "@/types/types";
import Link from "next/link";
import React from "react";

interface Props {
  item: NeedsNetworkSectionsType;
}

const NetworkSection_view: React.FC<Props> = ({ item }) => {
  if (!item) return null;

  return (
    <div className="flex flex-col gap-3 my-10">
      <div className="w-full flex justify-between items-center">
        <Link href={`/network/${item.link}`}>
          <h1 className="flex items-center gap-2 font-extrabold">
            <span className="w-5 h-5 rounded-sm bg-morange block"></span>
            {item.title}
          </h1>
          <h2>{item.subtitle}</h2>
        </Link>
        <OptimizedImage src={item.icon} alt={`icon ${item.icon}`} width={50} height={50} />
      </div>
      {item.subject.map((sub, index) => (
        <Link href={`/network/${item.link}/${sub.title}`}>
          <div
            key={index}
            className="flex items-center justify-between border-b border-mblue/40 md:border-b-0"
          >
            <span className="md:w-30 md:h-30 bg-mgray rounded-md block"></span>
            <div>
              <h2 className="text-xs md:text-base font-bold">{sub.title}</h2>
              <p className="text-xs/relaxed md:text-base">{sub.description}</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="bg-mgray w-8 h-8 md:w-10 md:h-10 rounded-sm flex flex-col items-center justify-center">
                <OptimizedImage src="/icons/up.svg" alt="up icon" width={20} height={20} />
                <p className="font-bold text-xs md:text-base">{sub.totalVote}</p>
              </div>
              <div className="bg-mgray w-8 h-8 md:w-10 md:h-10 rounded-sm flex flex-col items-center justify-center">
                <OptimizedImage src="/icons/comment.svg" alt="up icon" width={20} height={20} />
                <p className="font-bold text-xs md:text-base">{sub.comments.length}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NetworkSection_view;
