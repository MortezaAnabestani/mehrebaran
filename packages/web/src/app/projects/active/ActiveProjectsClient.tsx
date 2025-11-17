"use client";

import { IProject } from "common-types";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EnhancedProjectCard from "@/components/shared/EnhancedProjectCard";
import HelpRequestForm from "@/components/shared/HelpRequestForm";
import Pagination from "@/components/ui/Pagination";

interface Props {
  initialProjects: IProject[];
  totalPages: number;
  currentPage: number;
  selectedCategory?: string;
}

const categories = [
  { id: "all", name: "همه پروژه‌ها", icon: "📋", color: "bg-blue-500" },
  { id: "health", name: "بهداشت و سلامت", icon: "🏥", color: "bg-red-500" },
  { id: "education", name: "آموزش", icon: "📚", color: "bg-green-500" },
  { id: "housing", name: "مسکن", icon: "🏠", color: "bg-yellow-500" },
  { id: "food", name: "غذا", icon: "🍽️", color: "bg-orange-500" },
  { id: "clothing", name: "پوشاک", icon: "👕", color: "bg-purple-500" },
  { id: "other", name: "سایر", icon: "📦", color: "bg-gray-500" },
];

export default function ActiveProjectsClient({
  initialProjects,
  totalPages,
  currentPage,
  selectedCategory,
}: Props) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(selectedCategory || "all");

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === "all") {
      router.push("/projects/active");
    } else {
      router.push(`/projects/active?category=${categoryId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            شبکه نیازسنجی
          </h1>
          <p className="text-center text-blue-100 max-w-3xl mx-auto">
            با کمک شما، می‌توانیم زندگی بهتری برای نیازمندان فراهم کنیم. در این صفحه می‌توانید پروژه‌های
            فعال را مشاهده کرده و با کمک‌های مالی یا داوطلبانه خود، در تحقق آن‌ها مشارکت کنید.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            دسته‌بندی‌ها
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  activeCategory === cat.id
                    ? `${cat.color} text-white border-transparent shadow-lg transform scale-105`
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-sm font-medium text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {initialProjects.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                پروژه‌های در حال اجرا
                {activeCategory !== "all" && (
                  <span className="text-blue-600 mr-2">
                    ({categories.find((c) => c.id === activeCategory)?.name})
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialProjects.map((project) => (
                  <EnhancedProjectCard key={project._id} project={project} />
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mb-12">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">در حال حاضر پروژه‌ای در این دسته‌بندی وجود ندارد.</p>
            <button
              onClick={() => handleCategoryChange("all")}
              className="text-blue-600 hover:underline"
            >
              مشاهده همه پروژه‌ها →
            </button>
          </div>
        )}

        {/* Help Request Form */}
        <div className="mt-16">
          <HelpRequestForm />
        </div>
      </div>
    </div>
  );
}
