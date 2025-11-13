import { useEffect, useState } from "react";
import styles from "../../styles/admin.module.css";

const Quotation = ({ register, watch }) => {
  const [quotationShow, setQuotationShow] = useState(false);
  useEffect(() => {
    const excerpt = watch("excerpt");
    excerpt && setQuotationShow(true);
  }, [watch("excerpt")]);
  return (
    <div>
      {!quotationShow ? (
        <div className="flex items-center mr-2 mt-3">
          <input
            className="w-4 h-4 cursor-pointer hover:text-red-800"
            type="radio"
            onClick={() => setQuotationShow(!quotationShow)}
          />
          <p className="text-[11px] font-semibold pr-2">پاراگراف برگزیده‌ای وجود دارد</p>
        </div>
      ) : (
        <div className={`${styles.createContent_title} mb-10`}>
          <label className="text-[12px] mb-0" htmlFor="quotation">
            پاراگراف برگزیده
          </label>
          <textarea
            type="text"
            id="quotation"
            rows="4"
            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:border-gray-500 outline-none transition"
            {...register("excerpt")}
          />
          <div
            className={`${styles.createContent_delete_quotation} `}
            htmlFor="quotation"
            onClick={() => setQuotationShow(!quotationShow)}
          >
            حذف
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotation;
