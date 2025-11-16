import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Search from "../components/lists/Search";

const Sidebar = ({ sidebarOpen, me }) => {
  const [menuToggle, setMenuToggle] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Get unread counts from Redux
  const unreadNotifications = useSelector((state) => state.notifications?.unreadCount || 0);
  const unreadMentions = useSelector((state) => state.social?.unreadMentionCount || 0);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleHandler = (id) => {
    setMenuToggle((prev) => (prev === id ? null : id));
  };

  // Badge component for unread counts
  const Badge = ({ count }) => {
    if (!count || count === 0) return null;
    return (
      <span className="absolute left-8 top-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
        {count > 99 ? "99+" : count}
      </span>
    );
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
              {/* Search - Mobile Only */}
              <li>
                <div className="md:hidden">
                  <Search />
                </div>
              </li>

              {/* میز کار */}
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
              <div className="mt-4 px-2 bg-[#3b80c3]">
                <div className="flex items-center gap-2 border-b-2 border-blue-300">
                  <img src="/assets/icons/welfare.svg" alt="needs network" className="w-10 h-10" />
                  <span className="text-md translate-y-0.5 font-bold text-white uppercase tracking-wide">
                    پروژه‌های خیریه سازمان{" "}
                  </span>
                </div>
              </div>
              {/* پروژه‌ها */}
              <div>
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img src="/assets/icons/projects.svg" alt="projects" className="w-6 h-6 ml-2" />
                  <span className="ml-3 flex-1 whitespace-nowrap"> پروژه‌ها</span>
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
                      to={"/dashboard/projects"}
                      className={`${
                        pathname === "/dashboard/projects" ||
                        (pathname.startsWith("/dashboard/projects/") &&
                          !pathname.startsWith("/dashboard/projects/create") &&
                          !pathname.includes("/edit/") &&
                          !pathname.includes("/featured-completed"))
                          ? "bg-gray-100"
                          : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">لیست پروژه‌ها</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/projects/create"}
                      className={`${pathname === "/dashboard/projects/create" ? "bg-gray-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">ایجاد پروژه</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/projects/featured-completed"}
                      className={`${
                        pathname === "/dashboard/projects/featured-completed" ? "bg-gray-100" : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-green-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">
                          پروژه‌های برجسته تکمیل شده
                        </span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>

              {/* کمک‌های مالی */}
              <Link
                rel="preconnect"
                to={"/dashboard/donations"}
                className={`${
                  pathname === "/dashboard/donations" || pathname.startsWith("/dashboard/donations/")
                    ? "bg-gray-100"
                    : ""
                } block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img src="/assets/icons/get_cash.svg" alt="donations" className="w-6 h-6 ml-2" />
                  <span className="ml-3 flex-1 whitespace-nowrap"> کمک‌های مالی</span>
                </li>
              </Link>

              {/* داوطلبان */}
              <Link
                rel="preconnect"
                to={"/dashboard/volunteers"}
                className={`${
                  pathname === "/dashboard/volunteers" || pathname.startsWith("/dashboard/volunteers/")
                    ? "bg-gray-100"
                    : ""
                } block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/users.svg"
                    alt="volunteers"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> داوطلبان</span>
                </li>
              </Link>

              {/* حوزه‌های فعالیت */}
              <Link
                rel="preconnect"
                to={"/dashboard/focus-areas"}
                className={`${pathname === "/dashboard/focus-areas" ? "bg-gray-100" : ""} block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/category.svg"
                    alt="focus areas"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> حوزه‌های فعالیت</span>
                </li>
              </Link>
              <div className="mt-4 px-2 bg-[#3b80c3]">
                <div className="flex items-center gap-2 border-b-2 border-blue-300">
                  <img src="/assets/icons/blog.svg" alt="needs network" className="w-10 h-10" />
                  <span className="text-md translate-y-0.5 font-bold text-white uppercase tracking-wide">
                    مجله
                  </span>
                </div>
              </div>
              {/* مقاله */}
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

              {/* ویدئوها */}
              <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group">
                <img
                  src="/assets/images/dashboard/icons/video_playlist.svg"
                  alt="videos"
                  className="w-6 h-6 ml-2"
                />
                <span className="ml-3 flex-1 whitespace-nowrap">ویدئوها</span>
                <img
                  src="/assets/images/dashboard/icons/downArrow.svg"
                  className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                  style={menuToggle === 4 ? { rotate: "90deg" } : { rotate: "0deg" }}
                  onClick={() => toggleHandler(4)}
                  alt="down arrow icon 4"
                />
              </li>
              {menuToggle === 4 && (
                <div className="flex flex-col w-full justify-start items-start bg-gray-50">
                  <Link
                    rel="preconnect"
                    to={"/dashboard/videos/create"}
                    className={`${pathname === "/dashboard/videos/create" ? "bg-gray-100" : ""} w-full`}
                  >
                    <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                      <span className="mr-5 text-purple-400">*</span>
                      <span className="d-block mr-1 flex-1 whitespace-nowrap">ایجاد ویدئوی جدید</span>
                    </li>
                  </Link>
                  <Link
                    rel="preconnect"
                    to={"/dashboard/videos"}
                    className={`${pathname === "/dashboard/videos" ? "bg-gray-100" : ""} w-full`}
                  >
                    <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                      <span className="mr-5 text-purple-400">*</span>
                      <span className="d-block mr-1 flex-1 whitespace-nowrap">فهرست ویدئوها</span>
                    </li>
                  </Link>
                </div>
              )}

              {/* گالری */}
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
                    style={menuToggle === 5 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(5)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 5 && (
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
              <div className="mt-4 px-2 bg-[#3b80c3]">
                <div className="flex items-center gap-2 border-b-2 border-blue-300">
                  <img src="/assets/icons/megaphone.svg" alt="needs network" className="w-10 h-10 py-1" />
                  <span className="text-md translate-y-0.5 font-bold text-white uppercase tracking-wide">
                    پایگاه خبری
                  </span>
                </div>
              </div>
              {/* اخبار */}
              <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group">
                <img src="/assets/icons/news_agency.svg" alt="news" className="w-6 h-6 ml-2" />
                <span className="ml-3 flex-1 whitespace-nowrap">اخبار</span>
                <img
                  src="/assets/images/dashboard/icons/downArrow.svg"
                  className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                  style={menuToggle === 3 ? { rotate: "90deg" } : { rotate: "0deg" }}
                  onClick={() => toggleHandler(3)}
                  alt="down arrow icon 3"
                />
              </li>
              {menuToggle === 3 && (
                <div className="flex flex-col w-full justify-start items-start bg-gray-50">
                  <Link
                    rel="preconnect"
                    to={"/dashboard/news/create"}
                    className={`${pathname === "/dashboard/news/create" ? "bg-gray-100" : ""} w-full`}
                  >
                    <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                      <span className="mr-5 text-blue-400">*</span>
                      <span className="d-block mr-1 flex-1 whitespace-nowrap">ایجاد خبر جدید</span>
                    </li>
                  </Link>
                  <Link
                    rel="preconnect"
                    to={"/dashboard/news"}
                    className={`${pathname === "/dashboard/news" ? "bg-gray-100" : ""} w-full`}
                  >
                    <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                      <span className="mr-5 text-blue-400">*</span>
                      <span className="d-block mr-1 flex-1 whitespace-nowrap">فهرست اخبار</span>
                    </li>
                  </Link>
                </div>
              )}

              <div className="mt-4 px-2 bg-[#3b80c3]">
                <div className="flex items-center gap-2 border-b-2 border-blue-300">
                  <img src="/assets/icons/shared_settings.svg" alt="needs network" className="w-10 h-10" />
                  <span className="text-md translate-y-0.5 font-bold text-white uppercase tracking-wide">
                    مشترکات
                  </span>
                </div>
              </div>
              {/* دسته‌بندی‌ها */}
              <Link
                rel="preconnect"
                to={"/dashboard/categories"}
                className={`${
                  pathname === "/dashboard/categories" || pathname.startsWith("/dashboard/categories/")
                    ? "bg-gray-100"
                    : ""
                } block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/category.svg"
                    alt="category"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> دسته‌بندی‌ها</span>
                </li>
              </Link>
              {/* برچسب‌ها */}
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

              {/* نویسندگان */}
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
                    style={menuToggle === 6 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(6)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 6 && (
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
              {/* نظرات */}
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

              {/* مخاطبان */}
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
              {/* Header بخش شبکه نیازسنجی */}
              <div className="mt-4 px-2 bg-[#3b80c3]">
                <div className="flex items-center gap-2 border-b-2 border-blue-300">
                  <img
                    src="/assets/icons/short_logo_mehrebaran.svg"
                    alt="needs network"
                    className="w-10 h-10"
                  />
                  <span className="text-md translate-y-0.5 font-bold text-white uppercase tracking-wide">
                    شبکه نیازسنجی{" "}
                  </span>
                </div>
              </div>

              {/* آنالیز و گزارش‌گیری */}
              <Link
                rel="preconnect"
                to={"/dashboard/analytics"}
                className={`${
                  pathname === "/dashboard/analytics"
                    ? "bg-blue-50 border-r-4 border-blue-500"
                    : "border-r-4 border-transparent"
                } block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-blue-50 flex items-center p-2 group">
                  <img loading="lazy" src="/assets/icons/analysis.svg" alt="users" className="w-6 h-6 ml-2" />{" "}
                  <span className="ml-3 flex-1 whitespace-nowrap">تحلیل آمارها</span>
                </li>
              </Link>

              {/* مدیریت محتوا */}
              <Link
                rel="preconnect"
                to={"/dashboard/moderation"}
                className={`${
                  pathname === "/dashboard/moderation"
                    ? "bg-blue-50 border-r-4 border-blue-500"
                    : "border-r-4 border-transparent"
                } block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-blue-50 flex items-center p-2 group relative">
                  <img
                    loading="lazy"
                    src="/assets/icons/medium_icons.svg"
                    alt="users"
                    className="w-6 h-6 ml-2"
                  />{" "}
                  <span className="ml-3 flex-1 whitespace-nowrap">مدیریت محتوا</span>
                  <Badge count={unreadNotifications} />
                </li>
              </Link>

              {/* فید فعالیت‌ها */}
              <Link
                rel="preconnect"
                to={"/dashboard/activity-feed"}
                className={`${
                  pathname === "/dashboard/activity-feed"
                    ? "bg-blue-50 border-r-4 border-blue-500"
                    : "border-r-4 border-transparent"
                } block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-blue-50 flex items-center p-2 group">
                  <img
                    loading="lazy"
                    src="/assets/icons/collaboration.svg"
                    alt="users"
                    className="w-6 h-6 ml-2"
                  />{" "}
                  <span className="ml-3 flex-1 whitespace-nowrap">رصد فعالیت‌ها</span>
                </li>
              </Link>

              {/* نیازها */}
              <Link
                rel="preconnect"
                to={"/dashboard/needs"}
                className={`${
                  pathname === "/dashboard/needs" || pathname.startsWith("/dashboard/needs/")
                    ? "bg-blue-50 border-r-4 border-blue-500"
                    : "border-r-4 border-transparent"
                } block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-blue-50 flex items-center p-2 group">
                  <img loading="lazy" src="/assets/icons/needs.svg" alt="users" className="w-6 h-6 ml-2" />
                  <span className="ml-3 flex-1 whitespace-nowrap">نیازها</span>
                </li>
              </Link>

              {/* تیم‌ها */}
              <Link
                rel="preconnect"
                to={"/dashboard/teams"}
                className={`${
                  pathname === "/dashboard/teams" || pathname.startsWith("/dashboard/teams/")
                    ? "bg-blue-50 border-r-4 border-blue-500"
                    : "border-r-4 border-transparent"
                } block`}
              >
                <li className="text-base text-gray-900 font-normal rounded-lg hover:bg-blue-50 flex items-center p-2 group">
                  <img loading="lazy" src="/assets/icons/team.svg" alt="users" className="w-6 h-6 ml-2" />
                  <span className="ml-3 flex-1 whitespace-nowrap">تیم‌ها</span>
                </li>
              </Link>

              {/* استوری‌ها */}
              <div
                className={`${
                  pathname.startsWith("/dashboard/stories")
                    ? "bg-blue-50 border-r-4 border-blue-500"
                    : "border-r-4 border-transparent"
                }`}
              >
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-blue-50 flex items-center p-2 group">
                  <img
                    loading="lazy"
                    src="/assets/icons/storytelling.svg"
                    alt="users"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap">استوری‌ها</span>
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 11 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(11)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 11 && (
                  <div className="flex flex-col w-full justify-start items-start bg-blue-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/stories"}
                      className={`${
                        pathname === "/dashboard/stories" ||
                        (pathname.startsWith("/dashboard/stories/") && !pathname.includes("highlights"))
                          ? "bg-blue-100"
                          : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-blue-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">لیست استوری‌ها</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/stories/highlights"}
                      className={`${
                        pathname === "/dashboard/stories/highlights" ? "bg-blue-100" : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-blue-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">هایلایت‌ها</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>

              {/* گیمیفیکیشن */}
              <div
                className={`${
                  pathname.startsWith("/dashboard/gamification")
                    ? "bg-blue-50 border-r-4 border-blue-500"
                    : "border-r-4 border-transparent"
                }`}
              >
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-blue-50 flex items-center p-2 group">
                  <img loading="lazy" src="/assets/icons/game.svg" alt="users" className="w-6 h-6 ml-2" />
                  <span className="ml-3 flex-1 whitespace-nowrap">بازی‌وارسازی </span>
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 12 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(12)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 12 && (
                  <div className="flex flex-col w-full justify-start items-start bg-blue-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/gamification/badges"}
                      className={`${
                        pathname === "/dashboard/gamification/badges" ||
                        pathname.startsWith("/dashboard/gamification/badges/")
                          ? "bg-blue-100"
                          : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-yellow-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">نشان‌ها</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/gamification/leaderboard"}
                      className={`${
                        pathname === "/dashboard/gamification/leaderboard" ? "bg-blue-100" : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-yellow-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">جدول امتیازات</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/gamification/user-stats"}
                      className={`${
                        pathname === "/dashboard/gamification/user-stats" ||
                        pathname.startsWith("/dashboard/gamification/user-stats/")
                          ? "bg-blue-100"
                          : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-yellow-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">آمار کاربران</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/gamification/point-transactions"}
                      className={`${
                        pathname === "/dashboard/gamification/point-transactions" ? "bg-blue-100" : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-yellow-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">تراکنش‌های امتیاز</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>

              {/* تعاملات اجتماعی */}
              <div
                className={`${
                  pathname.startsWith("/dashboard/social")
                    ? "bg-blue-50 border-r-4 border-blue-500"
                    : "border-r-4 border-transparent"
                }`}
              >
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-blue-50 flex items-center p-2 group">
                  <img
                    loading="lazy"
                    src="/assets/icons/batch_assign.svg"
                    alt="users"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap">تعاملات اجتماعی</span>
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 15 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(15)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 15 && (
                  <div className="flex flex-col w-full justify-start items-start bg-blue-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/social/follows"}
                      className={`${pathname === "/dashboard/social/follows" ? "bg-blue-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-pink-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">دنبال‌کنندگان</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/social/mentions"}
                      className={`${
                        pathname === "/dashboard/social/mentions" ? "bg-blue-100" : ""
                      } w-full relative`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-pink-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">منشن‌ها</span>
                        <Badge count={unreadMentions} />
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/social/tags"}
                      className={`${pathname === "/dashboard/social/tags" ? "bg-blue-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-pink-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">تگ‌های اجتماعی</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/social/shares"}
                      className={`${pathname === "/dashboard/social/shares" ? "bg-blue-100" : ""} w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-pink-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">اشتراک‌گذاری</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>

              {/* اعلانات */}
              <div
                className={`${
                  pathname.startsWith("/dashboard/notifications")
                    ? "bg-blue-50 border-r-4 border-blue-500"
                    : "border-r-4 border-transparent"
                }`}
              >
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-blue-50 flex items-center p-2 group">
                  <img loading="lazy" src="/assets/icons/shouting.svg" alt="users" className="w-6 h-6 ml-2" />
                  <span className="ml-3 flex-1 whitespace-nowrap">اعلانات</span>
                  <Badge count={unreadNotifications} />
                  <img
                    src="/assets/images/dashboard/icons/downArrow.svg"
                    className="h-6 w-6 absolute top-2 left-2 cursor-pointer"
                    style={menuToggle === 16 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(16)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 16 && (
                  <div className="flex flex-col w-full justify-start items-start bg-blue-50">
                    <Link
                      rel="preconnect"
                      to={"/dashboard/notifications"}
                      className={`${
                        pathname === "/dashboard/notifications" &&
                        !pathname.includes("/settings") &&
                        !pathname.includes("/push-tokens")
                          ? "bg-blue-100"
                          : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">لیست اعلانات</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/notifications/settings"}
                      className={`${
                        pathname === "/dashboard/notifications/settings" ? "bg-blue-100" : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">تنظیمات اعلانات</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/notifications/push-tokens"}
                      className={`${
                        pathname === "/dashboard/notifications/push-tokens" ? "bg-blue-100" : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px] font-normal rounded-lg hover:bg-blue-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-400">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">مدیریت دستگاه‌ها</span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-4 px-2 bg-[#3b80c3]">
                <div className="flex items-center gap-2 border-b-2 border-blue-300">
                  <img src="/assets/icons/tune.svg" alt="needs network" className="w-10 h-10 py-1" />
                  <span className="text-md translate-y-0.5 font-bold text-white uppercase tracking-wide">
                    تنظیمات سایت
                  </span>
                </div>
              </div>
              {/* تنظیمات سایت */}
              <div>
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                  <img
                    src="/assets/images/dashboard/icons/setingsIcon.svg"
                    alt="settings"
                    className="w-6 h-6 ml-2"
                  />
                  <span className="ml-3 flex-1 whitespace-nowrap"> تنظیمات سایت</span>
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
                      to={"/dashboard/settings"}
                      className={`${
                        pathname === "/dashboard/settings" &&
                        !pathname.includes("/home-hero") &&
                        !pathname.includes("/blog-background")
                          ? "bg-gray-100"
                          : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">تنظیمات کلی</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/settings/home-hero"}
                      className={`${
                        pathname === "/dashboard/settings/home-hero" ? "bg-gray-100" : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">Hero Section</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/settings/blog-background"}
                      className={`${
                        pathname === "/dashboard/settings/blog-background" ? "bg-gray-100" : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">پس‌زمینه بلاگ</span>
                      </li>
                    </Link>
                    <Link
                      rel="preconnect"
                      to={"/dashboard/settings/focus-page-hero"}
                      className={`${
                        pathname === "/dashboard/settings/focus-page-hero" ? "bg-gray-100" : ""
                      } w-full`}
                    >
                      <li className="text-base text-gray-900 text-[14px]  font-normal rounded-lg hover:bg-gray-100 flex items-start p-2 group cursor-pointer">
                        <span className="mr-5 text-red-300">*</span>
                        <span className="d-block mr-1 flex-1 whitespace-nowrap">
                          Hero صفحه حوزه‌های فعالیت
                        </span>
                      </li>
                    </Link>
                  </div>
                )}
              </div>

              {/* مدیران سایت */}
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
                    style={menuToggle === 10 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(10)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 10 && (
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
              {/* تقویم */}
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
              {/* سوالات پرتکرار */}
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
                    style={menuToggle === 7 ? { rotate: "90deg" } : { rotate: "0deg" }}
                    onClick={() => toggleHandler(7)}
                    alt="down arrow icon"
                  />
                </li>
                {menuToggle === 7 && (
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

              {/* نمودارها */}
              <div className={`${me?.role === "admin" && "disabled"} hidden md:block`}>
                <li className="relative text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group">
                  <img src="/assets/images/dashboard/icons/chart.svg" alt="admins" className="w-6 h-6 ml-2" />
                  <span className="ml-3 flex-1 whitespace-nowrap">نمودارها</span>
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

              <div className="mt-4 px-2 bg-[#3b80c3]">
                <div className="flex items-center gap-2 border-b-2 border-blue-300">
                  <img src="/assets/icons/database_view.svg" alt="needs network" className="w-9 h-9 py-1" />
                  <span className="text-md translate-y-0.5 font-bold text-white uppercase tracking-wide">
                    پایگاه ذخیره‌سازی
                  </span>
                </div>
              </div>

              {/* مرکز فضای ابری */}
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
                  <span className="ml-3 flex-1 whitespace-nowrap"> مرکز فضای ابری مهرباران</span>
                </li>
              </Link>
            </ul>

            {/* Footer Section */}
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
