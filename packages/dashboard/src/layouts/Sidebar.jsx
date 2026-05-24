import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Search from "../components/lists/Search";

// --- UI COMPONENTS (Internal for Sidebar) ---

const SectionLabel = ({ title, icon }) => (
  <div className="px-3 mt-5 mb-2 flex items-center gap-2 text-[13px] font-bold text-slate-400 uppercase tracking-wider select-none">
    {icon && <img src={icon} alt="" className="w-3 h-3 opacity-50 grayscale" />}
    <span>{title}</span>
    <div className="h-px flex-1 bg-slate-200 ml-2"></div>
  </div>
);

const Badge = ({ count, color = "bg-red-500" }) => {
  if (!count || count === 0) return null;
  return (
    <span
      className={`ml-auto inline-flex items-center justify-center px-1.5 py-0.5 text-[13px] font-mono font-bold leading-none text-white ${color} rounded-md shadow-sm`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

const NavItem = ({ to, icon, label, active, onClick, hasSubMenu, isOpen, badge, className = "" }) => {
  return (
    <li className={`relative ${className}`}>
      <Link
        to={to || "#"}
        onClick={onClick}
        className={`
          group flex items-center w-full px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-150
          ${
            active
              ? "bg-blue-50 text-[#007acc] ring-1 ring-blue-100"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }
        `}
      >
        {icon && (
          <img
            src={icon}
            alt={label}
            className={`w-4 h-4 ml-2.5 transition-all ${
              active ? "opacity-100" : "opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-80"
            }`}
          />
        )}
        <span className="flex-1 truncate">{label}</span>
        {badge}
        {hasSubMenu && (
          <img
            src="/assets/images/dashboard/icons/downArrow.svg"
            className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            alt="toggle"
          />
        )}
      </Link>
    </li>
  );
};

const SubMenuContainer = ({ children, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="relative flex flex-col space-y-0.5 pr-9 pl-2 py-1 before:absolute before:right-[18px] before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
      {children}
    </div>
  );
};

const SubItem = ({ to, label, active, dotColor = "text-slate-300" }) => (
  <Link
    to={to}
    className={`
      block w-full px-2 py-1 text-[12px] rounded-md transition-colors
      ${
        active
          ? "bg-slate-100 text-[#007acc] font-semibold"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
      }
    `}
  >
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full ml-2 ${active ? "bg-[#007acc]" : "bg-slate-300"}`}
    ></span>
    {label}
  </Link>
);

// --- MAIN COMPONENT ---

const Sidebar = ({ sidebarOpen, me }) => {
  const [menuToggle, setMenuToggle] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Redux State
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

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <aside
      id="sidebar"
      className={`
        ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        fixed lg:static inset-y-0 right-0 z-40
        w-[260px] min-w-[260px] h-full bg-slate-50 border-l border-slate-200
        transition-transform duration-200 ease-in-out flex flex-col
      `}
      aria-label="Sidebar"
    >
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 py-4">
        <div className="px-3 space-y-0.5">
          {/* Search (Mobile) */}
          <div className="md:hidden mb-4">
            <Search />
          </div>

          {/* --- DASHBOARD --- */}
          <NavItem
            to="/dashboard"
            label="میز کار"
            icon="/assets/images/dashboard/icons/panelIcon.svg"
            active={pathname === "/dashboard"}
          />

          {/* --- CHARITY PROJECTS --- */}
          <SectionLabel title="پروژه‌های خیریه" icon="/assets/icons/welfare.svg" />

          {/* Projects Accordion */}
          <div>
            <NavItem
              label="پروژه‌ها"
              icon="/assets/icons/projects.svg"
              hasSubMenu
              isOpen={menuToggle === 8}
              onClick={() => toggleHandler(8)}
              active={isActive("/dashboard/projects")}
            />
            <SubMenuContainer isOpen={menuToggle === 8}>
              <SubItem
                to="/dashboard/projects"
                label="لیست پروژه‌ها"
                active={pathname === "/dashboard/projects"}
              />
              <SubItem
                to="/dashboard/projects/create"
                label="ایجاد پروژه"
                active={pathname === "/dashboard/projects/create"}
              />
              <SubItem
                to="/dashboard/projects/featured-completed"
                label="پروژه‌های تکمیل شده"
                active={pathname === "/dashboard/projects/featured-completed"}
              />
            </SubMenuContainer>
          </div>

          <NavItem
            to="/dashboard/help-requests"
            label="درخواست‌های کمک"
            icon="/assets/icons/helping.svg"
            active={isActive("/dashboard/help-requests")}
          />

          <NavItem
            to="/dashboard/donations"
            label="کمک‌های مالی"
            icon="/assets/icons/get_cash.svg"
            active={isActive("/dashboard/donations")}
          />

          <NavItem
            to="/dashboard/volunteers"
            label="داوطلبان"
            icon="/assets/images/dashboard/icons/users.svg"
            active={isActive("/dashboard/volunteers")}
          />

          <NavItem
            to="/dashboard/focus-areas"
            label="حوزه‌های فعالیت"
            icon="/assets/images/dashboard/icons/category.svg"
            active={pathname === "/dashboard/focus-areas"}
          />

          {/* --- MAGAZINE --- */}
          <SectionLabel title="مجله و محتوا" icon="/assets/icons/blog.svg" />

          {/* Articles */}
          <div>
            <NavItem
              label="مقاله"
              icon="/assets/images/dashboard/icons/paperIcon.svg"
              hasSubMenu
              isOpen={menuToggle === 2}
              onClick={() => toggleHandler(2)}
              active={isActive("/dashboard/articles")}
            />
            <SubMenuContainer isOpen={menuToggle === 2}>
              <SubItem
                to="/dashboard/articles/create"
                label="ایجاد مقاله جدید"
                active={pathname === "/dashboard/articles/create"}
              />
              <SubItem
                to="/dashboard/articles"
                label="فهرست مقاله‌ها"
                active={pathname === "/dashboard/articles"}
              />
            </SubMenuContainer>
          </div>

          {/* Videos */}
          <div>
            <NavItem
              label="ویدئوها"
              icon="/assets/images/dashboard/icons/video_playlist.svg"
              hasSubMenu
              isOpen={menuToggle === 4}
              onClick={() => toggleHandler(4)}
              active={isActive("/dashboard/videos")}
            />
            <SubMenuContainer isOpen={menuToggle === 4}>
              <SubItem
                to="/dashboard/videos/create"
                label="ایجاد ویدئو جدید"
                active={pathname === "/dashboard/videos/create"}
              />
              <SubItem
                to="/dashboard/videos"
                label="فهرست ویدئوها"
                active={pathname === "/dashboard/videos"}
              />
            </SubMenuContainer>
          </div>

          {/* Gallery */}
          <div>
            <NavItem
              label="گالری"
              icon="/assets/images/dashboard/icons/photo_gallery.svg"
              hasSubMenu
              isOpen={menuToggle === 5}
              onClick={() => toggleHandler(5)}
              active={isActive("/dashboard/galleries")}
            />
            <SubMenuContainer isOpen={menuToggle === 5}>
              <SubItem
                to="/dashboard/galleries/create"
                label="ایجاد گالری جدید"
                active={pathname === "/dashboard/galleries/create"}
              />
              <SubItem
                to="/dashboard/galleries"
                label="فهرست گالری‌ها"
                active={pathname === "/dashboard/galleries"}
              />
            </SubMenuContainer>
          </div>

          {/* --- NEWS AGENCY --- */}
          <SectionLabel title="پایگاه خبری" icon="/assets/icons/megaphone.svg" />

          <div>
            <NavItem
              label="اخبار"
              icon="/assets/icons/news_agency.svg"
              hasSubMenu
              isOpen={menuToggle === 3}
              onClick={() => toggleHandler(3)}
              active={isActive("/dashboard/news")}
            />
            <SubMenuContainer isOpen={menuToggle === 3}>
              <SubItem
                to="/dashboard/news/create"
                label="ایجاد خبر جدید"
                active={pathname === "/dashboard/news/create"}
              />
              <SubItem to="/dashboard/news" label="فهرست اخبار" active={pathname === "/dashboard/news"} />
            </SubMenuContainer>
          </div>

          {/* --- SHARED SETTINGS --- */}
          <SectionLabel title="مشترکات" icon="/assets/icons/shared_settings.svg" />

          <NavItem
            to="/dashboard/categories"
            label="دسته‌بندی‌ها"
            icon="/assets/images/dashboard/icons/category.svg"
            active={isActive("/dashboard/categories")}
          />

          <NavItem
            to="/dashboard/tags"
            label="برچسب‌ها"
            icon="/assets/images/dashboard/icons/tags.svg"
            active={pathname === "/dashboard/tags"}
          />

          {/* Authors */}
          <div>
            <NavItem
              label="نویسندگان"
              icon="/assets/images/dashboard/icons/writers.svg"
              hasSubMenu
              isOpen={menuToggle === 6}
              onClick={() => toggleHandler(6)}
              active={isActive("/dashboard/authors")}
            />
            <SubMenuContainer isOpen={menuToggle === 6}>
              <SubItem
                to="/dashboard/authors/create"
                label="افزودن نویسنده"
                active={pathname === "/dashboard/authors/create"}
              />
              <SubItem
                to="/dashboard/authors"
                label="مجمع نویسندگان"
                active={pathname === "/dashboard/authors"}
              />
            </SubMenuContainer>
          </div>

          <NavItem
            to="/dashboard/comments"
            label="نظرات"
            icon="/assets/images/dashboard/icons/messagesIcon.svg"
            active={pathname === "/dashboard/comments"}
            onClick={(e) => me?.role === "admin" && e.preventDefault()}
            className={me?.role === "admin" ? "opacity-50 cursor-not-allowed" : ""}
          />

          <NavItem
            to="/dashboard/users"
            label="مخاطبان"
            icon="/assets/images/dashboard/icons/users.svg"
            active={pathname === "/dashboard/users"}
            onClick={(e) => me?.role === "admin" && e.preventDefault()}
            className={me?.role === "admin" ? "opacity-50 cursor-not-allowed" : ""}
          />

          {/* --- NEEDS NETWORK --- */}
          <SectionLabel title="شبکه نیازسنجی" icon="/assets/icons/short_logo_mehrebaran.svg" />

          <NavItem
            to="/dashboard/analytics"
            label="تحلیل آمارها"
            icon="/assets/icons/analysis.svg"
            active={pathname === "/dashboard/analytics"}
          />

          <NavItem
            to="/dashboard/moderation"
            label="مدیریت محتوا"
            icon="/assets/icons/medium_icons.svg"
            active={pathname === "/dashboard/moderation"}
            badge={<Badge count={unreadNotifications} />}
          />

          <NavItem
            to="/dashboard/activity-feed"
            label="رصد فعالیت‌ها"
            icon="/assets/icons/collaboration.svg"
            active={pathname === "/dashboard/activity-feed"}
          />

          <NavItem
            to="/dashboard/needs"
            label="نیازها"
            icon="/assets/icons/needs.svg"
            active={isActive("/dashboard/needs")}
          />

          <NavItem
            to="/dashboard/teams"
            label="تیم‌ها"
            icon="/assets/icons/team.svg"
            active={isActive("/dashboard/teams")}
          />

          {/* Stories */}
          <div>
            <NavItem
              label="استوری‌ها"
              icon="/assets/icons/storytelling.svg"
              hasSubMenu
              isOpen={menuToggle === 11}
              onClick={() => toggleHandler(11)}
              active={isActive("/dashboard/stories")}
            />
            <SubMenuContainer isOpen={menuToggle === 11}>
              <SubItem
                to="/dashboard/stories"
                label="لیست استوری‌ها"
                active={pathname === "/dashboard/stories"}
              />
              <SubItem
                to="/dashboard/stories/highlights"
                label="هایلایت‌ها"
                active={pathname === "/dashboard/stories/highlights"}
              />
            </SubMenuContainer>
          </div>

          {/* Gamification */}
          <div>
            <NavItem
              label="بازی‌وارسازی"
              icon="/assets/icons/game.svg"
              hasSubMenu
              isOpen={menuToggle === 12}
              onClick={() => toggleHandler(12)}
              active={isActive("/dashboard/gamification")}
            />
            <SubMenuContainer isOpen={menuToggle === 12}>
              <SubItem
                to="/dashboard/gamification/badges"
                label="نشان‌ها"
                active={isActive("/dashboard/gamification/badges")}
              />
              <SubItem
                to="/dashboard/gamification/leaderboard"
                label="جدول امتیازات"
                active={pathname === "/dashboard/gamification/leaderboard"}
              />
              <SubItem
                to="/dashboard/gamification/user-stats"
                label="آمار کاربران"
                active={isActive("/dashboard/gamification/user-stats")}
              />
              <SubItem
                to="/dashboard/gamification/point-transactions"
                label="تراکنش‌های امتیاز"
                active={pathname === "/dashboard/gamification/point-transactions"}
              />
            </SubMenuContainer>
          </div>

          {/* Social */}
          <div>
            <NavItem
              label="تعاملات اجتماعی"
              icon="/assets/icons/batch_assign.svg"
              hasSubMenu
              isOpen={menuToggle === 15}
              onClick={() => toggleHandler(15)}
              active={isActive("/dashboard/social")}
            />
            <SubMenuContainer isOpen={menuToggle === 15}>
              <SubItem
                to="/dashboard/social/follows"
                label="دنبال‌کنندگان"
                active={pathname === "/dashboard/social/follows"}
              />
              <SubItem
                to="/dashboard/social/mentions"
                label={`منشن‌ها ${unreadMentions > 0 ? `(${unreadMentions})` : ""}`}
                active={pathname === "/dashboard/social/mentions"}
              />
              <SubItem
                to="/dashboard/social/tags"
                label="تگ‌های اجتماعی"
                active={pathname === "/dashboard/social/tags"}
              />
              <SubItem
                to="/dashboard/social/shares"
                label="اشتراک‌گذاری"
                active={pathname === "/dashboard/social/shares"}
              />
            </SubMenuContainer>
          </div>

          {/* Notifications */}
          <div>
            <NavItem
              label="اعلانات"
              icon="/assets/icons/shouting.svg"
              hasSubMenu
              isOpen={menuToggle === 16}
              onClick={() => toggleHandler(16)}
              active={isActive("/dashboard/notifications")}
              badge={<Badge count={unreadNotifications} />}
            />
            <SubMenuContainer isOpen={menuToggle === 16}>
              <SubItem
                to="/dashboard/notifications"
                label="لیست اعلانات"
                active={pathname === "/dashboard/notifications"}
              />
              <SubItem
                to="/dashboard/notifications/settings"
                label="تنظیمات اعلانات"
                active={pathname === "/dashboard/notifications/settings"}
              />
              <SubItem
                to="/dashboard/notifications/push-tokens"
                label="مدیریت دستگاه‌ها"
                active={pathname === "/dashboard/notifications/push-tokens"}
              />
            </SubMenuContainer>
          </div>

          {/* --- SITE SETTINGS --- */}
          <SectionLabel title="تنظیمات سایت" icon="/assets/icons/tune.svg" />

          <NavItem
            to="/dashboard/settings"
            label="تنظیمات کلی"
            icon="/assets/images/dashboard/icons/setingsIcon.svg"
            active={pathname === "/dashboard/settings"}
          />

          {/* Admins */}
          <div className={me?.role === "admin" ? "opacity-50 pointer-events-none" : ""}>
            <NavItem
              label="مدیران سایت"
              icon="/assets/images/dashboard/icons/editors.svg"
              hasSubMenu
              isOpen={menuToggle === 10}
              onClick={() => toggleHandler(10)}
              active={isActive("/dashboard/admins")}
            />
            <SubMenuContainer isOpen={menuToggle === 10}>
              <SubItem
                to="/dashboard/admins/create"
                label="افزودن مدیر"
                active={pathname === "/dashboard/admins/create"}
              />
              <SubItem
                to="/dashboard/admins"
                label="فهرست مدیران"
                active={pathname === "/dashboard/admins"}
              />
            </SubMenuContainer>
          </div>

          <NavItem
            to="/dashboard/calendar"
            label="تقویم"
            icon="/assets/images/dashboard/icons/calendar.svg"
            active={pathname === "/dashboard/calendar"}
            className="hidden lg:block"
          />

          {/* FAQs */}
          <div>
            <NavItem
              label="سوالات پرتکرار"
              icon="/assets/images/dashboard/icons/faq.svg"
              hasSubMenu
              isOpen={menuToggle === 7}
              onClick={() => toggleHandler(7)}
              active={isActive("/dashboard/faqs")}
            />
            <SubMenuContainer isOpen={menuToggle === 7}>
              <SubItem
                to="/dashboard/faqs/create"
                label="ایجاد پرسش و پاسخ"
                active={pathname === "/dashboard/faqs/create"}
              />
              <SubItem to="/dashboard/faqs" label="فهرست سوالات" active={pathname === "/dashboard/faqs"} />
            </SubMenuContainer>
          </div>

          {/* Charts */}
          <div className={`hidden md:block ${me?.role === "admin" ? "opacity-50 pointer-events-none" : ""}`}>
            <NavItem
              label="نمودارها"
              icon="/assets/images/dashboard/icons/chart.svg"
              hasSubMenu
              isOpen={menuToggle === 11} // Note: ID 11 was duplicated in original code for Stories and Charts. Assuming logic handles it or needs unique ID. Kept as is for logic consistency.
              onClick={() => toggleHandler(11)}
              active={isActive("/dashboard/chart")}
            />
            <SubMenuContainer isOpen={menuToggle === 11}>
              <SubItem
                to="/dashboard/chart/view"
                label="بازدید سایت"
                active={pathname === "/dashboard/chart/view"}
              />
              <SubItem
                to="/dashboard/chart/thebest"
                label="ترین‌ها"
                active={pathname === "/dashboard/chart/thebest"}
              />
              <SubItem
                to="/dashboard/chart/articles"
                label="تحلیل مقالات"
                active={pathname === "/dashboard/chart/articles"}
              />
              <SubItem
                to="/dashboard/chart/users"
                label="مخاطبان"
                active={pathname === "/dashboard/chart/users"}
              />
            </SubMenuContainer>
          </div>

          {/* --- DATABASE --- */}
          <SectionLabel title="پایگاه داده" icon="/assets/icons/database_view.svg" />

          <NavItem
            to="/dashboard/upload-center"
            label="فضای ابری"
            icon="/assets/images/dashboard/icons/upload_to_cloud.svg"
            active={pathname === "/dashboard/upload-center"}
            className="hidden lg:block"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="space-y-1">
          <NavItem
            to="/dashboard/report-bug"
            label="گزارش مشکل"
            icon="/assets/images/dashboard/icons/helpIcon.svg"
            active={pathname === "/dashboard/report-bug"}
          />
          <NavItem
            to="/dashboard/profile"
            label="پروفایل"
            icon="/assets/images/dashboard/icons/setingsIcon.svg"
            active={pathname === "/dashboard/profile"}
          />
          <button
            onClick={logoutHandler}
            className="w-full group flex items-center px-3 py-1.5 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <img
              src="/assets/images/dashboard/icons/logout.svg"
              alt="logout"
              className="w-4 h-4 ml-2.5 opacity-70 group-hover:opacity-100"
            />
            <span>خروج</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
