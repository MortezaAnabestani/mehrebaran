import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Search from "../components/lists/Search";
import { convertToPersianTime } from "../utils/convertTime";
import { toPersianDigits } from "../utils/useConvertNumbersToPersian";

const Header = ({ sidebarOpen, setSidebarOpen, role, me }) => {
  const rootUrl = `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/`;

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

  return (
    <nav className="bg-white border-b border-gray-200 w-full z-50">
      <div className="px-2 py-2 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            <button
              id="toggleSidebarMobile"
              aria-expanded="true"
              aria-controls="sidebar"
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <img
                src="/assets/images/dashboard/icons/burgerIcon.svg"
                id="toggleSidebarMobileHamburger"
                className="w-6 h-6"
                alt="Menu"
              />
            </button>
            <Link
              rel="preconnect"
              prefetch={true}
              to="#"
              className="text-xl font-bold flex items-center mr-3 lg:ml-2.5"
            >
              <span className="self-center text-[14px] whitespace-nowrap">پنل مدیریت</span>
              <img
                src="/assets/images/site/sections/brandShortTitle.svg"
                className="h-12 mr-2 ml-2"
                alt="vaghaye etefaghie Logo"
              />
            </Link>
            <div className="hidden lg:block">
              <Search />
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden lg:flex items-center">
              <div className="ml-6 text-sm">
                {toPersianDigits(convertToPersianTime(new Date(), "DD MMMM YYYY"))}
              </div>
            </div>
            <div className="mr-4">
              <div className="flex gap-x-2">
                <div className="hidden lg:flex flex-col justify-center items-end">
                  <span className="font-bold text-[10px] text-red-500">{me?.name}</span>
                  <span className="font-semibold text-[10px]">{me?.role === "admin" ? "ادمین" : "مدیر"}</span>
                </div>
                <Link rel="preconnect" prefetch={true} to={`profile/${me?._id}`}>
                  <img
                    src={me?.avatar ? rootUrl + me?.avatar : "/assets/images/dashboard/icons/user_shield.svg"}
                    alt="profile icon"
                    className="w-7 h-7 rounded-full shadow-sm shdow-black cursor-pointer border-2 border-gray-300 hover:scale-110 duration-200"
                  />
                </Link>
              </div>
            </div>
            <Link rel="preconnect" prefetch={true} target="_blank" to="Https://vaqayet.com" className="hidden lg:block mr-2 cursor-pointer">
              <img
                src="/assets/images/dashboard/icons/viewSite.svg"
                alt="veiw site icon"
                className="w-8 h-8"
              />
            </Link>
            <button
              onClick={() => logoutHandler()}
              className="block sm:inline-flex lg:ml-5 items-center mr-3 cursor-pointer hover:scale-108 duration-150"
            >
              <img
                loading="lazy"
                src="/assets/images/dashboard/icons/logout.svg"
                alt="logout"
                className="w-6 h-6 ml-2"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
