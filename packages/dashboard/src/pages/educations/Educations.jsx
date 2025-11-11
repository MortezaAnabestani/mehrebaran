import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEducation, fetchEducations } from "../../features/educationsSlice";
import { Link } from "react-router-dom";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";
import UTMLinkGeneratorForCards from "../../components/lists/UTMLinkGeneratorForCards";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const Educations = () => {
  const { educations, loading, error } = useSelector((state) => state.educations);
  const [selectedThing, setSelectedThing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEducations());
  }, [dispatch]);

  const openDeleteModal = (education) => {
    setSelectedThing(education);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedThing) {
      try {
        await dispatch(deleteEducation(selectedThing.slug)).unwrap();
        dispatch(fetchEducations());
      } catch (error) {
        console.error(" خطا در حذف نویسنده:", error);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className={`ml-3 ${isModalOpen && "blur-xs"}`}>
        <div className="bg-white rounded-md ">
          <div className="flex items-center justify-between p-4">
            <h2 className="flex gap-3 lg:text-xl text-sm font-medium">فهرست محتواهای آموزشی</h2>
            <Link
              rel="preconnect"
              to="/dashboard/educations/create"
              className="px-3 py-[6px] text-xs lg:text-lg bg-gray-600 rounded-md hover:bg-gray-700 text-white"
            >
              <span className="text-slate-50 w-1 animate-ease-in-out">اضافه‌کردن آموزش جدید</span>
            </Link>
          </div>
        </div>
        {!selectedThing ? (
          <div className="mt-5 p-4">
            <p className="font-bold">هنوز آموزشی ثبت نشده است</p>
            <p className="mt-2">{`از این مسیر برای ثبت آموزش اقدام کنید: آموزش‌های تصویری ← ایجاد محتوای آموزشی جدید `}</p>
          </div>
        ) : (
          <div>
            <ul className="overflow-hidden hidden lg:block sm:rounded-md max-w-full lg:max-w-4xl mx-auto w-260">
              {educations?.map((education, index) => {
                return (
                  <li
                    key={index}
                    className="border-gray-200 relative m-5 mt-7 mb-9 bg-white shadow-sm border rounded-sm "
                  >
                    <div className="flex gap-3 items-center justify-between">
                      <div className="flex flex-col h-ful hover:translate-y-1 duration-300">
                        <Link
                          rel="preconnect"
                          prefetch={true}
                          to={`edit/${education?.slug}`}
                          className=" border-2 border-red-400"
                        >
                          <img
                            className="w-[450px] h-[200px] blur-[1px] mx-auto object-cover cursor-pointer"
                            src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${
                              education?.coverImage
                            }`}
                            alt={education?.title}
                          />
                          <img
                            src="/assets/images/dashboard/icons/play.svg"
                            alt="play icon svg"
                            className="w-16 h-16 absolute right-[140px] cursor-pointer shadow-gray-500 top-[25%] z-10"
                          />
                          <img
                            src="/assets/images/dashboard/icons/sphere.svg"
                            alt="sphere icon"
                            className="w-18 h-18 absolute right-[140px] cursor-pointer animate-spin shadow-gray-500 top-[24%]"
                          />
                        </Link>
                        <div className="flex flex-col justify-between p-3">
                          <div>
                            <h1 className="text-xs font-medium text-gray-400">عنوان آموزش:</h1>
                            <span className="text-gray-800 font-semibold text-sm">{education?.title}</span>
                          </div>

                          <p className="text-xs text-left font-medium text-gray-400">
                            تاریخ انتشار:
                            <span className="text-red-600 text-sm">
                              {toPersianDigits(convertToPersianTime(education?.createdAt, "YYYY/MM/DD"))}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row justify-between items-center w-[500px]">
                        <div className="w-[650px] mr-5 pt-4">
                          <div>
                            <h3 className="text-xs font-medium text-gray-400">جزئیات برجسته:</h3>
                            <span className="text-gray-800 font-normal  text-sm">{education?.details}</span>
                          </div>
                          <p className="text-xs my-6 text-justify font-medium text-gray-400">
                            توضیحات:
                            <span className="text-xs text-gray-900 leading-relaxed">
                              {education?.description?.substring(0, 300) + "..."}
                            </span>
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between mr-6 w-[100px]">
                          <div className="flex flex-col gap-5 text-gray-500 pl-1">
                            <Link
                              rel="preconnect"
                              target="_blank"
                              prefetch={true}
                              to={`https://vaqayet.com/education/${education.slug}`}
                              className="relative group hover:scale-110 duration-200"
                            >
                              <span className="absolute top-[-17px] left-[11px] transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                دیدن
                              </span>
                              <img
                                className="w-6 h-5"
                                src="/assets/images/dashboard/icons/eye.svg"
                                alt="eye icon"
                              />
                            </Link>
                            <Link
                              rel="preconnect"
                              to={`edit/${education.slug}`}
                              className="relative group hover:scale-110 duration-200"
                            >
                              <span className="absolute top-[-17px] left-[11px] transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                ویرایش
                              </span>
                              <img
                                className="w-6 h-5"
                                src="/assets/images/dashboard/icons/replace.svg"
                                alt="edit icon"
                              />
                            </Link>
                            <Link
                              rel="preconnect"
                              onClick={() => openDeleteModal(education)}
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
                        </div>
                      </div>
                    </div>
                    <UTMLinkGeneratorForCards page="education" slug={education.slug} />
                  </li>
                );
              })}
            </ul>
            {/* Content List mobile sizes*/}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {educations?.map((education, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-3">
                  <div className="flex flex-col">
                    <img
                      className="w-full h-50 object-cover rounded-md"
                      src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${
                        education?.coverImage
                      }`}
                      alt={education?.title}
                    />
                  </div>
                  <div className="mr-2 flex flex-col justify-around h-40 p-2">
                    <h1 className="text-xs font-medium text-gray-400">
                      عنوان اصلی شماره:
                      <span className="text-gray-800 font-semibold mr-1 text-md">{education?.title}</span>
                    </h1>
                    <h3 className="text-xs font-medium text-gray-400">
                      جزئیات برجسته
                      <span className="text-gray-800 font-normal mr-1 text-sm">{education?.details}</span>
                    </h3>
                    <p className="text-xs font-medium text-gray-400">
                      درجۀ اولویت <span className="text-red-600 text-sm">{education?.order}</span>
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      تاریخ انتشار:
                      <span className="text-red-600 text-sm">
                        {toPersianDigits(convertToPersianTime(education?.createdAt, "YYYY/MM/DD"))}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      توضیحات:{" "}
                      <span className="text-sm">{education?.description?.substring(0, 250) + " ..."}</span>
                    </p>
                  </div>
                  <div className="flex justify-between gap-2">
                    <Link
                      rel="preconnect"
                      target="_blank"
                      to={`https://vaqayet.com/education/${education.slug}`}
                      className="flex-1 text-center text-sm text-white bg-gray-500 py-2 rounded-md hover:bg-gray-800"
                    >
                      دیدن
                    </Link>
                    <Link
                      rel="preconnect"
                      to={`edit/${education.slug}`}
                      className="flex-1 text-center text-sm text-black border border-gray-700 py-2 rounded-md hover:border-gray-800"
                    >
                      ویرایش
                    </Link>
                    <Link
                      rel="preconnect"
                      onClick={() => openDeleteModal(education)}
                      className="flex-1 text-center text-sm text-white bg-red-500 py-2 rounded-md hover:bg-red-600"
                    >
                      حذف
                    </Link>
                  </div>
                  <UTMLinkGeneratorForCards page="education" slug={education.slug} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={`آیا از حذف شماره "${selectedThing?.title}" مطمئن هستید؟`}
      />
    </div>
  );
};

export default Educations;
