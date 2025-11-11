import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteIssue, fetchIssues } from "../../features/issuesSlice";
import { Link } from "react-router-dom";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";
import UTMLinkGeneratorForCards from "../../components/lists/UTMLinkGeneratorForCards";
import useFilters from "../../hooks/usePaginationFilters";
import Pagination from "../../components/lists/Pagination";
import { convertToPersianTime } from "../../utils/convertTime";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";

const Issues = () => {
  const dispatch = useDispatch();
  const { issues } = useSelector((state) => state.issues);
  const [selectedThing, setSelectedThing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { filters, handleSearchChange, handleLimitChange, goToNextPage, goToPrevPage, handleStatusChange } =
    useFilters({
      limit: 10,
    });
  const totalPages = issues?.totalPages || 1;
  const currentPage = filters.page;
  const total = issues?.total || 0;
  useEffect(() => {
    const loadArticles = async () => {
      try {
        // ساخت پارامترهای فیلتر
        const params = {
          page: filters.page,
          limit: filters.limit,
        };

        // افزودن فیلترهای اضافی اگر وجود داشته باشند
        if (filters.status) params.status = filters.status;
        if (filters.searchQuery) params.name = filters.searchQuery;

        // ارسال درخواست با پارامترهای فیلتر
        await dispatch(fetchIssues(params)).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری مقالات:", error);
      }
    };

    loadArticles();
  }, [dispatch, filters.page, filters.limit, filters.status, filters.searchQuery]);

  const openDeleteModal = (issue) => {
    setSelectedThing(issue);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedThing) {
      try {
        await dispatch(deleteIssue(selectedThing._id)).unwrap();
        dispatch(fetchIssues());
      } catch (error) {
        console.error(" خطا در حذف شماره:", error);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className={`ml-3 ${isModalOpen && "blur-xs"}`}>
        <div className="bg-white rounded-md ">
          <div className="flex items-center justify-between p-4">
            <h2 className="flex gap-3 lg:text-xl text-sm font-medium">فهرست شماره‌های نشریه</h2>
            <Link
              rel="preconnect"
              to="/dashboard/issues/create"
              className="px-3 py-[6px] text-xs lg:text-lg bg-gray-600 rounded-md hover:bg-gray-700 text-white"
            >
              <span className="text-slate-50 w-1 animate-ease-in-out">اضافه‌کردن شماره جدید</span>
            </Link>
          </div>
        </div>
        <div className="flex my-4 items-center gap-4 mb-6">
          <select
            name="status"
            value={filters.status}
            onChange={handleStatusChange}
            className="w-43 lg:w-48 px-2 lg:px-4 py-2 text-sm rounded-md border border-red-200 focus:border-red-300 focus:outline-none"
          >
            <option value="">نوع محتوا</option>
            <option value="template">جستار</option>
            <option value="template">ویژه نامه</option>
          </select>
          <input
            type="text"
            placeholder="بخشی از عنوان را بنویسید"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 text-sm py-2 rounded-md border border-red-200 focus:border-red-300 focus:outline-none"
          />
        </div>
        {issues?.total === 0 ? (
          <div className="mt-5 p-4">
            <p className="font-bold">هنوز شماره‌ای ثبت نشده است</p>
            <p className="mt-2">{`از این مسیر برای ثبت شماره اقدام کنید: شمارۀ نشریه ← ایجاد شمارۀ جدید `}</p>
          </div>
        ) : (
          <div>
            <ul className="overflow-hidden hidden lg:block sm:rounded-md max-w-full lg:max-w-4xl mx-auto w-260">
              {issues.issues?.map((issue) => {
                return (
                  <li
                    key={issue._id}
                    className="border-gray-200 relative m-5 mt-7 mb-9 bg-white shadow-sm border rounded-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-[17%] h-50 my-3">
                        <Link rel="preconnect" prefetch={true} to={`edit/${issue._id}`}>
                          <img
                            className="w-full h-full mx-auto object-cover bg-gray-600 translate-x-4 duration-300 hover:translate-x-5 cursor-pointer shadow-xl border-2 border-red-200"
                            src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${
                              issue.coverImage
                            }`}
                            alt={issue.title}
                          />
                        </Link>
                      </div>
                      <div className="flex flex-col lg:flex-row justify-between items-center w-[83%]">
                        <div className="flex flex-col justify-around w-[25%] h-50 ">
                          <div>
                            <h1 className="text-xs font-medium text-gray-400">عنوان اصلی شماره:</h1>
                            <span className="text-gray-800 font-semibold text-sm">{issue.title}</span>
                          </div>
                          <div>
                            <h3 className="text-xs font-medium text-gray-400">عنوان فرعی شماره:</h3>
                            <span className="text-gray-800 font-normal  text-sm">{issue.subTitle}</span>
                          </div>
                          <p className="text-xs font-medium text-gray-400">
                            شماره نشریه:{" "}
                            <span className="text-red-600 text-sm">{toPersianDigits(issue.issueNumber)}</span>
                          </p>
                          <p className="text-xs font-medium text-gray-400">
                            تاریخ انتشار :
                            <span className="text-red-600 text-sm">
                              {toPersianDigits(convertToPersianTime(issue.releaseDate, "YYYY/MM"))}
                            </span>
                          </p>
                          <p className="text-xs font-medium text-gray-400">
                            قالب: <span className="text-red-600 text-sm">{issue.template.name}</span>
                          </p>
                        </div>
                        <div className="w-[65%]">
                          <p className="text-xs my-6 text-justify font-medium text-gray-400">
                            توضیحات شماره:
                            <span className="text-xs text-gray-900 leading-relaxed">{issue.description}</span>
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between w-[5%]">
                          <div className="flex flex-col gap-5 text-gray-500 pl-1">
                            <Link
                              rel="preconnect"
                              prefetch={true}
                              target="_blank"
                              to={`https://vaqayet.com/issue/${issue._id}`}
                              className="relative group  hover:scale-110 duration-200"
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
                              to={`edit/${issue._id}`}
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
                              onClick={() => openDeleteModal(issue)}
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
                    <div className="absolute top-[-15px] left-3 ltr w-full flex gap-2 items-center">
                      {issue.authors.map((author, index) => {
                        if (index <= 12) {
                          return (
                            <span key={author._id}>
                              <img
                                src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${
                                  author.avatar
                                }`}
                                alt={author.name}
                                className="h-8 w-8 rounded-full object-cover border border-gray-200 shadow-xs shadow-black hover:scale-110 duration-200"
                              />
                            </span>
                          );
                        }
                      })}
                    </div>
                    <UTMLinkGeneratorForCards page="issue" slug={issue._id} />
                  </li>
                );
              })}
            </ul>
            {/* Content List mobile sizes*/}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {issues.issues?.map((issue) => (
                <div key={issue._id} className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-3">
                  <div className="flex flex-col">
                    <img
                      className="w-full h-50 object-cover rounded-md"
                      src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${issue.coverImage}`}
                      alt={issue.title}
                    />
                  </div>
                  <div className="mr-2 flex flex-col justify-around h-40 p-2">
                    <h1 className="text-xs font-medium text-gray-400">
                      عنوان اصلی شماره:
                      <span className="text-gray-800 font-semibold mr-1 text-md">{issue.title}</span>
                    </h1>
                    <h3 className="text-xs font-medium text-gray-400">
                      عنوان فرعی شماره:
                      <span className="text-gray-800 font-normal mr-1 text-sm">{issue.subTitle}</span>
                    </h3>
                    <p className="text-xs font-medium text-gray-400">
                      شماره نشریه:{" "}
                      <span className="text-red-600 text-sm">{toPersianDigits(issue.issueNumber)}</span>
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      تاریخ انتشار :
                      <span className="text-red-600 text-sm">
                        {toPersianDigits(convertToPersianTime(issue.releaseDate, "YYYY/MM"))}
                      </span>
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      قالب: <span className="text-red-600 text-sm">{issue.template.name}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      توضیحات: <span className="text-sm">{issue.description}</span>
                    </p>
                  </div>
                  <div className="flex justify-between gap-2">
                    <Link
                      rel="preconnect"
                      target="_blank"
                      to={`https://vaqayet.com/issue/${issue._id}`}
                      className="flex-1 text-center text-sm text-white bg-gray-500 py-2 rounded-md hover:bg-gray-800"
                    >
                      دیدن
                    </Link>
                    <Link
                      rel="preconnect"
                      to={`edit/${issue._id}`}
                      className="flex-1 text-center text-sm text-black border border-gray-700 py-2 rounded-md hover:border-gray-800"
                    >
                      ویرایش
                    </Link>
                    <Link
                      rel="preconnect"
                      onClick={() => openDeleteModal(issue)}
                      className="flex-1 text-center text-sm text-white bg-red-500 py-2 rounded-md hover:bg-red-600"
                    >
                      حذف
                    </Link>
                  </div>
                  <UTMLinkGeneratorForCards page="issue" slug={issue._id} />
                </div>
              ))}
            </div>
            <Pagination
              filters={filters}
              handleLimitChange={handleLimitChange}
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              goToPrevPage={goToPrevPage}
              goToNextPage={() => goToNextPage(issues?.totalPages)}
            />
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

export default Issues;
