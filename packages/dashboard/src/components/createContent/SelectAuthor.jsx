import styles from "../../styles/admin.module.css";
import PropTypes from "prop-types";

const SelectAuthor = ({ register, authors, errors }) => {
  return (
    <div className={styles.createContent_title}>
      <label className="text-[12px] mb-0" htmlFor="author">
        انتخاب نویسنده
      </label>
      <select
        id="author"
        className="cursor-pointer"
        name="author"
        required
        {...register("author")}
        defaultValue={localStorage.getItem("article_author") || ""}
      >
        <option className="text-gray-400" value="">
          انتخاب نویسنده
        </option>
        {authors?.map((author, index) => (
          <option key={index} value={author._id}>
            {author.name}
          </option>
        ))}
      </select>
      {errors?.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
    </div>
  );
};

SelectAuthor.propTypes = {
  register: PropTypes.func.isRequired,
  authors: PropTypes.array,
  errors: PropTypes.object,
};

export default SelectAuthor;
