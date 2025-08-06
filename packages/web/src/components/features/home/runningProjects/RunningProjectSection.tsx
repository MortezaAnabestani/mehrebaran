import React from "react";
import DonationProgress from "./DonationProgress";

interface Props {
  // define your props here
}

const RunningProjectsSection: React.FC<Props> = ({}) => {
  return (
    <section>
      <DonationProgress />
    </section>
  );
};

export default RunningProjectsSection;
