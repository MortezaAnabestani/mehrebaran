import { lazy, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisitor, deleteVisitor } from "../../features/visitorSlice";
const SourceStats = lazy(() => import("../../components/charts/SourceStats"));

import { exportToExcel } from "../../utils/exportStats";
import DashboardSkeleton from "../../components/DashboardSkeleton";

const CampChart = () => {
  const { visitor, loading } = useSelector((state) => state.visitor);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchVisitor());
  }, [dispatch]);

  if (visitor?.utmStats?.length > 0) {
    return (
      <div className="mt-8 hidden md:block" style={{ direction: "ltr" }}>
        {loading && <span>در حال دریافت نمودارها</span>}
        <Suspense fallback={<DashboardSkeleton />}>
          <SourceStats utmData={visitor?.utmStats} />
        </Suspense>

        <div className="-translate-y-10 w-full flex justify-between items-center">
          <div className="w-fit flex group gap-4">
            <button
              className="bg-black px-3 py-1.5 text-white text-sm rounded-md rounded-l-none cursor-pointer hover:bg-red-600 duration-200"
              onClick={() => dispatch(deleteVisitor())}
            >
              پایان کمپین (حذف آمارها)
            </button>
            <img
              className="w-6 group-hover:animate-ping"
              src="/assets/images/dashboard/icons/whistle.svg"
              alt="آیکون هشدار"
            />
          </div>
          <button
            className="bg-black px-3 py-1.5 text-white text-sm rounded-md rounded-r-none cursor-pointer hover:bg-green-700 duration-200"
            onClick={() => exportToExcel(visitor.utmStats, `آمار_کمپین_وقایع_اتفاقیه`)}
          >
            دانلود سند اکسل آمارها
          </button>
        </div>
      </div>
    );
  }

  return <p className="pl-2 text-xs text-red-500">ابتدا باید کمپینی را راه‌اندازی کنید</p>;
};

export default CampChart;
