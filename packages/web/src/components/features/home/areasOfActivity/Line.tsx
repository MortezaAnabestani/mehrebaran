import React from "react";

interface Props {
  isCurrentTop: boolean;
  isNextBottom: boolean;
}

const Line: React.FC<Props> = ({ isCurrentTop, isNextBottom }) => {
  return (
    <div
      className={`absolute left-1/2 -z-20 top-1/5 animate-pulse ${
        isCurrentTop && isNextBottom ? "translate-y-6" : isCurrentTop ? "translate-y-4" : "translate-y-10"
      } w-200 h-20 overflow-visible`}
    >
      <svg width="100%" height="100%">
        <path
          d={
            isCurrentTop && isNextBottom
              ? "M0,0 C80,0 120,80 250,80"
              : isCurrentTop
              ? "M0,0 C100,0 90,0 250,80"
              : "M0,80 C40,80 90,0 250,20"
          }
          stroke="#ff9434"
          strokeWidth="7"
          fill="transparent"
        />
      </svg>
    </div>
  );
};

export default Line;
