import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/red.css";

const CalendarPage = () => {
  return (
    <div className="hidden lg:flex w-full h-full align-center justify-center">
      <div className="relative">
        <Calendar
          className="red"
          fullYear
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
        />
        <div className="absolute right-[-100px] text-red-100 top-[-25px] text-[35px] animate-pulse">*</div>
        <div className="absolute text-red-100 left-[-50px] top-[45px] ml-1 animate-pulse text-[45px]">*</div>
        <div className="absolute text-red-100 left-[-150px] top-[100px] ml-1 animate-pulse text-[82px]">
          *
        </div>
        <div className="absolute text-red-100 right-[-50px] top-[460px] ml-1 animate-pulse text-[35px]">
          *
        </div>
        <div className="absolute text-red-100 left-[-200px] top-[327px] ml-1 animate-pulse text-[21px]">
          *
        </div>
        <div className="absolute text-red-100 right-[-200px] top-[123px] ml-1 animate-pulse text-[65px]">
          *
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
