import OptimizedImage from "@/components/ui/OptimizedImage";
import React from "react";

interface Props {
  // define your props here
}

const BackGroundImg: React.FC<Props> = ({}) => {
  return (
    <div className="w-full relative h-[100vh] ">
      <OptimizedImage src="/images/hero_img.jpg" alt="عکس پس زمینه مهر باران است" fill={true} />
    </div>
  );
};

export default BackGroundImg;
