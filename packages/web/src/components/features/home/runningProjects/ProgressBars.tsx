"use client";

import React, { useState } from "react";
import SmartButton from "@/components/ui/SmartButton";
import Modal from "@/components/ui/Modal";
import VolunteerForm from "@/components/shared/VolunteerForm";
import DonationForm from "@/components/shared/DonationForm";
import { useAuth } from "@/contexts/AuthContext";
import { formatNumberHumanReadable } from "@/utils/formatNumberHumanReadable";
import { IProject } from "common-types";

type Props = {
  project: IProject;
  detailpage?: boolean;
};

// زیر-کامپوننت برای جلوگیری از تکرار کد و تمیز نگه داشتن ساختار
const ProgressRow = ({
  current,
  target,
  label,
  unit,
  percentage,
  buttonLabel,
  isEnabled,
  onButtonClick,
  href,
  asLink,
}: {
  current: number;
  target: number;
  label: string;
  unit?: string;
  percentage: number;
  buttonLabel: string;
  isEnabled?: boolean;
  onButtonClick?: () => void;
  href?: string;
  asLink: boolean;
}) => {
  const formattedCurrent = formatNumberHumanReadable(current);
  const formattedTarget = formatNumberHumanReadable(target);

  return (
    <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-3 md:gap-4 py-1 border-b last:border-0 border-gray-50 border-dashed">
      <div className="w-full flex flex-col gap-1">
        <div className="flex justify-between items-center text-xs md:text-sm">
          <span className="text-gray-500 font-medium">{label}</span>
          <div className="flex items-baseline gap-1 flex-wrap justify-end">
            <span className="font-bold text-mblue text-sm md:text-base whitespace-nowrap">
              {formattedCurrent}
            </span>
            <span className="text-gray-400 text-[10px] md:text-xs whitespace-nowrap">
              از {formattedTarget}
            </span>
            {unit && <span className="text-gray-400 text-[10px] md:text-xs">{unit}</span>}
          </div>
        </div>

        {/* نوار پیشرفت مدرن با گوشه‌های گرد */}
        <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="absolute top-0 right-0 h-full bg-mblue rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* دکمه عملیات */}
      {isEnabled && (
        <div className="w-full md:w-auto flex-shrink-0 mt-1 md:mt-0">
          <SmartButton
            variant="mblue"
            href={href}
            asLink={asLink}
            onClick={onButtonClick}
            fullWidth={true}
            className="h-9 md:h-10 md:w-28 text-xs md:text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {buttonLabel}
          </SmartButton>
        </div>
      )}
    </div>
  );
};

const ProgressBars: React.FC<Props> = ({ project, detailpage }) => {
  const { isAuthenticated } = useAuth();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);

  // محاسبه درصدها با اطمینان از عدم تقسیم بر صفر
  const amountProgress = project.targetAmount > 0 ? (project.amountRaised / project.targetAmount) * 100 : 0;

  const volunteerProgress =
    project.targetVolunteer > 0 ? (project.collectedVolunteer / project.targetVolunteer) * 100 : 0;

  const linkStatus = detailpage ? undefined : `/projects/${project.slug}`;
  const asLinkStatus = !detailpage;

  return (
    <div className="flex flex-col gap-2 w-full bg-white/50 rounded-xl">
      {/* بخش کمک مالی */}
      <ProgressRow
        current={project.amountRaised}
        target={project.targetAmount}
        percentage={amountProgress}
        label="مبلغ تأمین‌شده"
        unit="تومان" // یا واحد پول مورد نظر
        buttonLabel="کمک مالی"
        isEnabled={project.donationSettings?.enabled}
        href={linkStatus}
        asLink={asLinkStatus}
        onButtonClick={detailpage ? () => setShowDonationModal(true) : undefined}
      />

      {/* بخش داوطلبان */}
      <ProgressRow
        current={project.collectedVolunteer}
        target={project.targetVolunteer}
        percentage={volunteerProgress}
        label="داوطلبان جذب‌شده"
        unit="نفر"
        buttonLabel="ثبت‌نام"
        isEnabled={project.volunteerSettings?.enabled}
        href={linkStatus}
        asLink={asLinkStatus}
        onButtonClick={detailpage ? () => setShowVolunteerModal(true) : undefined}
      />

      {/* مودال‌ها */}
      <Modal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        title="کمک مالی به پروژه"
        maxWidth="xl"
      >
        <DonationForm project={project} onSuccess={() => setShowDonationModal(false)} />
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
          onSuccess={() => setShowVolunteerModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ProgressBars;
