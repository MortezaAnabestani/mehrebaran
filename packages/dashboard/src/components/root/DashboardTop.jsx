import { Calendar } from "react-multi-date-picker";
import { Link } from "react-router-dom";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/colors/red.css";

const DashboardTop = ({ selectedComments }) => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <Calendar
          value={[
            new DateObject({ calendar: persian }).toFirstOfWeek(),
            new DateObject({ calendar: persian }).toLastOfWeek(),
          ]}
          range
          readOnly
          calendar={persian}
          locale={persian_fa}
          className="hidden lg:block red"
        />
        <div className="shadow-md border-2 border-gray-300 shadow-gray-300 rounded-sm h-[250px] lg:w-[23%] -translate-y-2">
          <h1 className="text-center text-xs py-2 border-b-2 border-b-gray-300">آخرین نظرات</h1>
          <div className="h-8/10 overflow-scroll">
            {selectedComments?.map((comment, index) => (
              <div className="flex items-center  " key={index}>
                <img
                  src="/assets/images/dashboard/icons/profileIcon.svg"
                  alt="image"
                  className="h-8 w-8 object-cover hover:animate-spin rounded-full m-1 border-2 border-white"
                />
                <p className="py-2 px-1 text-xs text-justify border-b border-gray-300">
                  <span className="font-bold text-red-600">{comment?.user} </span>
                  گفت:<span className="px-1"> {comment?.content?.substring(0, 150) + "..."}</span>
                </p>
              </div>
            ))}
          </div>

          <Link
            rel="preconnect"
            className="flex items-center justify-center text-sm p-2  bg-red-600 text-white rounded-4xl shadow"
            to={"/dashboard/comments"}
          >
            فهرست نظرات
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardTop;
