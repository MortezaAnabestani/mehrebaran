import SmartButton from "@/components/ui/SmartButton";
import { DonationProjectsType } from "@/types/types";
import { formatNumberHumanReadable } from "@/utils/formatNumberHumanReadable";
import Link from "next/link";
import React from "react";

const DonationProgress: React.FC<DonationProjectsType> = ({
  targetAmount,
  collectedAmount,
  targetVolunteer,
  collectedVolunteer,
  totalRaised,
  requiredVolunteers,
}) => {
  return (
    <div className="w-full mt-4 md:mt-1 md:flex justify-between items-center">
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
      <div className="flex flex-row md:flex-col items-center justify-around text-white font-bold gap-3">
        <SmartButton
          variant="mblue"
          href="/"
          asLink={true}
          fullWidth={true}
          className="h-8 w-1/2 text-xs p-2 rounded-xs text-center"
        >
          کمک مالی
        </SmartButton>
        <SmartButton
          variant="mblue"
          href="/"
          asLink={true}
          fullWidth={true}
          className="h-8 w-1/2 text-xs p-2 rounded-xs text-center"
        >
          ثبت‌نام
        </SmartButton>
      </div>
    </div>
  );
};

export default DonationProgress;
