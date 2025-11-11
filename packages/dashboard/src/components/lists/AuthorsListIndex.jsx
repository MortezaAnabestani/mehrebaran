import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAuthors } from "../../features/authorsSlice";
import { deleteAuthor } from "../../features/authorsSlice";
import ConfirmDelete from "../createContent/ConfirmDelete";
import UTMLinkGeneratorForCards from "./UTMLinkGeneratorForCards";
import useFilters from "../../hooks/usePaginationFilters";
import Pagination from "./Pagination";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const AuthorsListIndex = () => {
  const dispatch = useDispatch();
  const { authors, loading, error } = useSelector((state) => state.authors);
  const [selectedThing, setSelectedThing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { filters, handleSearchChange, handleLimitChange, goToNextPage, goToPrevPage } = useFilters({
    limit: 10,
  });

  const totalPages = authors?.totalPages || 1;
  const currentPage = filters.page;
  const total = authors?.total || 0;

  // بارگذاری مقالات با فیلترهای مناسب
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
        await dispatch(fetchAuthors(params)).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری مقالات:", error);
      }
    };

    loadArticles();
  }, [dispatch, filters.page, filters.limit, filters.status, filters.searchQuery]);

  const openDeleteModal = (author) => {
    setSelectedThing(author);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedThing) {
      try {
        await dispatch(deleteAuthor(selectedThing.slug)).unwrap();
        dispatch(fetchAuthors());
      } catch (error) {
        console.error(" خطا در حذف نویسنده:", error);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="بخشی از نام نویسنده راجستجو کنید"
          value={filters.searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 my-4 text-sm py-2 rounded-md border border-red-200 focus:border-red-300 focus:outline-none"
        />
      </div>
      <div className={` ${isModalOpen && "blur-xs"}`}>
        <div className="mt-3">
          {loading && (
            <p className="text-center text-sm mb-3 animate-pulse text-gray-500">
              درحال بارگذاری اطلاعات نویسندگان...
            </p>
          )}
          {error && (
            <p className="text-center text-red-600 text-xs font-semibold ">مشکلی پیش آمده است: {error}</p>
          )}
        </div>
        {!authors?.authors?.length > 0 ? (
          <div className="mt-5 p-4">
            <p className="font-bold">هنوز نویسنده‌ای ثبت نشده است</p>
            <p className="mt-2">{`از این مسیر برای ثبت نویسنده اقدام کنید: نویسندگان ← اضافه‌کردن نویسنده `}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto hidden lg:block mt-6 h-fit">
              {authors?.authors?.map((author) => {
                return (
                  <div key={author._id} className="mb-6 border border-gray-100">
                    <table className=" w-full table-auto shadow-lg rounded-xs overflow-hidden">
                      <thead className="bg-gray-100 text-gray-700 text-sm font-semibold border border-gray-300 border-b-0">
                        <tr className="w-full">
                          <th className="py-4 px-6 text-xs text-center w-[15%]">نام</th>
                          <th className="py-4 px-6 text-xs text-center w-[15%]">مشخصات</th>
                          <th className="py-4 px-6 text-xs text-center w-[65%]">دربارۀ نویسنده</th>
                          <th className="py-4 px-6 text-xs text-center w-[5%]">اقدام</th>
                        </tr>
                      </thead>
                      <tbody key={author._id} className="text-gray-600 text-sm ">
                        <tr className="bg-white min-h-50 w-[100%] border-b border-gray-200">
                          <td className="flex justify-center items-center h-50 mt-6 border-b-4 border-gray-700">
                            <div className="w-40 h-full flex flex-col justify-around items-center bg-linear-to-b from-gray-200 via-red-500 to-red-700 rounded-t-full ">
                              <Link rel="preconnect" prefetch={true} to={`edit/${author.slug}`}>
                                <img
                                  className="object-cover h-30 w-30 rounded-full border-2 m-2 p-0.5 border-white hover:scale-105 hover:p-2.5 duration-400 hover:animate-pulse cursor-pointer"
                                  src={
                                    author?.avatar
                                      ? `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${
                                          author.avatar
                                        }`
                                      : "/assets/images/dashboard/icons/male_user.svg"
                                  }
                                  alt={author.name}
                                />
                              </Link>
                              <p className="py-1 px-1 text-center text-md font-semibold w-full text-white">
                                {author.name}
                              </p>
                            </div>
                          </td>
                          <td className="h-full w-[15%]">
                            <p className="py-2 px-3 text-md w-full border-b border-gray-100 text-center">
                              {toPersianDigits(convertToPersianTime(author.birthday, "YYYY/MM/DD"))}
                            </p>
                            <p className="py-2 px-3 text-md w-full border-b border-gray-200 text-center">
                              <span className="text-gray-300 pl-1">نویسندۀ</span>
                              {author.favoriteTemplate === "poetic" ? "جستار" : "علمی-پژوهشی"}
                            </p>
                            <p className="py-2 px-3 text-center ltr text-md w-full border-b border-gray-300 ">
                              {author.email}
                            </p>
                            <p className="py-2 px-3 text-center ltr text-md w-full border-b border-gray-200">
                              {author.mobile}
                            </p>
                            <p className="py-2 px-3 text-center ltr text-md w-full ">{author.instagramId}</p>
                          </td>
                          <td className="py-2 px-3 text-sm text-justify leading-6 w-[65%]">
                            {author.bio.substring(0, 500) + "..."}
                          </td>
                          <td className="pr-3 w-[5%]">
                            <div className="flex flex-col gap-4 text-gray-500 pl-1">
                              <Link
                                rel="preconnect"
                                prefetch={true}
                                target="_blank"
                                to={`https://vaqayet.com/author/${author.slug}`}
                                className="relative group  hover:scale-110 duration-200"
                              >
                                <span className="absolute top-0 left-1/3 transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                                to={`edit/${author.slug}`}
                                className="relative group  hover:scale-110 duration-200"
                              >
                                <span className="absolute top-0 left-1/3 transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                                onClick={() => openDeleteModal(author)}
                                className="relative group hover:scale-110 duration-200"
                              >
                                <span className="absolute top-0 left-1/3 transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  حذف
                                </span>
                                <img
                                  className="w-5 h-4/5 mr-1"
                                  src="/assets/images/dashboard/icons/trash.svg"
                                  alt="delete icon"
                                />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <UTMLinkGeneratorForCards page="author" slug={author.slug} />
                  </div>
                );
              })}
            </div>
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {authors?.authors.map((author) => (
                <div key={author._id} className="bg-white shadow-md rounded-xs p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-start">
                    <span className="text-gray-600 w-full bg-red-50 p-2 text-sm font-semibold flex gap-1 items-center rounded-xs">
                      <img
                        src="/assets/images/dashboard/icons/username.svg"
                        className="h-5 w-5"
                        alt="username icon"
                      />
                      {author.name}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <img
                      className="w-full h-40 object-cover rounded-md"
                      src={
                        author?.avatar
                          ? `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${author?.avatar}`
                          : "/assets/images/dashboard/icons/profileIcon.svg"
                      }
                      alt={author.name}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm bg-gray-50 p-1 rounded-xs">{author.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm bg-gray-50 p-1 rounded-xs">{author.mobile}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm leading-7 text-justify bg-gray-50 p-1 rounded-xs">
                      {author?.favoriteTemplate === "poetic" ? "جستار" : "علمی‌-پژوهشی"}
                    </p>
                    <p className="text-gray-600 text-sm leading-7 text-justify ltr rounded-xs bg-gray-50 p-1">
                      {author.instagramId}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm leading-7 text-justify rounded-xs bg-gray-50 p-1">
                      {author.bio.substring(0, 300) + "..."}
                    </p>
                  </div>
                  <div className="flex justify-between gap-2">
                    <Link
                      rel="preconnect"
                      target="_blank"
                      to={`https://vaqayet.com/author/${author.slug}`}
                      className="flex-1 text-center text-sm text-white bg-gray-500 py-2 rounded-md hover:bg-gray-800"
                    >
                      دیدن
                    </Link>
                    <Link
                      rel="preconnect"
                      to={`edit/${author.slug}`}
                      className="flex-1 text-center text-sm text-black border border-gray-700 py-2 rounded-md hover:border-gray-800"
                    >
                      ویرایش
                    </Link>
                    <Link
                      rel="preconnect"
                      onClick={() => openDeleteModal(author)}
                      className="flex-1 text-center text-sm text-white bg-red-500 py-2 rounded-md hover:bg-red-600"
                    >
                      حذف
                    </Link>
                  </div>
                  <UTMLinkGeneratorForCards page="author" slug={author.slug} />
                </div>
              ))}
            </div>
          </>
        )}
        <Pagination
          filters={filters}
          handleLimitChange={handleLimitChange}
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          goToPrevPage={goToPrevPage}
          goToNextPage={() => goToNextPage(authors?.totalPages)}
        />
      </div>
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={`آیا از حذف نویسنده‌ای با نام "${selectedThing?.name}" مطمئن هستید؟`}
      />
    </div>
  );
};

export default AuthorsListIndex;
