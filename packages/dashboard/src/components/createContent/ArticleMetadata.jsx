import styles from "../../styles/admin.module.css";

const ArticleMetadata = ({ register, categories, authors, errors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* Category Selection */}
      <div className={styles.createContent_title}>
        <label htmlFor="category" className="text-[12px] mb-0">
          دسته‌بندی <span className="text-red-500">*</span>
        </label>
        <select
          required
          id="category"
          name="category"
          className="cursor-pointer"
          {...register("category")}
        >
          <option className="text-gray-400" value="">
            انتخاب دسته‌بندی
          </option>
          {categories?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors?.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
      </div>

      {/* Author Selection */}
      <div className={styles.createContent_title}>
        <label htmlFor="author" className="text-[12px] mb-0">
          نویسنده <span className="text-red-500">*</span>
        </label>
        <select
          required
          id="author"
          name="author"
          className="cursor-pointer"
          {...register("author")}
        >
          <option className="text-gray-400" value="">
            انتخاب نویسنده
          </option>
          {authors?.articles?.map((author) => (
            <option key={author._id} value={author._id}>
              {author.name}
            </option>
          ))}
        </select>
        {errors?.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
      </div>

      {/* Status Selection */}
      <div className={styles.createContent_title}>
        <label htmlFor="status" className="text-[12px] mb-0">
          وضعیت انتشار
        </label>
        <select
          id="status"
          name="status"
          className="cursor-pointer"
          {...register("status")}
        >
          <option value="draft">پیش‌نویس</option>
          <option value="published">منتشر شده</option>
          <option value="archived">بایگانی</option>
        </select>
        {errors?.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
      </div>
    </div>
  );
};

export default ArticleMetadata;
