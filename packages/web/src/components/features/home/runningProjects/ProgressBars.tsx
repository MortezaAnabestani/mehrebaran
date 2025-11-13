"use client";

import SmartButton from "@/components/ui/SmartButton";
import { formatNumberHumanReadable } from "@/utils/formatNumberHumanReadable";
import { IProject } from "common-types";
import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import VolunteerForm from "@/components/shared/VolunteerForm";
import DonationForm from "@/components/shared/DonationForm";

type Props = {
  project: Pick<
    IProject,
    | "amountRaised"
    | "targetAmount"
    | "collectedVolunteer"
    | "targetVolunteer"
    | "slug"
    | "donationSettings"
    | "volunteerSettings"
  >;
  isAuthenticated?: boolean;
  detailpage?: boolean;
};

const ProgressBars: React.FC<Props> = ({ project, isAuthenticated = false, detailpage }) => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const amountProgress = project.targetAmount > 0 ? (project.amountRaised / project.targetAmount) * 100 : 0;
  const volunteerProgress =
    project.targetVolunteer > 0 ? (project.collectedVolunteer / project.targetVolunteer) * 100 : 0;

  const linkStatus = detailpage ? undefined : `/projects/${project.slug}`;
  const onClickStatusDonationModal = detailpage ? () => setShowDonationModal(true) : undefined;
  const onClickStatusVolunteerModal = detailpage ? () => setShowVolunteerModal(true) : undefined;

  const asLinkStatus = detailpage ? false : true;

  return (
    <div className="my-2 flex flex-col gap-1">
      <div className="my-2 w-full flex flex-col md:flex-row justify-between items-end gap-2 md:gap-5">
        <div className="w-full">
          <h6 className="text-mblue font-bold text-[10px] md:text-sm">
            {formatNumberHumanReadable(project.amountRaised)} از{" "}
            {formatNumberHumanReadable(project.targetAmount)}
            <span className="text-black text-xs"> | میزان مبلغ تأمین‌شده</span>
          </h6>
          <span className="w-full h-3 bg-mgray block mt-1 rounded overflow-hidden">
            <span
              className="h-full bg-mblue block transition-all duration-500"
              style={{ width: `${amountProgress}%` }}
            ></span>
          </span>
        </div>
        {project.donationSettings?.enabled && (
          <SmartButton
            variant="mblue"
            href={linkStatus}
            asLink={asLinkStatus}
            onClick={onClickStatusDonationModal}
            fullWidth={true}
            className="h-8 md:w-26 md:min-w-26 text-xs p-2 rounded-xs text-center"
          >
            کمک مالی
          </SmartButton>
        )}
      </div>
      <div className="my-2 w-full flex flex-col md:flex-row justify-between items-end gap-2 md:gap-5">
        <div className="w-full">
          <h6 className="text-mblue font-bold text-[10px] md:text-sm">
            {project.collectedVolunteer} نفر از {project.targetVolunteer} نفر
            <span className="text-black text-xs"> | تعداد داوطلب مورد نیاز</span>
          </h6>
          <span className="w-full h-3 bg-mgray block mt-1 rounded overflow-hidden">
            <span
              className="h-full bg-mblue block transition-all duration-500"
              style={{ width: `${volunteerProgress}%` }}
            ></span>
          </span>
        </div>
        {project.volunteerSettings?.enabled && (
          <SmartButton
            variant="mblue"
            href={linkStatus}
            asLink={asLinkStatus}
            onClick={onClickStatusVolunteerModal}
            fullWidth={true}
            className="h-8 md:w-26 md:min-w-26 text-xs p-2 rounded-xs text-center"
          >
            ثبت‌نام
          </SmartButton>
        )}
      </div>
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
};

export default ProgressBars;
