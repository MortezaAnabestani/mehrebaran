import { getProjectByIdOrSlug } from "@/services/project.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import HeadTitle from "@/components/features/home/HeadTitle";
import ProgressBars from "@/components/features/home/runningProjects/ProgressBars";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import SmartSwiper from "@/components/ui/swiper/SmartSwiper";
import { IProject } from "common-types";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectByIdOrSlug(params.slug);

  if (!project) {
    return {
      title: "پروژه یافت نشد",
    };
  }

  return {
    title: project.title,
    description: project.excerpt,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const project: IProject | null = await getProjectByIdOrSlug(params.slug);

  if (!project) {
    notFound();
  }

  const allImages = [project.featuredImage, ...(project.gallery || [])];

  const deadlineDate = new Date(project.deadline);
  const today = new Date();
  const daysRemaining = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const reviewProject = [
    { item: daysRemaining > 0 ? daysRemaining : 0, title: "روز مانده تا پایان طرح" },
    { item: project.collectedVolunteer, title: "تعداد افراد حمایت‌گر" },
    { item: project.targetVolunteer, title: "تعداد داوطلب مورد نیاز" },
    { item: project.targetAmount.toLocaleString(), title: "کل مبلغ مورد نیاز (تومان)" },
  ];

  return (
    <div className="w-9/10 md:w-8/10 mx-auto my-10">
      <HeadTitle title={project.title} />
      <div className="w-full flex flex-col md:flex-row items-center justify-between md:h-90 gap-3">
        <div className="w-full md:w-1/2 h-full">
          <SmartSwiper
            items={allImages.map((image, index) => (
              <div
                key={index}
                className="h-45 md:h-90 w-full rounded-xl border border-mblue/30 shadow-2xs shadow-mgray"
              >
                <OptimizedImage src={image.desktop} alt={project.title} fill={true} priority="up" rounded />
              </div>
            ))}
            showPagination
            showNavigation
            outsideBtn={false}
          />
        </div>
        <div className="w-full md:w-1/2 h-full flex flex-col justify-between items-center gap-3">
          <div className="w-full">
            <ProgressBars
              amountRaised={project.amountRaised}
              collectedVolunteer={project.collectedVolunteer}
              targetAmount={project.targetAmount}
              targetVolunteer={project.targetVolunteer}
            />
          </div>

          <div className="w-full h-full flex flex-col justify-between items-center gap-3">
            <div className="w-full p-4 bg-mgray rounded-xl">
              <h1 className="font-bold mb-2">نوع اثرگذاری در این طرح</h1>
              <div className="flex items-center justify-around text-white font-bold gap-3">
                <SmartButton
                  variant="mblue"
                  href="/"
                  asLink={true}
                  fullWidth={true}
                  className="h-8 w-1/2 text-xs p-2 rounded-xs text-center"
                >
                  کمک مالی
                </SmartButton>
                <SmartButton
                  variant="mblue"
                  href="/"
                  asLink={true}
                  fullWidth={true}
                  className="h-8 w-1/2 text-xs p-2 rounded-xs text-center"
                >
                  ثبت‌نام
                </SmartButton>
              </div>
            </div>
            <div className="w-full px-4 py-6 bg-mgray rounded-xl">
              <div className="flex flex-col items-center justify-around text-white font-bold gap-4">
                <input
                  type="text"
                  placeholder="مبلغ دلخواه را وارد کنید..."
                  className="bg-mblue h-8 w-full text-xs p-2 rounded-xs text-right focus:outline-mblue/70"
                />
                <SmartButton
                  variant="mblue"
                  href="/"
                  asLink={true}
                  fullWidth={true}
                  className="h-8 w-1/2 text-xs p-2 rounded-xs text-center"
                >
                  پرداخت
                </SmartButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full my-3 flex items-center justify-between gap-2 md:gap-5 flex-wrap md:flex-nowrap">
        {reviewProject.map((item, index) => (
          <div
            key={index}
            className="w-[45%] md:w-full h-15 md:h-20 bg-mgray flex flex-col items-center justify-center rounded-xl"
          >
            <h1 className="text-lg md:text-2xl text-mblue font-bold">{item.item}</h1>
            <p className="font-bold text-xs md:text-base">{item.title}</p>
          </div>
        ))}
      </div>
      <div
        className="text-sm/loose text-justify my-5 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: project.description }}
      />
    </div>
  );
}
