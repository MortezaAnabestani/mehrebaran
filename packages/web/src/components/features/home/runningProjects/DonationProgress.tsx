import SmartButton from "@/components/ui/SmartButton";
import { DonationProjectsType } from "@/types/types";
import React from "react";
import ProgressBars from "./ProgressBars";

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
      <ProgressBars
        targetAmount={targetAmount}
        collectedAmount={collectedAmount}
        targetVolunteer={targetVolunteer}
        collectedVolunteer={collectedVolunteer}
        totalRaised={totalRaised}
        requiredVolunteers={requiredVolunteers}
      />
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
