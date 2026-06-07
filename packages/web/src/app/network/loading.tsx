import React from "react";

export default function NetworkLoading() {
  return (
    <div className="flex justify-center items-center h-[50vh] bg-[#f0f2f5]">
      <div className="animate-spin w-10 h-10 border-4 border-[#007acc] border-t-transparent rounded-full" aria-label="در حال بارگذاری..."></div>
    </div>
  );
}
