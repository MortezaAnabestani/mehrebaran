import { IProject } from "common-types";
import React from "react";
import OptimizedImage from "../ui/OptimizedImage";
import Link from "next/link";

interface Props {
  project: IProject;
}

const categoryIcons: { [key: string]: string } = {
  health: "🏥",
  education: "📚",
  housing: "🏠",
  food: "🍽️",
  clothing: "👕",
  other: "📦",
};

const categoryColors: { [key: string]: string } = {
  health: "bg-red-100 text-red-600",
  education: "bg-green-100 text-green-600",
  housing: "bg-yellow-100 text-yellow-600",
  food: "bg-orange-100 text-orange-600",
  clothing: "bg-purple-100 text-purple-600",
  other: "bg-gray-100 text-gray-600",
};

const EnhancedProjectCard: React.FC<Props> = ({ project }) => {
  const financialProgress = project.targetAmount > 0
    ? Math.min((project.amountRaised / project.targetAmount) * 100, 100)
    : 0;

  const volunteerProgress = project.targetVolunteer > 0
    ? Math.min((project.collectedVolunteer / project.targetVolunteer) * 100, 100)
    : 0;

  const categorySlug = typeof project.category === "object" && project.category?.slug
    ? project.category.slug
    : "other";

  const categoryName = typeof project.category === "object" && project.category?.name
    ? project.category.name
    : "سایر";

  const icon = categoryIcons[categorySlug] || "📦";
  const colorClass = categoryColors[categorySlug] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <OptimizedImage
          src={project.featuredImage.desktop}
          alt={project.title}
          fill
          className="object-cover"
        />
        {/* Category Badge */}
        <div className={`absolute top-3 right-3 ${colorClass} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
          <span>{icon}</span>
          <span>{categoryName}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
          {project.excerpt || project.description}
        </p>

        {/* Financial Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>پیشرفت مالی</span>
            <span>{Math.round(financialProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
              style={{ width: `${financialProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-700 mt-1">
            <span className="font-semibold">
              {project.amountRaised.toLocaleString("fa-IR")} تومان
            </span>
            <span className="text-gray-500">
              از {project.targetAmount.toLocaleString("fa-IR")} تومان
            </span>
          </div>
        </div>

        {/* Volunteer Progress */}
        {project.targetVolunteer > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>داوطلبین</span>
              <span>{Math.round(volunteerProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${volunteerProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-700 mt-1">
              <span className="font-semibold">
                {project.collectedVolunteer.toLocaleString("fa-IR")} نفر
              </span>
              <span className="text-gray-500">
                از {project.targetVolunteer.toLocaleString("fa-IR")} نفر
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/projects/active/${project.slug}`}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg text-center font-medium transition-all transform hover:scale-105"
        >
          مشاهده جزئیات و حمایت
        </Link>
      </div>
    </div>
  );
};

export default EnhancedProjectCard;
