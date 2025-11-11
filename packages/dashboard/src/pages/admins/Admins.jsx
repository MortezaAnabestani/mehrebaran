import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdmins } from "../../features/adminsSlice";
import { deleteAdmin } from "../../features/adminsSlice";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const Admins = () => {
  const dispatch = useDispatch();
  const { admins, loading, error } = useSelector((state) => state.admins);
  const [selectedThing, setSelectedThing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch, setIsModalOpen]);

  const openDeleteModal = (admin) => {
    setSelectedThing(admin);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedThing) {
      try {
        await dispatch(deleteAdmin(selectedThing._id)).unwrap();
        dispatch(fetchAdmins());
      } catch (error) {
        console.error(" خطا در حذف ادمین:", error);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Content List Here */}
      <div className={` ${isModalOpen && "blur-xs"}`}>
        <div className="mt-3">
          {loading && (
            <p className="text-center text-sm mb-3 animate-pulse text-gray-500">
              درحال بارگذاری اطلاعات مدیران تارنما...
            </p>
          )}
          {error && (
            <p className="text-center text-red-600 text-xs font-semibold ">مشکلی پیش آمده است: {error}</p>
          )}
        </div>
        <div className="overflow-x-auto hidden lg:block mt-6 h-fit">
          <table className="w-full table-auto shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr className="w-full">
                <th className="py-4 px-6 text-xs text-center w-[15%]">نام</th>
                <th className="py-4 px-6 text-xs text-center w-[15%]">مشخصات</th>
                <th className="py-4 px-6 text-xs text-center w-[65%]">سابقه فعالیت</th>
                <th className="py-4 px-6 text-xs text-center w-[5%]">اقدام</th>
              </tr>
            </thead>
            {admins.map((admin) => {
              return (
                <tbody key={admin._id} className="text-gray-600 text-sm">
                  <tr className="bg-white h-50 w-[100%] border-b border-gray-200">
                    <td className="flex justify-center items-center h-50 border-t-4 border-gray-700 mb-5">
                      <div className="w-40 h-full flex flex-col justify-around items-center bg-linear-to-b from-gray-900 via-gray-700 to-gray-600 ">
                        <Link rel="preconnect" prefetch={true} to={`edit/${admin._id}`}>
                          <img
                            className="object-cover h-30 w-30 rounded-full border-2 m-2 p-0.5 border-white hover:scale-105 hover:p-2.5 duration-400 hover:animate-pulse cursor-pointer"
                            src={
                              admin?.avatar
                                ? `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${admin.avatar}`
                                : "/assets/images/dashboard/icons/male_user.svg"
                            }
                            alt={admin.name}
                          />
                        </Link>
                        <p className="py-1 px-1 text-center text-md font-semibold w-full text-white">
                          {admin.name}
                        </p>
                      </div>
                    </td>
                    <td className="h-full w-[15%]">
                      <p className="py-2 px-3 text-md w-full border-b border-gray-100 text-center">
                        {toPersianDigits(convertToPersianTime(admin.createdAt, "YYYY/MM/DD"))}
                      </p>
                      <p className="py-2 px-3 text-md w-full border-b border-gray-200 text-center">
                        <span className="text-gray-300 pl-1">سطح دسترسی: </span>
                        <br />
                        {admin.role === "admin" ? "ادمین (دسترسی محدود)" : "مدیر (دسترسی نامحدود)"}
                      </p>
                      <p className="py-2 px-3 text-center ltr text-md w-full border-b border-gray-300 ">
                        {admin.email}
                      </p>
                      <p className="py-2 px-3 text-center ltr text-md w-full border-b border-gray-200">
                        {admin.username}
                      </p>
                    </td>
                    <td>
                      <div className="w-8/10 mx-auto text-xs/8">
                        {admin?.loginHistory.map((item, index) => {
                          if (index < 5) {
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between border-b border-gray-200"
                              >
                                <div>
                                  <span className="font-bold">آی پی: </span>
                                  {item?.ip}
                                </div>
                                <div>
                                  <span className="font-bold">زمان ورود به تارنما: </span>
                                  {toPersianDigits(
                                    convertToPersianTime(item?.timestamp, "YYYY/MM/DD، ساعت: HH:mm:ss")
                                  )}
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </td>
                    <td className="pr-3 w-[5%]">
                      <div className="flex flex-col gap-4 text-gray-500 pl-1">
                        <Link
                          rel="preconnect"
                          prefetch={true}
                          to={"#"}
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
                          to={`edit/${admin._id}`}
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
                          onClick={() => openDeleteModal(admin)}
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
              );
            })}
          </table>
        </div>
        {/* Content List username sizes*/}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {admins.map((admin) => (
            <div key={admin._id} className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center justify-start">
                <span className="text-gray-600 w-full bg-red-50 p-2 text-sm font-semibold flex gap-1 items-center rounded-xs">
                  <img
                    src="/assets/images/dashboard/icons/username.svg"
                    className="h-5 w-5"
                    alt="username icon"
                  />
                  {admin.name}
                </span>
              </div>
              <div className="flex flex-col">
                <img
                  className="w-full h-40 object-cover rounded-md"
                  src={
                    admin?.avatar
                      ? `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${admin?.avatar}`
                      : "/assets/images/dashboard/icons/profileIcon.svg"
                  }
                  alt={admin.name}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm bg-gray-50 p-1 rounded-xs">{admin.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm bg-gray-50 p-1 rounded-xs">{admin.username}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm leading-7 text-justify bg-gray-50 p-1 rounded-xs">
                  {admin?.role === "admin" ? "ادمین (دسترسی محدود)" : "مدیر (دسترسی نامحدود)"}
                </p>
                <p className="py-2 px-3 text-center ltr text-md w-full ">
                  <span>سابقۀ فعالیت: </span>
                  {admin?.loginHistory?.ip} || {admin?.loginHistory?.userAgent} ||{" "}
                  {admin?.loginHistory?.timestamp}
                </p>
              </div>
              <div className="flex justify-between gap-2">
                <Link
                  rel="preconnect"
                  to={"#"}
                  className="flex-1 text-center text-sm text-white bg-gray-500 py-2 rounded-md hover:bg-gray-800"
                >
                  دیدن
                </Link>
                <Link
                  rel="preconnect"
                  to={`edit/${admin._id}`}
                  className="flex-1 text-center text-sm text-black border border-gray-700 py-2 rounded-md hover:border-gray-800"
                >
                  ویرایش
                </Link>
                <Link
                  rel="preconnect"
                  onClick={() => openDeleteModal(admin)}
                  className="flex-1 text-center text-sm text-white bg-red-500 py-2 rounded-md hover:bg-red-600"
                >
                  حذف
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={`آیا از حذف ادمینی با نام "${selectedThing?.name}" مطمئن هستید؟`}
      />
    </div>
  );
};

export default Admins;
