"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import OptimizedImage from "@/components/ui/OptimizedImage";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const PrivacyContent: React.FC = () => {
  const headerRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);

  const headerInView = useInView(headerRef, { once: true });
  const section1InView = useInView(section1Ref, { once: true, margin: "-100px" });
  const section2InView = useInView(section2Ref, { once: true, margin: "-100px" });
  const section3InView = useInView(section3Ref, { once: true, margin: "-100px" });
  const section4InView = useInView(section4Ref, { once: true, margin: "-100px" });

  return (
    <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <section ref={headerRef} className="bg-gradient-to-r from-mblue/60 to-mblue py-20">
        <div className="w-9/10 md:w-8/10 mx-auto">
          <motion.div
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">قوانین و مقررات</h1>
            <p className="text-xl text-blue-100">ارسال درخواست کمک به کانون مهرباران</p>
            <div className="w-20 h-1 bg-white mx-auto rounded-full mt-6"></div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-9/10 md:w-7/10 mx-auto py-12 md:py-16">
        {/* مقدمه */}
        <motion.section
          ref={section1Ref}
          initial="hidden"
          animate={section1InView ? "visible" : "hidden"}
          variants={fadeIn}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <OptimizedImage src="/icons/rules_book.svg" alt="آیکون کتابچه قوانین" width={35} height={35} />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">درباره این قوانین</h2>
                <p className="text-gray-700 leading-relaxed">
                  کانون مهرباران با هدف کمک به افراد نیازمند و ایجاد پلی میان خیرین و نیازمندان، امکان ارسال
                  درخواست کمک را فراهم کرده است. لطفاً پیش از ارسال درخواست، این قوانین و مقررات را با دقت
                  مطالعه فرمایید.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* شرایط ارسال درخواست */}
        <motion.section
          ref={section2Ref}
          initial="hidden"
          animate={section2InView ? "visible" : "hidden"}
          variants={fadeIn}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <OptimizedImage src="/icons/requirement.svg" alt="آیکون شرایط و نیازمندی‌ها" width={35} height={35} />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">شرایط ارسال درخواست</h2>
            </div>

            <div className="space-y-6 mr-12">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg mt-1">•</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">صحت اطلاعات</h3>
                  <p className="text-gray-700 leading-relaxed">
                    تمامی اطلاعات ارسالی باید کاملاً صحیح و واقعی باشد. ارسال اطلاعات نادرست یا گمراه‌کننده
                    منجر به رد درخواست و احتمال مسدود شدن امکان ارسال درخواست‌های آینده خواهد شد.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg mt-1">•</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">اطلاعات تماس معتبر</h3>
                  <p className="text-gray-700 leading-relaxed">
                    لطفاً شماره تماس و ایمیل معتبر خود را وارد کنید. تیم ما برای بررسی درخواست و هماهنگی‌های
                    لازم با شما تماس خواهد گرفت.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg mt-1">•</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">توضیحات کامل</h3>
                  <p className="text-gray-700 leading-relaxed">
                    درخواست خود را با جزئیات کامل و واضح توضیح دهید. ارائه اطلاعات دقیق‌تر به بررسی سریع‌تر
                    درخواست شما کمک می‌کند.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg mt-1">•</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">مستندات معتبر</h3>
                  <p className="text-gray-700 leading-relaxed">
                    در صورت امکان، تصاویر یا مدارک مرتبط با درخواست خود را پیوست کنید. این مستندات به
                    اعتبارسنجی درخواست شما کمک می‌کند.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* فرآیند بررسی */}
        <motion.section
          ref={section3Ref}
          initial="hidden"
          animate={section3InView ? "visible" : "hidden"}
          variants={fadeIn}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <OptimizedImage src="/icons/pull_request.svg" alt="آیکون فرآیند بررسی درخواست" width={35} height={35} />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">فرآیند بررسی و پاسخگویی</h2>
            </div>

            <div className="space-y-6 mr-12">
              <div className="flex items-start gap-3">
                <span className="text-orange-600 font-bold text-lg mt-1">۱</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">دریافت و ثبت درخواست</h3>
                  <p className="text-gray-700 leading-relaxed">
                    پس از ارسال درخواست، یک پیام تأیید برای شما ارسال می‌شود و درخواست شما در سیستم ثبت خواهد
                    شد.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-orange-600 font-bold text-lg mt-1">۲</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">بررسی اولیه</h3>
                  <p className="text-gray-700 leading-relaxed">
                    تیم ما در کمترین زمان ممکن (معمولاً ۲ تا ۵ روز کاری) درخواست شما را بررسی و با شما تماس
                    خواهد گرفت.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-orange-600 font-bold text-lg mt-1">۳</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">ارزیابی و تأیید</h3>
                  <p className="text-gray-700 leading-relaxed">
                    درخواست‌های تأیید شده به خیرین و داوطلبان معرفی می‌شوند و فرآیند کمک‌رسانی آغاز خواهد شد.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-orange-600 font-bold text-lg mt-1">۴</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">پیگیری و گزارش</h3>
                  <p className="text-gray-700 leading-relaxed">
                    ما در تمام مراحل با شما در ارتباط خواهیم بود و از روند کمک‌رسانی گزارش خواهیم داد.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* حریم خصوصی و امنیت اطلاعات */}
        <motion.section
          ref={section4Ref}
          initial="hidden"
          animate={section4InView ? "visible" : "hidden"}
          variants={fadeIn}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <OptimizedImage src="/icons/privacy.svg" alt="آیکون امنیت حریم خصوصی" width={35} height={35} />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">حریم خصوصی و امنیت</h2>
            </div>

            <div className="space-y-6 mr-12">
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-lg mt-1">•</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">حفظ اطلاعات شخصی</h3>
                  <p className="text-gray-700 leading-relaxed">
                    تمامی اطلاعات شخصی شما با رعایت کامل حریم خصوصی نگهداری می‌شود و تنها برای بررسی درخواست و
                    هماهنگی‌های لازم استفاده خواهد شد.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-lg mt-1">•</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">عدم انتشار عمومی</h3>
                  <p className="text-gray-700 leading-relaxed">
                    اطلاعات تماس و جزئیات شخصی شما به صورت عمومی منتشر نخواهد شد و تنها با افراد مورد اعتماد و
                    خیرین تأیید شده به اشتراک گذاشته می‌شود.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-lg mt-1">•</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">کنترل اطلاعات</h3>
                  <p className="text-gray-700 leading-relaxed">
                    شما می‌توانید در هر زمان درخواست حذف یا ویرایش اطلاعات خود را داشته باشید.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-lg mt-1">•</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">امنیت داده‌ها</h3>
                  <p className="text-gray-700 leading-relaxed">
                    ما از پروتکل‌های امنیتی پیشرفته برای حفاظت از اطلاعات شما استفاده می‌کنیم.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* نکات مهم */}
        <motion.div
          initial="hidden"
          animate={section4InView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border-r-4 border-orange-500"
        >
          <div className="flex items-start gap-4">
            <OptimizedImage src="/icons/brake_warning.svg" alt="آیکون هشدار و نکات مهم" width={35} height={35} />
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">نکات مهم</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">▪</span>
                  <span>
                    هر فرد فقط می‌تواند یک درخواست فعال داشته باشد تا فرصت برابر برای همه ایجاد شود.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">▪</span>
                  <span>درخواست‌هایی که به صورت تکراری یا با اطلاعات جعلی ارسال شوند، مسدود خواهند شد.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">▪</span>
                  <span>لطفاً صبور باشید و به تیم ما اجازه دهید درخواست شما را به دقت بررسی کند.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">▪</span>
                  <span>
                    کانون مهرباران حق دارد هر درخواستی را بدون ارائه دلیل رد کند یا برای ارائه مدارک بیشتر
                    درخواست دهد.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* تماس با ما */}
        <motion.div
          initial="hidden"
          animate={section4InView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center bg-blue-50 rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">سؤالی دارید؟</h3>
          <p className="text-gray-700 mb-6">
            اگر سؤال یا ابهامی دارید، می‌توانید با تیم پشتیبانی ما تماس بگیرید.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact-us"
              className="bg-mblue text-white px-8 py-3 rounded-lg font-medium hover:bg-mblue/80 transition-colors"
            >
              تماس با ما
            </Link>
            <Link
              href="/faqs"
              className="bg-white text-mblue px-8 py-3 rounded-lg font-medium border-2 border-mblue-300 hover:bg-blue-50 transition-colors"
            >
              سوالات متداول
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer Note */}
      <div className="bg-gray-100 py-8">
        <div className="w-9/10 md:w-7/10 mx-auto text-center">
          <p className="text-sm text-gray-600">
            آخرین بروزرسانی: دی ۱۴۰۳ • کانون مهرباران - سازمان دانشجویان جهاد دانشگاهی خراسان رضوی
          </p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyContent;
