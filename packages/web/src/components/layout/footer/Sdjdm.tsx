import OptimizedImage from "@/components/ui/OptimizedImage";
import React from "react";
interface Props {
  setWave: (wave: boolean) => void;
}

const Sdjdm: React.FC<Props> = ({ setWave }) => {
  return (
    <div
      className="relative group hover:bg-mblue hover:-translate-y-7 duration-600 hover:group-last:z-30 cursor-grab"
      onMouseEnter={() => setWave(true)}
      onMouseLeave={() => setWave(false)}
    >
      <OptimizedImage
        src={"/icons/logo.svg"}
        alt="لوگوی مهر باران"
        width={200}
        height={100}
        placeholder="blur"
        blurDataURL="/icons/blur-logo.svg"
        priority="down"
      />
      <p className="text-transparent font-bold text-[14px] absolute pt-1.5 group-hover:bg-mblue group-hover:text-amber-200 text-center duration-300 w-full">
        این‌جا سازمان دانشجویان است
      </p>
    </div>
  );
};

export default Sdjdm;
