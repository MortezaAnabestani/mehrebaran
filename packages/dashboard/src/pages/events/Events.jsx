import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, fetchEvents } from "../../features/eventsSlice";
import { Link } from "react-router-dom";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";
import UTMLinkGeneratorForCards from "../../components/lists/UTMLinkGeneratorForCards";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const Events = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const [selectedThing, setSelectedThing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch, setIsModalOpen]);

  const openDeleteModal = (event) => {
    setSelectedThing(event);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedThing) {
      try {
        await dispatch(deleteEvent(selectedThing.slug)).unwrap();
        dispatch(fetchEvents());
      } catch (error) {
        console.error(" خطا در حذف رویداد:", error);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className={`ml-3 ${isModalOpen && "blur-xs"}`}>
        <div className="bg-white rounded-md ">
          <div className="flex items-center justify-between p-4">
            <h2 className="flex gap-3 lg:text-xl text-sm font-medium">فهرست رویدادها</h2>
            <Link
              rel="preconnect"
              to="/dashboard/events/create"
              className="px-3 py-[6px] text-xs lg:text-lg bg-gray-600 rounded-md hover:bg-gray-700 text-white"
            >
              <span className="text-slate-50 w-1 text-base animate-ease-in-out">اضافه‌کردن رویداد جدید</span>
            </Link>
          </div>
        </div>
        {events.length === 0 ? (
          <div className="mt-5 p-4">
            <p className="font-bold">هنوز رویدادی ثبت نشده است</p>
            <p className="mt-2">{`از این مسیر برای ثبت رویداد اقدام کنید: رویدادها ← ایجاد رویداد جدید `}</p>
          </div>
        ) : (
          <div>
            <ul className="overflow-hidden hidden lg:block sm:rounded-md max-w-full lg:max-w-4xl mx-auto w-260">
              {events?.map((event, index) => {
                return (
                  <li
                    key={index}
                    className="border-gray-200 relative m-5 mt-7 mb-9 bg-white shadow-sm border rounded-sm"
                  >
                    <div className="flex flex-col gap-1 items-center justify-around px-3">
                      <div className="w-full py-2 flex justify-between items-center border-b border-gray-300">
                        <Link rel="preconnect" prefetch={true} to={`edit/${event?.slug}`}>
                          <div className="flex items-center gap-2">
                            <h1 className="text-xs font-medium text-gray-400">عنوان:</h1>
                            <span className="text-gray-800 font-semibold text-sm">{event?.title}</span>
                          </div>
                        </Link>
                        <div className="flex items-center gap-2 ">
                          <p className="text-xs font-medium text-gray-400">
                            تاریخ برگزاری:
                            <span className="text-red-600 text-sm">
                              {toPersianDigits(convertToPersianTime(event?.date, "YYYY/MM/DD"))}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-5 text-gray-500 -translate-y-3">
                          <Link
                            rel="preconnect"
                            prefetch={true}
                                                          target="_blank"
                            to={`https://vaqayet.com/event/${event.slug}`}
                            className="relative group hover:scale-110 duration-200"
                          >
                            <span className="transform text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                            to={`edit/${event?.slug}`}
                            className="relative group hover:scale-110 duration-200"
                          >
                            <span className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                            onClick={() => openDeleteModal(event)}
                            className="relative group hover:scale-110 duration-200"
                          >
                            <span className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                      <div>
                        <p className="text-xs my-6 text-justify font-medium text-gray-400">
                          توضیحات رویداد:
                          <span className="text-xs text-gray-900 leading-relaxed">{event?.description}</span>
                        </p>
                      </div>
                      <div className="w-full flex items-center justify-around gap-1 pb-2">
                        {event?.images?.map((image, index) => {
                          if (index <= 12) {
                            return (
                              <span key={index}>
                                <img
                                  src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${image}`}
                                  alt={image}
                                  className="w-25 h-50 object-cover rounded-t-full border border-gray-200 shadow-xs shadow-black hover:scale-105 duration-200"
                                />
                              </span>
                            );
                          }
                        })}
                      </div>
                    </div>
                    <UTMLinkGeneratorForCards page="event" slug={event.slug} />
                  </li>
                );
              })}
            </ul>
            {/* Content List mobile sizes*/}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {events?.map((event, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg flex flex-col">
                  {event?.images?.map((image, index) => (
                    <div key={index}>
                      <img
                        className="w-full h-15 opacity-70 object-cover rounded-md hover:h-60 hover:opacity-100 duration-300 border-b-2 shadow-sm shadow-black "
                        src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${image}`}
                        alt={event?.title}
                      />
                    </div>
                  ))}
                  <p className="text-xs text-red-500 mx-auto mt-3 mb-1">
                    * برای مشاهدۀ هر عکس در ابعاد بزرگ‌تر، روی آن ضربه بزنید.
                  </p>
                  <div className="mr-2 flex flex-col justify-around p-2">
                    <h1 className="text-xs font-medium text-gray-400 mb-1">
                      عنوان اصلی رویداد:
                      <span className="text-gray-800 font-semibold mr-1 text-md">{event?.title}</span>
                    </h1>
                    <p className="text-xs font-medium text-gray-400">
                      تاریخ برگزاری رویداد :
                      <span className="text-red-600 text-sm">
                        {toPersianDigits(convertToPersianTime(event?.date, "YYYY/MM/DD"))}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 p-2 text-justify">
                      توضیحات: <span className="text-sm">{event?.description}</span>
                    </p>
                  </div>
                  <div className="flex justify-between gap-2 pb-1 px-1">
                    <Link
                      rel="preconnect"
                                                    target="_blank"
                      to={`https://vaqayet.com/event/${event.slug}`}
                      className="flex-1 text-center text-sm text-white bg-gray-500 py-2 rounded-md hover:bg-gray-800"
                    >
                      دیدن
                    </Link>
                    <Link
                      rel="preconnect"
                      to={`edit/${event?.slug}`}
                      className="flex-1 text-center text-sm text-black border border-gray-700 py-2 rounded-md hover:border-gray-800"
                    >
                      ویرایش
                    </Link>
                    <Link
                      rel="preconnect"
                      onClick={() => openDeleteModal(event)}
                      className="flex-1 text-center text-sm text-white bg-red-500 py-2 rounded-md hover:bg-red-600"
                    >
                      حذف
                    </Link>
                  </div>
                  <UTMLinkGeneratorForCards page="event" slug={event.slug} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={`آیا از حذف رویداد "${selectedThing?.title}" مطمئن هستید؟`}
      />
    </div>
  );
};

export default Events;
