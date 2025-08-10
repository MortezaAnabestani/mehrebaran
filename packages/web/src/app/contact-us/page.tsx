import OptimizedImage from "@/components/ui/OptimizedImage";
import React from "react";

const ContactUs: React.FC = ({}) => {
  return (
    <div className="flex flex-col h-fit justify-between w-9/10 md:w-6/10 mx-auto  gap-3 py-20 font-bold">
      <h1 className="w-full text-right border-b-2 border-mblue pb-2 text-2xl">تماس با ما</h1>
      <OptimizedImage width={30} height={30} src="/icons/location.svg" alt="contact-us icon" />
      <p>
        نشانی: مشهد، میدان آزادی، پردیس دانشگاه فردوسی، سازمان مرکزی جهاد دانشگاهی خراسان رضوی، ساختمان معاونت
        فرهنگی، <span className="text-mblue">دفتر سازمان دانشجویان جهاد دانشگاهی</span>
      </p>
      <p>تلفن: 05131997333</p>
      <p>کد پستی: 977949367</p>
      <p>ایسنتاگرام: sdjdm.ir</p>
    </div>
  );
};

export default ContactUs;
