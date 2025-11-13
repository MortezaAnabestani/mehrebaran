import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteFaq, fetchFaqs } from "../../features/faqsSlice";

const FAQs = () => {
  const dispatch = useDispatch();
  const { faqs } = useSelector((state) => state.faqs);

  const deleteHandler = (id) => {
    dispatch(deleteFaq(id)).then(dispatch(fetchFaqs()));
  };
  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  return (
    <div>
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">فهرست سوالات پرتکرار</h2>
          <Link
            rel="preconnect"
            to="/dashboard/faqs/create"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 animate-pulse animate-thrice animate-ease-in-out">
              اضافه‌کردن سوال جدید
            </span>
          </Link>
        </div>
      </div>
      {!faqs.length > 0 ? (
        <div className="mt-5 p-4">
          <p className="font-bold">هنوز سوال پرتکراری ثبت نشده است</p>
          <p className="mt-2">{`از این مسیر برای ثبت سوال پرتکرار اقدام کنید: سوالات پرتکرار ← ایجاد پرسش و پاسخ جدید `}</p>
        </div>
      ) : (
        <div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white mb-5 mt-5  shadow-sm shadow-gray-300 border rounded-md border-gray-100 "
            >
              <div className="flex items-center justify-between mb-2 p-3 border-b border-gray-200 bg-linear-to-l from-red-600 via-red-400 to-red-300">
                <div className="flex items-center gap-2 h-12">
                  <img
                    src="/assets/images/dashboard/icons/ask_question.svg"
                    alt="ask question"
                    className="h-5 w-5"
                  />
                  <h4 className="text-sm font-semibold text-white">{faq.question}</h4>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded-sm shadow">
                  <img
                    src="/assets/images/dashboard/icons/sorting.svg"
                    alt="ask question"
                    className="h-5 w-5"
                  />
                  <p>{faq.order}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2 p-3 ">
                <img
                  src="/assets/images/dashboard/icons/stack_exchange.svg"
                  alt="ask question"
                  className="h-5 w-5"
                />
                <p className="text-justify ">{faq.answer}</p>
              </div>
              <div className="bg-gray-100 shadow border-t border-gray-200 flex items-center justify-between w-full p-3">
                <div className="flex w-full justify-end gap-5 text-gray-500 pl-1">
                  <Link
                    rel="preconnect"
                    prefetch={true}
                    to={`https://vaqayet.com/faqs`}
                    className="relative group  hover:scale-110 duration-200"
                  >
                    <span className="absolute top-[-17px] left-[11px] transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      دیدن
                    </span>
                    <img
                      loading="lazy"
                      className="w-6 h-5"
                      src="/assets/images/dashboard/icons/eye.svg"
                      alt="eye icon"
                    />
                  </Link>
                  <Link
                    rel="preconnect"
                    prefetch={true}
                    to={`edit/${faq._id}`}
                    className="relative group hover:scale-110 duration-200"
                  >
                    <span className="absolute top-[-17px] left-[11px] transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      ویرایش
                    </span>
                    <img
                      loading="lazy"
                      className="w-6 h-5"
                      src="/assets/images/dashboard/icons/replace.svg"
                      alt="edit icon"
                    />
                  </Link>
                  <Link
                    rel="preconnect"
                    onClick={() => deleteHandler(faq._id)}
                    className="relative group hover:scale-110 duration-200"
                  >
                    <span className="absolute top-[-17px] left-[11px] transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQs;
