"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import NeedCard from "@/components/network/NeedCard";
import CreateNeedModal from "@/components/network/CreateNeedModal";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { needService, GetNeedsParams } from "@/services/need.service";
import { INeed } from "common-types";

const NetworkPage: React.FC = () => {
  const router = useRouter();

  // State
  const [needs, setNeeds] = useState<INeed[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<"active" | "completed" | "">("");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "progress" | "trending">("newest");

  // دریافت لیست نیازها
  // دریافت لیست نیازها بر اساس نوع فید
  const fetchNeeds = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setNeeds([]); // لیست را خالی می‌کنیم تا در صورت خطا، داده‌های قدیمی نمایش داده نشود

      // پارامترهای مشترک برای همه درخواست‌ها
      const baseParams: GetNeedsParams = {
        limit: 20,
        // page: currentPage, // اگر صفحه‌بندی دارید
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        status: selectedStatus || undefined,
      };

      let response;

      // بر اساس نوع مرتب‌سازی، اندپوینت مناسب را فراخوانی می‌کنیم
      switch (sortBy) {
        case "trending":
          response = await needService.getTrendingNeeds(baseParams);
          break;
        case "popular":
          response = await needService.getPopularNeeds(baseParams);
          break;
        case "newest":
        default: // حالت پیش‌فرض جدیدترین است
          response = await needService.getNeeds(baseParams);
          break;
      }

      setNeeds(response.data);
    } catch (err: any) {
      console.error("Failed to fetch needs:", err);
      setError(err.message || "خطا در دریافت نیازها");
    } finally {
      setIsLoading(false);
    }
  };

  // دریافت نیازها در بار اول
  useEffect(() => {
    fetchNeeds();
  }, [selectedCategory, selectedStatus, sortBy]);

  // جستجو با تأخیر (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchNeeds();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ارسال نیاز جدید
  const handleSubmitNewNeed = async (formData: any) => {
    try {
      await needService.createNeed({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        urgencyLevel: formData.urgencyLevel,
        estimatedDuration: formData.estimatedDuration,
        requiredSkills: formData.requiredSkills,
        tags: formData.tags,
        location: formData.location.city ? {
          address: formData.location.address,
          city: formData.location.city,
          province: formData.location.province,
          coordinates: formData.location.coordinates,
        } : undefined,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      });

      fetchNeeds(); // رفرش لیست
      alert("نیاز شما با موفقیت ثبت شد و پس از بررسی منتشر خواهد شد.");
    } catch (err: any) {
      console.error("Failed to create need:", err);
      alert(err.message || "خطا در ثبت نیاز");
      throw err;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-mgray/5">
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
                ایجاد فضایی برای شناسایی، اولویت‌بندی و اجرای نیازهای واقعی فراهم شده است. با مشارکت شما و
                حمایت دانشجویان و خیرین، قدم‌های مؤثری برمی‌داریم. لطفاً به ما بپیوندید و با نظراتتان، این
                مسیر را همموار کنید
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

        {/* Main Content */}
        <div className="w-9/10 md:w-8/10 mx-auto my-10">
          {/* Filters Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            {/* Search */}
            <div className="w-full md:w-1/3">
              <input
                type="text"
                placeholder="جستجو در نیازها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-mgray/30 focus:outline-mblue/50"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-4 py-2 rounded-md border border-mgray/30 focus:outline-mblue/50 bg-white"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="approved">تایید شده</option>
                <option value="in_progress">در حال انجام</option>
                <option value="completed">تکمیل شده</option>
                <option value="pending">در انتظار تایید</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-md border border-mgray/30 focus:outline-mblue/50 bg-white"
              >
                <option value="">همه دسته‌ها</option>
                <option value="آموزش">آموزش</option>
                <option value="سلامت و درمان">سلامت و درمان</option>
                <option value="مسکن">مسکن</option>
                <option value="غذا و تغذیه">غذا و تغذیه</option>
                <option value="اشتغال و کسب‌وکار">اشتغال و کسب‌وکار</option>
                <option value="محیط زیست">محیط زیست</option>
                <option value="اضطراری">اضطراری</option>
                <option value="فرهنگ و هنر">فرهنگ و هنر</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-md border border-mgray/30 focus:outline-mblue/50 bg-white"
              >
                <option value="newest">جدیدترین</option>
                <option value="popular">محبوب‌ترین</option>
                <option value="trending">پرطرفدار</option>
                <option value="progress">پیشرفت</option>
              </select>
            </div>
          </div>

          {/* Needs Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mblue mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <SmartButton variant="mblue" size="sm" onClick={fetchNeeds}>
                  تلاش مجدد
                </SmartButton>
              </div>
            </div>
          ) : needs.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-gray-600 mb-4">نیازی یافت نشد.</p>
                <SmartButton variant="mblue" size="sm" onClick={() => setShowCreateModal(true)}>
                  اولین نیاز را ثبت کنید
                </SmartButton>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 mb-10">
              {needs.map((need) => (
                <NeedCard key={need._id} need={need} variant="feed" onUpdate={fetchNeeds} />
              ))}
            </div>
          )}

          {/* Create Need Section */}
          <div className="w-full mt-16 mb-5">
            <div className="bg-gradient-to-r from-mblue/10 to-morange/10 rounded-2xl p-8 border-2 border-dashed border-mblue/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h1 className="flex items-center gap-2 font-extrabold text-2xl mb-3">
                    <span className="w-6 h-6 rounded-sm bg-morange block"></span>
                    نیاز جدیدی دارید؟
                  </h1>
                  <h2 className="text-sm md:text-base text-gray-700 leading-relaxed">
                    آیا به مسئلۀ تازه‌ای برخورده‌اید؟ آن را با ما در میان بگذارید. پس از فرایند بررسی و تأیید، با
                    حمایت جمعی به مرحلۀ اجرا خواهد رسید
                  </h2>
                  <SmartButton
                    variant="morange"
                    size="lg"
                    onClick={() => setShowCreateModal(true)}
                    className="mt-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    ✨ ثبت نیاز جدید
                  </SmartButton>
                </div>
                <OptimizedImage
                  src="/icons/needsNetwork_blue.svg"
                  alt="network icon"
                  width={120}
                  height={120}
                  className="hidden md:block opacity-70"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* Create Need Modal */}
        <CreateNeedModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleSubmitNewNeed}
        />
      </div>
    </ProtectedRoute>
  );
};

export default NetworkPage;
