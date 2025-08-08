import OptimizedImage from "@/components/ui/OptimizedImage";
import { AreasOfActivity } from "@/types/types";
import React from "react";
const AreaItem: React.FC<AreasOfActivity> = ({ title, icon, description, color, position }) => {
  return (
    <div
      className={`group transition-all flex flex-col w-40 my-10 ${
        position === "bottom" ? "md:mt-30" : "md:-mt-20"
      }`}
    >
      <div className="py-1.5 px-3 w-full h-10 border border-mblue text-center font-bold bg-mblue/10 hover:bg-mblue/45 rounded-lg">
        {title}
      </div>
      <div className="h-10 w-full">
        <span className="block h-10 w-1/2 border-l border-mblue"></span>
      </div>
      <div className="cursor-grab hover:scale-115 hover:rotate-0 duration-200 rounded-3xl bg-blue-100 border-2 border-b-4 border-r-4 border-mblue w-25 h-25 mx-auto rotate-45 flex items-center justify-center overflow-hidden shadow-[35px_40px_8px_-18px_rgba(0,_0,_0,_0.1)]">
        <OptimizedImage src={icon} alt={`icon ${title}`} width={50} height={50} />
      </div>
      <div className=" h-10 w-full">
        <span className="block h-10 w-1/2 border-l border-mblue"></span>
      </div>
      <div className="border-t hover:mb-5 duration-400 border-mblue w-full h-25 text-center font-bold shadow-lg">
        <p
          className={`h-full flex items-center rounded-lg mt-2 p-2 ${
            color === "mgray" ? "bg-mgray" : "bg-mblue text-white"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default AreaItem;
