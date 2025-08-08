import React from "react";

interface Props {
  title: string;
  subTitle?: string;
}

const HeadTitle: React.FC<Props> = ({ title, subTitle }) => {
  return (
    <div className="mb-8">
      <div className={`flex items-center justify-center md:justify-between gap-2 `}>
        <span className="md:hidden w-full h-[5px] bg-mgray"></span>
        <h1 className="text-xl md:text-2xl font-extrabold text-nowrap">{title}</h1>
        <span className="w-full h-[5px] md:h-[2px] bg-mgray"></span>
      </div>
      {subTitle && (
        <h2 className="mt-3 text-xs md:text-base font-bold text-center p-1 bg-mgray/30">{subTitle}</h2>
      )}
    </div>
  );
};

export default HeadTitle;
