import React from "react";

interface Props {
  // define your props here
}

const Wave: React.FC<Props> = ({}) => {
  return (
    <>
      <div className="absolute top-0 w-full box h-10 bg-white text-white duration-700 animate-pulse">.</div>
      <div className="absolute top-0 w-full translate-x-4 box h-8 bg-white text-white duration-700 animate-pulse">
        .
      </div>
      <div className="absolute top-0 w-full translate-x-6 box h-6 bg-white text-white duration-700 animate-pulse">
        .
      </div>
    </>
  );
};

export default Wave;
