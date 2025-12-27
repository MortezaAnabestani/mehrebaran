import { IProject } from "common-types";
import ProgressBars from "./ProgressBars";

type Props = {
  project: IProject;
};

const DonationProgress: React.FC<Props> = ({ project }) => {
  return (
    <div className="w-full mt-4 md:mt-1 md:flex justify-between items-center md:gap-5">
      <ProgressBars project={project} />
    </div>
  );
};

export default DonationProgress;
