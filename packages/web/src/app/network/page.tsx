import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import NetworkSection_view from "@/components/views/network_co/NetworkSection_view";
import { needsNetworkSections } from "@/fakeData/fakeData";
import Link from "next/link";
import React from "react";

const Network: React.FC = ({}) => {
  return (
    <div>
      <header className="relative w-full py-15 bg-mgray/5 overflow-hidden">
        <div
          className="absolute left-0 inset-0 bg-no-repeat bg-center pointer-events-none"
          style={{
            backgroundImage: "url('/images/patternMain.webp')",
            backgroundSize: "700px",
            opacity: 0.5,
            backgroundPosition: "left",
          }}
        ></div>
        <div className="relative z-10 flex items-center justify-between w-9/10 md:w-8/10 mx-auto gap-10">
          <div>
            <h1 className="text-lg md:text-2xl font-extrabold mb-5">شبکه نیازسنجی</h1>
            <p className="font-bold text-xs md:text-base/loose">
              ایجاد فضایی برای شناسایی، اولویت‌بندی و اجرای نیازهای واقعی فراهم شده است. با مشارکت شما و حمایت
              دانشجویان و خیرین، قدم‌های مؤثری برمی‌داریم. لطفاً به ما بپیوندید و با نظراتتان، این مسیر را
              همموار کنید
            </p>
          </div>
          <OptimizedImage
            src="/icons/needsNetwork_blue.svg"
            alt="network icon"
            width={110}
            height={110}
            priority="up"
            className="hidden md:block"
          />
        </div>
      </header>
      <div className="w-9/10 md:w-8/10 mx-auto my-10">
        {needsNetworkSections.map((item, index) => (
          <div key={index}>
            <NetworkSection_view item={item} />
          </div>
        ))}
        <div className="w-full flex justify-between items-center">
          <div>
            <h1 className="flex items-center gap-2 font-extrabold">
              <span className="w-5 h-5 rounded-sm bg-morange block"></span>
              شبکۀ نیازسنجی
            </h1>
            <h2 className="mt-5 text-xs/relaxed md:text-base/relaxed">
              آیا به مسئلۀ تازه‌ای برخورده‌اید؟ آن را با ما در میان بگذارید. پس از فرایند بررسی و تأیید، با
              حمایت جمعی به مرحلۀ اجرا خواهد رسید
            </h2>
          </div>
          <OptimizedImage
            src="/icons/needsNetwork_blue.svg"
            alt="network icon"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <form className="relative w-full mt-3">
          <textarea
            className="w-full h-40 min-h-40 p-5 rounded-md bg-mgray focus:outline-mblue/15"
            placeholder="یک نیاز جدید معرفی کن..."
          />
          <SmartButton type="submit" variant="morange" size="sm" className="absolute bottom-0 left-0 m-5">
            ارسال
          </SmartButton>
        </form>
      </div>
    </div>
  );
};

export default Network;
