import React from "react";

interface Props {
  title: string;
  subTitle?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const HeadTitle: React.FC<Props> = ({ title, subTitle, as: Component = "h2" }) => {
  const SubComponent = Component === "h1" ? "h2" : "h3";
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center md:justify-between gap-2">
        <span className="md:hidden w-full h-[5px] bg-mgray"></span>
        <Component className="text-xl md:text-2xl font-extrabold text-nowrap">{title}</Component>
        <span className="w-full h-[5px] md:h-[2px] bg-mgray"></span>
      </div>
      {subTitle && (
        <SubComponent className="mt-3 text-xs md:text-base font-bold text-center p-1 bg-mgray/30">
          {subTitle}
        </SubComponent>
      )}
    </div>
  );
};

export default HeadTitle;
