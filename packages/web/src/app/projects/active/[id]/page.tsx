import HeadTitle from "@/components/features/home/HeadTitle";
import ProgressBars from "@/components/features/home/runningProjects/ProgressBars";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import SmartSwiper from "@/components/ui/swiper/SmartSwiper";
import { projects } from "@/fakeData/fakeData";
import { title } from "process";
import React from "react";

const reviewProject = [
  { item: projects[0].deadLine, title: "روز مانده تا طرح" },
  { item: projects[0].collectedVolunteer, title: "تعداد افراد حمایت‌گر" },
  { item: projects[0].targetVolunteer, title: "تعداد داوطلب مورد نیاز" },
  { item: projects[0].targetAmount, title: "کل مبلغ مورد نیاز" },
];

const page: React.FC = ({}) => {
  return (
    <div className="w-9/10 md:w-8/10 mx-auto my-10">
      <HeadTitle title="به‌رنگ شادی" />
      <div className="w-full flex flex-col md:flex-row items-center justify-between md:h-90 gap-3">
        <div className="w-full md:w-1/2 h-full">
          <SmartSwiper
            items={projects.map((item, index) => (
              <div
                key={index}
                className="h-45 md:h-90 w-full rounded-xl border border-mblue/30 shadow-2xs shadow-mgray"
              >
                <OptimizedImage src={item.img} alt={item.title} fill={true} priority="up" rounded />
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
              collectedAmount={projects[0].collectedAmount}
              collectedVolunteer={projects[0].collectedVolunteer}
              requiredVolunteers={projects[0].requiredVolunteers}
              targetAmount={projects[0].targetAmount}
              targetVolunteer={projects[0].targetVolunteer}
              totalRaised={projects[0].totalRaised}
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
      <p className="text-sm/loose text-justify my-5">
        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها
        و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و
        کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و
        آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه
        ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که
        تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی
        دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
      </p>
    </div>
  );
};

export default page;
