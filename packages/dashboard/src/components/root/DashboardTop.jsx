import { Calendar } from "react-multi-date-picker";
import { Link } from "react-router-dom";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/colors/red.css";

const DashboardTop = ({ selectedArticle, selectedIssue, selectedComments }) => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center justify-around gap-2">
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

        <div className="hidden lg:block shadow-md border-2 border-gray-300 shadow-gray-300 rounded-sm lg:w-[23%]">
          <h1 className="text-center text-xs bg-black text-white py-2 border-b-2 border-b-gray-300">
            آخرین شماره
          </h1>

          <img
            src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${selectedIssue?.coverImage}`}
            alt="issue image"
            className="w-full object-cover h-[120px] rounded-t-sm"
          />
          <h4 className="py-2 text-xs font-bold text-center bg-red-600 text-white">{selectedIssue?.title}</h4>
          <p className="p-2 text-xs text-justify h-[80px]">
            {selectedIssue?.description?.substring(0, 150) + "..."}
          </p>
          <div className="flex items-center justify-between p-2 rounded-b-sm bg-black text-white">
            <div className="flex items-center gap-2">
              {selectedIssue?.authors?.map((author, index) => {
                if (index < 3) {
                  return (
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${author?.avatar}`}
                      alt="image"
                      className="h-7 w-7 object-cover hover:animate-spin rounded-full border border-white"
                    />
                  );
                }
              })}
            </div>
            <Link
              rel="preconnect"
              prefetch={true}
              className="text-xs py-1 px-2 border border-white"
              to={"/dashboard/issues"}
            >
              فهرست             </Link>
          </div>
        </div>
        <div className="hidden lg:block shadow-md border-2 border-gray-300 shadow-gray-300 lg:w-[23%]">
          <h1 className="text-center text-xs bg-black text-white py-2 border-b-2 border-b-gray-300">
            آخرین مقاله
          </h1>
          <img
            src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${selectedArticle?.coverImage}`}
            alt="article image"
            className="w-full object-cover h-[120px] rounded-t-sm"
          />
          <h4 className="py-2 text-xs font-bold text-center bg-red-600 text-white">
            {selectedArticle?.title}
          </h4>
          <p
            className="p-2 text-xs text-justify h-[80px]"
            dangerouslySetInnerHTML={{ __html: selectedArticle?.content?.substring(0, 180) + "..." }}
          ></p>
          <div className="flex items-center justify-between px-2 rounded-b-sm bg-black text-white">
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${
                  selectedArticle?.author?.avatar
                }`}
                alt="image"
                className="h-8 w-8 object-cover hover:animate-spin rounded-full m-1 border-2 border-white"
              />
              <p className="text-[9px]">{selectedArticle?.author?.name}</p>
            </div>
            <Link
              rel="preconnect"
              prefetch={true}
              className="text-xs py-1 px-2 border border-white w-23 text-center"
              to={"/dashboard/articles"}
            >
              فهرست 
            </Link>
          </div>
        </div>
        <div className="shadow-md border-2 border-gray-300 shadow-gray-300 rounded-sm h-[300px] lg:w-[23%]">
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
