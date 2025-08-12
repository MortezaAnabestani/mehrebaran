import { DonationProjectsType } from "@/types/types";
import { formatNumberHumanReadable } from "@/utils/formatNumberHumanReadable";
import React from "react";

const ProgressBars: React.FC<DonationProjectsType> = ({
  collectedAmount,
  targetAmount,
  totalRaised,
  collectedVolunteer,
  targetVolunteer,
  requiredVolunteers,
}) => {
  return (
    <div className="my-2">
      <div className="my-2">
        <h6 className="text-mblue font-bold text-[10px] md:text-sm">
          {formatNumberHumanReadable(collectedAmount)} از {formatNumberHumanReadable(targetAmount)}
          <span className="text-black"> | {totalRaised}</span>
        </h6>
        <span className="w-full h-3 bg-mgray block mt-1 rounded overflow-hidden">
          <span
            className="h-full bg-mblue block transition-all duration-500"
            style={{ width: `${(collectedAmount / targetAmount) * 100}%` }}
          ></span>
        </span>
      </div>
      <div className="my-2">
        <h6 className="text-mblue font-bold text-[10px] md:text-sm">
          {collectedVolunteer} نفر از {targetVolunteer} نفر
          <span className="text-black"> | {requiredVolunteers}</span>
        </h6>
        <span className="w-full h-3 bg-mgray block mt-1 rounded overflow-hidden">
          <span
            className="h-full bg-mblue block transition-all duration-500"
            style={{ width: `${(collectedVolunteer / targetVolunteer) * 100}%` }}
          ></span>
        </span>
      </div>
    </div>
  );
};

export default ProgressBars;
