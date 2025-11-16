import { useState, useEffect } from "react";
import styles from "../../styles/admin.module.css";
import SelectAuthor from "./SelectAuthor";
import PropTypes from "prop-types";

const SectionType = ({ selectedTemplate, sections, templates, register, authors, errors }) => {
  const [availableSections, setAvailableSections] = useState([]);

  // بروزرسانی بخش‌های قابل انتخاب بر اساس قالب انتخاب شده
  useEffect(() => {
    if (!sections || !selectedTemplate) return;

    const filteredSections = sections.filter(
      (section) => section.template && section.template._id === selectedTemplate
    );

    setAvailableSections(filteredSections);
  }, [selectedTemplate, sections]);

  if (!selectedTemplate) {
    return (
      <p className="text-[#3b80c3] mr-2 mb-4 text-[10px] animate-pulse font-semibold">
        ابتدا قالب را انتخاب کنید
      </p>
    );
  }

  // تعیین نوع قالب (جستار یا ویژه‌نامه)
  const isJostar = templates && templates.length > 1 && selectedTemplate === templates[1]?._id;
  const templateType = isJostar ? "جُستار" : "ویژه‌نامه";
  const labelText = isJostar ? "انتخاب موضوع" : "انتخاب زمینه";

  return (
    <div>
      <div className={styles.createContent_title}>
        <label className="text-[12px] mb-0" htmlFor="section">
          <span className="animate-pulse text-red-100 font-semibold">{templateType}</span> - {labelText}
        </label>
        <select
          id="section"
          className="cursor-pointer"
          name="section"
          required
          {...register("section")}
          defaultValue={localStorage.getItem("article_section") || ""}
        >
          <option value="">انتخاب بخش</option>
          {availableSections.length > 0 ? (
            availableSections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.title}
              </option>
            ))
          ) : (
            <option value="" disabled>
              هیچ بخشی برای این قالب یافت نشد
            </option>
          )}
        </select>
        {errors?.section && <p className="text-red-500 text-xs mt-1">{errors.section.message}</p>}
      </div>
      <SelectAuthor register={register} authors={authors} errors={errors} />
    </div>
  );
};

SectionType.propTypes = {
  selectedTemplate: PropTypes.string,
  sections: PropTypes.array,
  templates: PropTypes.array,
  register: PropTypes.func.isRequired,
  authors: PropTypes.array,
  errors: PropTypes.object,
  watch: PropTypes.func.isRequired,
};

export default SectionType;
