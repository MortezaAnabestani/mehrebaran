import { Link } from "react-router-dom";
import useFaqForm from "../../hooks/useFaqForm";

const CreateFAQ = () => {
  const { register, handleSubmit, onSubmit, errors, alerts, loading, error, setAlerts } = useFaqForm();

  return (
    <div>
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-md lg:text-xl font-medium">اضافه‌کردن سوال پرتکرار جدید</h2>
          <Link
            rel="preconnect"
            to="/dashboard/faqs"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 text-sm lg:text-md animate-pulse animate-thrice animate-ease-in-out">
              فهرست سوالات پرتکرار
            </span>
          </Link>
        </div>
      </div>
      <div className="p-4 ">
        {alerts && (
          <p
            className={`text-sm p-3 font-semibold text-center border ${
              error ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
            } mb-3 animate-fade-out rounded-sm text-gray-800`}
          >
            {alerts}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} onMouseDown={() => setAlerts(null)}>
          <div className="grid grid-cols-1 mb-3 gap-4">
            <div className="flex flex-col gap-y-2">
              <label htmlFor="question" className="block text-xs font-medium text-gray-400">
                پرسش
              </label>
              <textarea
                required
                type="text"
                name="question"
                rows="5"
                placeholder="چگونه می‌توانم با وقایع همکاری داشته باشم؟"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400"
                id="question"
                {...register("question")}
              />
              <p className="text-xs text-red-500">{errors.title?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="answer" className="block text-xs font-medium text-gray-400">
                پاسخ
              </label>
              <textarea
                required
                type="text"
                name="answer"
                rows="10"
                placeholder="از طریق تماس با شماره‌های ..."
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400"
                id="answer"
                {...register("answer")}
              />
              <p className="text-xs text-red-500">{errors.titleEn?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="order" className="block text-xs font-medium text-gray-400">
                اولویت
              </label>
              <select
                name="order"
                id="order"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400"
                {...register("order")}
              >
                <option value={null}>انتخاب اولویت</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, index) => (
                  <option key={index} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-left">
            <button
              type="submit"
              className="px-3 py-[10px] w-full bg-gray-600 rounded-md hover:bg-gray-700 text-white cursor-pointer"
            >
              {loading ? "در حال ارسال..." : "ثبت سوال جدید"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFAQ;
