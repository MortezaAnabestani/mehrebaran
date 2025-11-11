import styles from "../../styles/admin.module.css";
import IssueNumber from "./IssueNumber";
import SectionType from "./SectionType";

const TemplateType = ({
  register,
  templates,
  sections,
  authors,
  errors,
  getValues,
  control,
  setValue,
  watch,
}) => {
  const selectedTemplate = watch("template"); // مستقیم اینجا بگیر، نیاز به useState نیست

  return (
    templates.length > 1 && (
      <div>
        <div className={styles.createContent_title}>
          <label htmlFor="template" className="text-[12px] mb-0">
            انتخاب قالب نشریه
          </label>
          <select
            required
            id="template"
            name="template"
            className="cursor-pointer"
            {...register("template", {
              required: "انتخاب قالب نشریه الزامی است",
            })}
          >
            <option className="text-gray-400" value="">
              انتخاب قالب
            </option>
            {templates.map((template, index) => (
              <option key={index} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
          {errors?.template && <p className="text-red-500 text-xs mt-1">{errors.template.message}</p>}
        </div>

        <IssueNumber
          templates={templates}
          selectedTemplate={selectedTemplate}
          register={register}
          control={control}
          errors={errors}
          getValues={getValues}
          setValue={setValue}
        />

        <SectionType
          selectedTemplate={selectedTemplate}
          templates={templates}
          sections={sections}
          authors={authors.authors}
          register={register}
          errors={errors}
          watch={watch}
        />
      </div>
    )
  );
};

export default TemplateType;
