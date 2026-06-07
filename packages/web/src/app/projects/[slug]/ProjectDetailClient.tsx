"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { IProject } from "common-types";
import HeadTitle from "@/components/features/home/HeadTitle";
import ProgressBars from "@/components/features/home/runningProjects/ProgressBars";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import SmartSwiper from "@/components/ui/swiper/SmartSwiper";
import Comment from "@/components/shared/Comment";

const DonationForm = dynamic(() => import("@/components/shared/DonationForm"), { ssr: false });
const VolunteerForm = dynamic(() => import("@/components/shared/VolunteerForm"), { ssr: false });
const Modal = dynamic(() => import("@/components/ui/Modal"), { ssr: false });

interface Props {
  project: IProject;
  isAuthenticated?: boolean;
}

export default function ProjectDetailClient({ project, isAuthenticated = false }: Props) {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);

  const allImages = [project.featuredImage, ...(project.gallery || [])];

  const deadlineDate = new Date(project.deadline);
  const today = new Date();
  const daysRemaining = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const reviewProject = [
    { item: daysRemaining > 0 ? daysRemaining : 0, title: "روز مانده تا پایان طرح" },
    { item: project.donorCount || 0, title: "تعداد افراد حمایت‌گر" },
    { item: project.volunteerCount || 0, title: "تعداد داوطلب فعال" },
    { item: project.targetAmount.toLocaleString(), title: "کل مبلغ مورد نیاز (تومان)" },
  ];

  return (
    <div className="w-full px-4 md:px-0 md:w-10/12 lg:w-4/5 mx-auto mt-6 mb-2 md:my-10 pb-2 md:pb-12">
      <HeadTitle title={project.title} />

      <div className="w-full flex flex-col md:flex-row items-center justify-between md:h-90 gap-3">
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 h-full">
          <SmartSwiper
            items={allImages.map((image, index) => (
              <div
                key={index}
                className="h-45 md:h-90 w-full rounded-xl border border-mblue/30 shadow-2xs shadow-mgray"
              >
                <OptimizedImage
                  src={process.env.NEXT_PUBLIC_UPLOADS + image.desktop}
                  alt={project.title}
                  fill={true}
                  priority={index === 0 ? "up" : "down"}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  rounded
                />
              </div>
            ))}
            showPagination
            showNavigation
            outsideBtn={false}
          />
        </div>

        {/* Actions and Progress */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-between items-center gap-3">
          <div className="w-full">
            <ProgressBars project={project} detailpage={true} />
          </div>

          {/* Action Buttons */}
          <div className="w-full h-full flex flex-col justify-between items-center gap-3">
            {/* Quick Donation Amounts */}
            {project.donationSettings?.enabled && (
              <div className="w-full px-4 py-6 bg-mgray rounded-xl">
                <h2 className="font-bold mb-3 text-center">کمک سریع</h2>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[50000, 100000, 200000].map((amount) => (
                    <SmartButton
                      key={amount}
                      onClick={() => setShowDonationModal(true)}
                      className="h-10 text-xs"
                    >
                      {amount.toLocaleString("fa-IR")} ت
                    </SmartButton>
                  ))}
                </div>
                <SmartButton
                  variant="mblue"
                  onClick={() => setShowDonationModal(true)}
                  fullWidth={true}
                  className="h-10 text-sm"
                >
                  مبلغ دلخواه
                </SmartButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="w-full my-3 flex items-center justify-between gap-2 md:gap-5 flex-wrap md:flex-nowrap">
        {reviewProject.map((item, index) => (
          <div
            key={index}
            className="w-[45%] md:w-full h-15 md:h-20 bg-mgray flex flex-col items-center justify-center rounded-xl"
          >
            <div className="text-lg md:text-2xl text-mblue font-bold">{item.item}</div>
            <p className="font-bold text-xs md:text-base">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Project Description */}
      <div
        className="text-sm/loose text-justify my-5 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: project.description }}
      />

      {/* Comments Section */}
      <div className="mt-8 md:mt-16">
        <Comment postId={project._id} postType="Project" />
      </div>

      {/* Modals */}
      <Modal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        title="کمک مالی به پروژه"
        maxWidth="xl"
      >
        <DonationForm
          project={project}
          onSuccess={() => {
            setShowDonationModal(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={showVolunteerModal}
        onClose={() => setShowVolunteerModal(false)}
        title="ثبت‌نام به عنوان داوطلب"
        maxWidth="xl"
      >
        <VolunteerForm
          project={project}
          isAuthenticated={isAuthenticated}
          onSuccess={() => {
            setShowVolunteerModal(false);
          }}
        />
      </Modal>
    </div>
  );
}
