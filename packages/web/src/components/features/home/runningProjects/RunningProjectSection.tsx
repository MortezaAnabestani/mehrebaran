import React from "react";
import DonationProgress from "./DonationProgress";
import HeadTitle from "../HeadTitle";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Link from "next/link";
import { projects } from "@/fakeData/fakeData";

const RunningProjectsSection: React.FC = ({}) => {
  return (
    <section>
      <HeadTitle title="طرح‌های در حال اجرا" />
      <div className="-translate-y-11">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-mblue/10 md:bg-transparent p-4 md:px-0 pt-10 border-dashed border-b-2 md:border-none border-mblue md:flex items-center justify-between md:gap-20"
          >
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
              <Link
                href={`/projects/active/${project.title}`}
                className="relative w-full mx-auto h-[180px] md:h-[270px] overflow-hidden rounded-xl hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <OptimizedImage src={project.img} alt="نمونه" fill={true} className="object-cover" rounded />
              </Link>
              <div className="block md:hidden">
                <h1 className="text-xl font-bold mb-2">{project.title}</h1>
                <p className="text-justify text-sm/loose">{project.description}</p>
              </div>
            </div>
            <div className="flex flex-col md:h-[270px] justify-between">
              <div className="hidden md:block">
                <h1 className="text-xl font-bold mb-2">{project.title}</h1>
                <p className="text-justify text-sm/loose">{project.description}</p>
              </div>
              <DonationProgress
                targetAmount={project.targetAmount}
                collectedAmount={project.collectedAmount}
                targetVolunteer={project.targetVolunteer}
                collectedVolunteer={project.collectedVolunteer}
                totalRaised={project.totalRaised}
                requiredVolunteers={project.requiredVolunteers}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RunningProjectsSection;
