import { IProject } from "common-types";
import React from "react";
import OptimizedImage from "../ui/OptimizedImage";
import SmartButton from "../ui/SmartButton";

interface Props {
  project: IProject;
  baseUrl?: string; // Optional base URL for links (e.g., "/projects/active" or "/projects/completed")
}

const ProjectCard: React.FC<Props> = ({ project, baseUrl = "/projects" }) => {
  const projectUrl = `${baseUrl}/${project.slug}`;

  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-md border border-mgray/65 overflow-hidden h-full w-full`}
    >
      <div className={`w-full h-100 relative`}>
        <OptimizedImage
          src={project.featuredImage.desktop}
          alt={project.title}
          fill={true}
          className={`w-full h-50 object-cover`}
        />
        {/* Status Badge */}
        {project.status === "completed" && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            تکمیل شده
          </div>
        )}
        {project.status === "active" && (
          <div className="absolute top-2 right-2 bg-mblue text-white px-3 py-1 rounded-full text-xs font-medium">
            در حال اجرا
          </div>
        )}
      </div>
      <div className="p-1 md:p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-sm md:text-lg font-semibold mb-2">{project.title}</h3>
          <p className="text-gray-600 text-xs md:text-sm text-justify line-clamp-3">
            {project.excerpt || project.description}
          </p>
        </div>
        <div className="text-left mt-3">
          <SmartButton
            href={projectUrl}
            variant="mblue"
            asLink={true}
            fullWidth={true}
            className="h-8 max-w-30 text-xs p-2 rounded-xs text-center mt-3 my-6 md:my-0"
            size="sm"
          >
            اطلاعات بیش‌تر
          </SmartButton>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
