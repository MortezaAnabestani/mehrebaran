import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteHonor, fetchHonors } from "../../features/honorsSlice";
import { Link } from "react-router-dom";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";
import UTMLinkGeneratorForCards from "../../components/lists/UTMLinkGeneratorForCards";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const Honors = () => {
  const { honors } = useSelector((state) => state.honors);
  const dispatch = useDispatch();
  const [selectedThing, setSelectedThing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openDeleteModal = (honor) => {
    setSelectedThing(honor);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedThing) {
      try {
        await dispatch(deleteHonor(selectedThing.slug)).unwrap();
        dispatch(fetchHonors());
      } catch (error) {
        console.error(" خطا در حذف افتخار:", error);
      }
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(fetchHonors());
  }, [dispatch]);

  return (
    <div className="w-full">
      <div className="bg-white rounded-md ">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 lg:text-xl text-sm font-medium">فهرست افتخارات</h2>
          <Link
            rel="preconnect"
            to="/dashboard/honors/create"
            className="px-3 py-[6px] text-xs lg:text-lg bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 animate-ease-in-out">اضافه‌کردن افتخار جدید</span>
          </Link>
        </div>
      </div>
      {!honors.length === 0 ? (
        <div className="mt-5 p-4">
          <p className="font-bold">هنوز افتخاری ثبت نشده است</p>
          <p className="mt-2">{`از این مسیر برای ثبت افتخار اقدام کنید: افتخارات ← ایجاد افتخار جدید `}</p>
        </div>
      ) : (
        <div className="flex justify-around items-center flex-wrap gap-2 mt-4">
          {honors?.map((honor, index) => (
            <div
              key={index}
              className="w-[100%] lg:w-[29%] flex flex-col items-center border-t-6 border-gray-600 shadow mb-4"
            >
              <div className="bg-linear-2 from-black via-gray-900 flex flex-col justify-around items-center to-gray-800 text-white w-[230px] h-[200px] border-4 border-t-0 border-b-0 border-amber-400 p-2 text-center rounded-b-4xl">
                <h1 className="text-xs font-semibold">{honor?.title}</h1>
                <h2 className="text-xs font-normal">{honor?.subTitle}</h2>
                <img
                  src="/assets/images/dashboard/icons/laurel_wreath.svg"
                  className="w-8 h-8"
                  alt="laurel_wreath"
                />
                <h3 className="text-xs ">{honor?.author?.name}</h3>
                <h4 className="text-xs ">{honor?.article?.title}</h4>
              </div>
              <div className="py-2 h-10 text-xs text-white bg-linear-2 from-red-950 via-red-600 z-10 to-red-400 px-2 rounded-b-3xl border-4 border-b-0 border-t-0 border-amber-400">
                {toPersianDigits(convertToPersianTime(honor?.honorDate, "YYYY/MM/DD"))}
              </div>
              <div className="relative">
                <Link rel="preconnect" prefetch={true} to={`edit/${honor.slug}`}>
                  <span className="star1 absolute top-0 right-0 bg-linear-2 from-amber-500 via-amber-300 to-amber-100"></span>
                  <img
                    className="star shadow shadow-black hover:animate-pulse cursor-pointer opacity-85"
                    src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${honor.coverImage}`}
                    alt={`${honor?.title} در ${honor?.subTitle}. برندۀ این جشنواره ${honor?.author?.name} برای مقاله  ${honor?.article?.title}`}
                  />
                </Link>
              </div>
              <div className="gap-5 text-gray-500 py-2 w-full flex justify-around items-center bg-gray-200">
                <Link
                  rel="preconnect"
                  prefetch={true}
                                                target="_blank"
                  to={`https://vaqayet.com/honor/${honor.slug}`}
                  className="relative group  hover:scale-110 duration-200"
                >
                  <span className="absolute top-[-17px] left-[11px] transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    دیدن
                  </span>
                  <img
                    loading="lazy"
                    className="w-6 h-5"
                    src="/assets/images/dashboard/icons/eye.svg"
                    alt="eye icon"
                  />
                </Link>
                <Link
                  rel="preconnect"
                  prefetch={true}
                  to={`edit/${honor.slug}`}
                  className="relative group hover:scale-110 duration-200"
                >
                  <span className="absolute top-[-17px] left-[11px] transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    ویرایش
                  </span>
                  <img
                    loading="lazy"
                    className="w-6 h-5"
                    src="/assets/images/dashboard/icons/replace.svg"
                    alt="edit icon"
                  />
                </Link>
                <Link
                  rel="preconnect"
                  onClick={() => openDeleteModal(honor)}
                  className="relative group hover:scale-110 duration-200"
                >
                  <span className="absolute top-[-17px] left-[11px] transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    حذف
                  </span>
                  <img
                    className="w-5 h-4/5 mr-1"
                    src="/assets/images/dashboard/icons/trash.svg"
                    alt="delete icon"
                  />
                </Link>
              </div>
              <UTMLinkGeneratorForCards page="honor" slug={honor.slug} />
            </div>
          ))}
        </div>
      )}
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={`آیا از حذف افتخار "${selectedThing?.title}" مطمئن هستید؟`}
      />
    </div>
  );
};

export default Honors;
