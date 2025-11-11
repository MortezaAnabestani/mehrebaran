import { useEffect, useState } from "react";
import styles from "../../styles/admin.module.css";

const TitleAndSubtitle = ({ register, watch }) => {
  const [subtitleShow, setSubtitleShow] = useState(false);

  useEffect(() => {
    const subTitle = watch("subTitle");
    subTitle && setSubtitleShow(true);
  }, [watch("subTitle")]);

  return (
    <div>
      <div className={styles.createContent_title}>
        <label className="text-[12px] mb-0" htmlFor="title">
          عنوان
        </label>
        <input
          type="text"
          id="title"
          className="w-full px-4 py-2 border rounded-md border-gray-300  h-10"
          required
          {...register("title")}
        />
      </div>
      {!subtitleShow ? (
        <div className="flex items-center mr-2">
          <input
            className="w-4 h-4 cursor-pointer"
            type="radio"
            onClick={() => setSubtitleShow(!subtitleShow)}
          />
          <p className="text-[11px] font-semibold pr-2">به زیرعنوان نیاز دارم</p>
        </div>
      ) : (
        <div className={`${styles.createContent_title} mb-10`}>
          <label className="text-[12px] mb-0" htmlFor="subTitle">
            زیرعنوان
          </label>
          <input
            type="text"
            id="subTitle"
            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:border-gray-500 outline-none transition h-10"
            {...register("subTitle")}
          />
          <div
            className={`${styles.createContent_delete}`}
            htmlFor="subTitle"
            onClick={() => setSubtitleShow(!subtitleShow)}
          >
            حذف
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleAndSubtitle;
