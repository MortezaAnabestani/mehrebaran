import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Search from "../components/lists/Search";

const Sidebar = ({ sidebarOpen, me }) => {
  const [menuToggle, setMenuToggle] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/api/admins/logout`,
        {
          withCredentials: true,
        }
      );

      return response.data && navigate("/");
    } catch (error) {
      console.error("خطا در خروج:", error);
      throw error;
    }
  };

  const toggleHandler = (id) => {
    setMenuToggle((prev) => (prev === id ? null : id));
  };
  return (
    <aside
      id="sidebar"
      className={`${
        sidebarOpen ? "block" : "hidden"
      } lg:h-full flex lg:flex flex-col w-full lg:w-[280px] lg:min-w-[280px] transition-width duration-75`}
      aria-label="Sidebar"
    >
      <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
        <div className="h-full flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 bg-white divide-y space-y-1">
            <ul className="space-y-2 pb-2">
              <li>
                <div className="md:hidden">
                  <Search />
                </div>
              </li>
              <li className={`${pathname === "/dashboard" ? "bg-gray-100" : ""}`}>
                <Link
                  rel="preconnect"
                  to="/dashboard"
                  className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group"
                >
                  <img
                    src="/assets/images/dashboard/icons/panelIcon.svg"
                    alt="table Panel"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3">میز کار</span>
                </Link>
              </li>
              <div>
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/pubnum.svg"
                    alt="writers"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> شمارۀ نشریه</span>
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 4 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(4)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 4 && (
                  <div className="flex flex-col w-full justify-start items-start bg-gray-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/issues/create"}
                      className={`${pathname === "/dashboard/issues/create" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">ایجاد شمارۀ جدید</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/issues"}
                      className={`${pathname === "/dashboard/issues" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">فهرست شماره‌ها</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>
              <Link
                rel="preconnect"
                to={"/dashboard/sections"}
                className={`${pathname === "/dashboard/sections" ? "bg-gray-100" : ""} block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/category.svg"
                    alt="category"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> دسته‌بندی محتوایی</span>
                </li>
              </Link>
              <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group">
                <img
                  src="/assets/images/dashboard/icons/paperIcon.svg "
                  alt="content"
                  className="w-6 h-6 ml-2"
                />
                <span className="ml-3 flex-1 whitespace-nowrap">مقاله</span>
                <img
                  src="/assets/images/dashboard/icons/downArrow.svg"
                  className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                  style={menuToggle === 2 ? { rotate: "90deg" } : { rotate: "0deg" }}
                  onClick={() => toggleHandler(2)}
                  alt="down arrow icon 2"
                />
              </li>
              {menuToggle === 2 && (
                <div className="flex flex-col w-full justify-start items-start bg-gray-50">
                  <Link
                    rel="preconnect"
                    to={"/dashboard/articles/create"}
                    className={`${pathname === "/dashboard/articles/create" ? "bg-gray-100" : ""} w-full`}
                  >
                    <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                      <span className="mr-5 text-red-400">*</span>
                      <span className="d-block mr-1 flex-1 whitespace-nowrap">ایجاد مقالۀ جدید</span>
                    </li>
                  </Link>
                  <Link
                    rel="preconnect"
                    to={"/dashboard/articles"}
                    className={`${pathname === "/dashboard/articles" ? "bg-gray-100" : ""} w-full`}
                  >
                    <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                      <span className="mr-5 text-red-400">*</span>
                      <span className="d-block mr-1 flex-1 whitespace-nowrap">فهرست مقاله‌ها</span>
                    </li>
                  </Link>
                </div>
              )}
              <div>
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/video_playlist.svg"
                    alt="writers"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> آموزش‌های تصویری</span>
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 6 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(6)}
                    alt="down arrow icon 2"
                  />
                </li>
                {menuToggle === 6 && (
                  <div className="flex flex-col w-full justify-start items-start bg-gray-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/educations/create"}
                      className={`${pathname === "/dashboard/educations/create" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">
                          ایجاد محتوای آموزشی جدید
                        </span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/educations"}
                      className={`${pathname === "/dashboard/educations" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">فهرست محتواهای آموزشی</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>
              <div>
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/stage.svg"
                    alt="writers"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> رویدادها</span>
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 7 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(7)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 7 && (
                  <div className="flex flex-col w-full justify-start items-start bg-gray-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/events/create"}
                      className={`${pathname === "/dashboard/events/create" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">ایجاد رویداد جدید</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/events"}
                      className={`${pathname === "/dashboard/events" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">فهرست رویدادها</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>
              <div>
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/photo_gallery.svg"
                    alt="photo_gallery"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> گالری</span>
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 9 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(9)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 9 && (
                  <div className="flex flex-col w-full justify-start items-start bg-gray-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/galleries/create"}
                      className={`${pathname === "/dashboard/galleries/create" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">ایجاد گالری جدید</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/galleries"}
                      className={`${pathname === "/dashboard/galleries" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">فهرست گالری‌ها</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>
              <div>
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    loading="lazy"
                    src="/assets/images/dashboard/icons/medal.svg"
                    alt="medal"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap">افتخارات</span>
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 11 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(11)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 11 && (
                  <div className="flex flex-col w-full justify-start items-start bg-gray-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/honors/create"}
                      className={`${pathname === "/dashboard/honors/create" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">ایجاد افتخار جدید</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/honors"}
                      className={`${pathname === "/dashboard/honors" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">فهرست افتخارات</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>
              <Link
                rel="preconnect"
                to={"/dashboard/banner"}
                className={`${pathname === "/dashboard/banner" ? "bg-gray-100" : ""} block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/billboard.svg"
                    alt="billboard"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap">بنر اطلاع‌رسانی</span>
                </li>
              </Link>
              <Link
                rel="preconnect"
                to={"/dashboard/tags"}
                className={`${pathname === "/dashboard/tags" ? "bg-gray-100" : ""} block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    loading="lazy"
                    src="/assets/images/dashboard/icons/tags.svg"
                    alt="tags"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> برچسب‌ها</span>
                </li>
              </Link>
              <div>
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/writers.svg"
                    alt="writers"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> نویسندگان</span>
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 5 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(5)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 5 && (
                  <div className="flex flex-col w-full justify-start items-start bg-gray-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/authors/create"}
                      className={`${pathname === "/dashboard/authors/create" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">اضافه‌کردن نویسنده</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/authors"}
                      className={`${pathname === "/dashboard/authors" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">مجمع نویسندگان</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>
              <Link
                rel="preconnect"
                to={"/dashboard/comments"}
                onClick={(e) => me?.role === "admin" && e.preventDefault()}
                className={`${pathname === "/dashboard/comments" ? "bg-gray-100" : ""} block ${
                  me?.role === "admin" && "disabled"
                }`}
              >
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group cursor-pointer">
                  <img
                    src="/assets/images/dashboard/icons/messagesIcon.svg"
                    alt="comments"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> نظرات</span>
                </li>
              </Link>
              <Link
                rel="preconnect"
                to={"/dashboard/users"}
                onClick={(e) => me?.role === "admin" && e.preventDefault()}
                className={`${pathname === "/dashboard/users" ? "bg-gray-100" : ""} ${
                  me?.role === "admin" && "disabled"
                } block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    loading="lazy"
                    src="/assets/images/dashboard/icons/users.svg"
                    alt="users"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> مخاطبان</span>
                </li>
              </Link>
              <Link
                rel="preconnect"
                to={"/dashboard/applications"}
                onClick={(e) => me?.role === "admin" && e.preventDefault()}
                className={`${pathname === "/dashboard/applications" ? "bg-gray-100" : ""} ${
                  me?.role === "admin" && "disabled"
                } block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    loading="lazy"
                    src="/assets/images/dashboard/icons/cv.svg"
                    alt="users"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> درخواست‌های همکاری</span>
                </li>
              </Link>
              <div>
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    loading="lazy"
                    src="/assets/images/dashboard/icons/faq.svg"
                    alt="faq"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> سوالات پرتکرار</span>
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 8 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(8)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 8 && (
                  <div className="flex flex-col w-full justify-start items-start bg-gray-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/faqs/create"}
                      className={`${pathname === "/dashboard/faqs/create" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">ایجاد پرسش و پاسخ جدید</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/faqs"}
                      className={`${pathname === "/dashboard/faqs" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">فهرست سوالات پرتکرار</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>
              <div className={`${me?.role === "admin" && "disabled"}`}>
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group">
                  <img
                    src="/assets/images/dashboard/icons/editors.svg"
                    alt="admins"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> مدیران سایت</span>
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 3 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(3)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 3 && (
                  <div className="flex flex-col w-full justify-start items-start bg-gray-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/admins/create"}
                      className={`${pathname === "/dashboard/admins/create" ? "bg-gray-100" : ""} w-full`}
                      onClick={(e) => me?.role === "admin" && e.preventDefault()}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">اضافه‌کردن مدیر</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/admins"}
                      className={`${pathname === "/dashboard/admins" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">فهرست مدیران</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>
              <div className={`${me?.role === "admin" && "disabled"} hidden md:block`}>
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group">
                  <img src="/assets/images/dashboard/icons/chart.svg" alt="admins" className="w-6 h-6 ml-2" />
                  <span className="ml-3 flex-1 whitespace-nowrap">نمودارها</span>
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 10 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(10)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 10 && (
                  <div className="flex flex-col w-full justify-start items-start bg-gray-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/chart/view"}
                      className={`${pathname === "/dashboard/chart/view" ? "bg-gray-100" : ""} w-full`}
                      onClick={(e) => me?.role === "admin" && e.preventDefault()}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">بازدید سایت</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/chart/thebest"}
                      className={`${pathname === "/dashboard/chart/thebest" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">ترین‌ها</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/chart/articles"}
                      className={`${pathname === "/dashboard/chart/articles" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">تحلیل محاسباتی مقاله</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/chart/camp"}
                      className={`${pathname === "/dashboard/chart/camp" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">کمپین</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/chart/users"}
                      className={`${pathname === "/dashboard/chart/users" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">مخاطبان</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>
              <Link
                rel="preconnect"
                to={"/dashboard/calendar"}
                className={`hidden lg:block ${
                  pathname === "/dashboard/calendar" ? "bg-gray-100" : ""
                } block `}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/calendar.svg"
                    alt="category"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> تقویم</span>
                </li>
              </Link>
              <Link
                rel="preconnect"
                to={"/dashboard/camp"}
                className={`hidden lg:block ${pathname === "/dashboard/camp" ? "bg-gray-100" : ""} block `}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/camp.svg"
                    alt="category"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> ایجاد پیوند کمپین</span>
                </li>
              </Link>
              <Link
                rel="preconnect"
                to={"/dashboard/upload-center"}
                className={`hidden lg:block ${
                  pathname === "/dashboard/upload-center" ? "bg-gray-100" : ""
                } block `}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/upload_to_cloud.svg"
                    alt="category"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> مرکز فضای ابری وقایع</span>
                </li>
              </Link>
            </ul>
            <div className="space-y-2 pt-2">
              <Link
                rel="preconnect"
                to={"/dashboard/report-bug"}
                className={`${
                  pathname === "/dashboard/report-bug" ? "bg-gray-100" : ""
                } text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 group transition duration-75 flex items-center p-2`}
              >
                <img
                  src="/assets/images/dashboard/icons/helpIcon.svg"
                  alt="report bugs"
                  className="w-6 h-6 ml-2"
                />
                <span className="ml-3">گزارش مشکل</span>
              </Link>

              <Link
                rel="preconnect"
                to={`/dashboard/profile/${me?._id}`}
                className={`${
                  pathname === "/dashboard/profile" ? "bg-gray-100" : ""
                } text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 group transition duration-75 flex items-center p-2`}
              >
                <img
                  src="/assets/images/dashboard/icons/setingsIcon.svg"
                  alt="profile"
                  className="w-6 h-6 ml-2"
                />
                <span className="ml-3"> تنظیمات پروفایل</span>
              </Link>
              <button
                onClick={() => logoutHandler()}
                className="w-full cursor-pointer text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 group transition duration-75 flex items-center p-2"
              >
                <img
                  loading="lazy"
                  src="/assets/images/dashboard/icons/logout.svg"
                  alt="loguot "
                  className="w-6 h-6 ml-2"
                />
                <span className="ml-3">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
