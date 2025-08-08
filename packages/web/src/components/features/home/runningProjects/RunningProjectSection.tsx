import React from "react";
import DonationProgress from "./DonationProgress";
import HeadTitle from "../HeadTitle";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { DonationProjectsType, RuningProjectsType } from "@/types/types";

type CombinedProjectType = RuningProjectsType & DonationProjectsType;

const projects: CombinedProjectType[] = [
  {
    title: "نان و پنیر و همدلی",
    description:
      " با استفاده از طراحان گرافیک است گرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی",
    img: "/images/1.png",
    targetAmount: 50000000,
    collectedAmount: 17500000,
    targetVolunteer: 100,
    collectedVolunteer: 50,
    totalRaised: "میزان مبلغ تأمین‌شده",
    requiredVolunteers: "تعداد داوطلب مورد نیاز",
  },
  {
    title: "به رنگ شادی",
    description:
      " با استفاده از طراحان گرافیک است گرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی",
    img: "/images/2.png",
    targetAmount: 46500000,
    collectedAmount: 22000000,
    targetVolunteer: 100,
    collectedVolunteer: 30,
    totalRaised: "میزان مبلغ تأمین‌شده",
    requiredVolunteers: "تعداد داوطلب مورد نیاز",
  },
];

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
              <div className="relative w-full mx-auto h-[180px] md:h-[270px] overflow-hidden rounded-xl">
                <OptimizedImage src={project.img} alt="نمونه" fill={true} className="object-cover" rounded />
              </div>
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
