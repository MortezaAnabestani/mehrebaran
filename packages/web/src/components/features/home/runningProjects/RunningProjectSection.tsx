"use client";

import React, { useState, useRef, useEffect } from "react";
import DonationProgress from "./DonationProgress";
import HeadTitle from "../HeadTitle";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Link from "next/link";
import { IProject } from "common-types";
import truncateText from "@/utils/truncateText";

export default function RunningProjectsSection({ projects }: { projects: IProject[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // همگام‌سازی اسکرول با آیتم انتخاب شده
  useEffect(() => {
    if (scrollContainerRef.current) {
      const thumbnail = scrollContainerRef.current.children[selectedIndex];
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedIndex]);

  if (!projects || projects.length === 0) {
    return null;
  }

  // نمایش 2 پروژه بر اساس ایندکس
  const displayedProjects =
    projects.length > 1
      ? [projects[selectedIndex], projects[(selectedIndex + 1) % projects.length]]
      : projects;

  // هندلرهای درگ (Drag) برای لیست تامب‌نیل‌ها
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    startXRef.current = e.pageY - scrollContainerRef.current.offsetTop;
    scrollLeftRef.current = scrollContainerRef.current.scrollTop;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walk = (y - startXRef.current) * 2;
    scrollContainerRef.current.scrollTop = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4">
        <HeadTitle title="طرح‌های در حال اجرا" />

        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* محتوای اصلی: نمایش پروژه‌ها */}
          <div
            className={`col-span-12 ${projects.length > 2 ? "lg:col-span-9 xl:col-span-10" : ""} grid gap-4`}
          >
            {displayedProjects.map((project, idx) => (
              <article
                key={project._id}
                className="bg-white rounded-2xl border border-slate-300 shadow-md hover:scale-101 transition-all overflow-hidden flex flex-col md:flex-row h-auto md:h-64 group"
              >
                {/* بخش تصویر */}
                <div className="w-full md:w-64 lg:w-72 shrink-0 relative border-b md:border-b-0 md:border-l border-slate-200 bg-slate-100">
                  <Link href={`/projects/${project.slug}`} className="block w-full h-full relative">
                    <OptimizedImage
                      src={process.env.NEXT_PUBLIC_UPLOADS + project.featuredImage.desktop}
                      alt={project.title}
                      fill={true}
                      className="object-cover transition-transform duration-700 group-hover:scale-103"
                    />
                    {/* Overlay تکنیکال */}
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300" />
                  </Link>

                  {/* بج وضعیت */}
                  <div className="absolute top-2 right-2 bg-gray-400/40 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] ">
                    فعال
                  </div>
                </div>

                {/* بخش محتوا */}
                <div className="flex-1 p-4 md:p-5 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group-hover:text-[#007acc] transition-colors"
                    >
                      <h3 className="text-base md:text-lg font-bold text-slate-800">{project.title}</h3>
                    </Link>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="hidden md:flex items-center gap-1 text-[11px] font-medium text-morange hover:text-[#007acc] transition-colors border border-morange hover:border-[#007acc] px-2 py-1 rounded"
                    >
                      مشاهده جزئیات پروژه
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </Link>
                  </div>

                  <p className="text-[13px] text-slate-600 leading-relaxed text-justify line-clamp-3 md:line-clamp-none">
                    {truncateText(project?.excerpt ?? "", 180)}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-1 gap-4">
                      <DonationProgress project={project} />
                    </div>

                    {/* دکمه موبایل */}
                    <div className="mt-3 md:hidden">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex items-center justify-center w-full py-2 text-xs font-medium text-[#007acc] bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors"
                      >
                        مشاهده جزئیات پروژه
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {projects.length > 2 && (
            <div className="hidden lg:block col-span-3 xl:col-span-2">
              <div className="sticky top-24 bg-white border border-slate-200 rounded-md overflow-hidden">
                {/* هدر لیست */}
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-slate-600">پروژه‌ها</span>
                  <span className="text-[10px] font-mono text-slate-400">{projects.length}</span>
                </div>

                {/* لیست اسکرول‌خور */}
                <div
                  ref={scrollContainerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  className={`
                    flex flex-col max-h-[480px] overflow-y-auto scrollbar-hide
                    ${isDragging ? "cursor-grabbing" : "cursor-grab"}
                    select-none divide-y divide-slate-100
                  `}
                >
                  {projects.map((project, index) => (
                    <button
                      key={project._id}
                      onClick={() => setSelectedIndex(index)}
                      className={`
                        group relative w-full flex items-center gap-3 p-2 text-right transition-colors duration-150
                        ${index === selectedIndex ? "bg-blue-50/50" : "hover:bg-slate-50"}
                      `}
                    >
                      {/* نشانگر وضعیت فعال */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-[3px] transition-colors ${
                          index === selectedIndex ? "bg-[#007acc]" : "bg-transparent"
                        }`}
                      />

                      <div className="relative w-12 h-12 shrink-0 rounded border border-slate-200 overflow-hidden">
                        <OptimizedImage
                          src={process.env.NEXT_PUBLIC_UPLOADS + project.featuredImage.desktop}
                          alt={project.title}
                          fill={true}
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-[10px] font-mono ${
                              index === selectedIndex ? "text-[#007acc]" : "text-slate-400"
                            }`}
                          >
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h5
                          className={`text-[11px] font-medium truncate ${
                            index === selectedIndex ? "text-slate-900" : "text-slate-500"
                          }`}
                        >
                          {project.title}
                        </h5>
                      </div>
                    </button>
                  ))}
                </div>

                {/* فوتر لیست: پروگرس بار */}
                <div className="bg-slate-50 p-3 border-t border-slate-200">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                    <span>درصد مشاهده</span>
                    <span>{Math.round(((selectedIndex + 1) / projects.length) * 100)}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#007acc] transition-all duration-300"
                      style={{ width: `${((selectedIndex + 1) / projects.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
