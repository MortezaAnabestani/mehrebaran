import React from "react";

interface Props {
  prevRef: React.Ref<HTMLButtonElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  outsideBtn?: boolean;
}

const SwiperButton: React.FC<Props> = ({ prevRef, nextRef, outsideBtn = true }) => {
  return (
    <>
      <button
        ref={prevRef}
        className={`absolute ${
          outsideBtn ? "-left-11" : "left-11"
        } top-1/2 -translate-y-1/2 z-10 bg-mblue shadow-lg rounded-full p-1.5 hover:bg-mblue/80 cursor-pointer`}
        aria-label="Previous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        ref={nextRef}
        className={`absolute ${
          outsideBtn ? "-right-11" : "right-11"
        }  top-1/2 -translate-y-1/2 z-10 bg-mblue shadow-lg rounded-full p-1.5 hover:bg-mblue/80 cursor-pointer`}
        aria-label="Next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );
};

export default SwiperButton;
