import styles from "../../styles/admin.module.css";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const IssueNumber = ({ templates, selectedTemplate, errors, control, setValue, getValues }) => {
  const [availableIssues, setAvailableIssues] = useState([]);

  // بروزرسانی لیست شماره‌ها بر اساس قالب انتخاب شده
  useEffect(() => {
    if (!selectedTemplate || !templates) {
      setAvailableIssues([]);
      return;
    }

    const template = templates.find((t) => t._id === selectedTemplate);
    setAvailableIssues(template?.issues || []);
  }, [selectedTemplate, templates]);

  // اگر شماره انتخاب‌شده با قالب جدید ناسازگار باشد، مقدار فیلد را پاک کن
  useEffect(() => {
    const currentIssue = getValues("issue");
    if (currentIssue && availableIssues.length > 0) {
      const exists = availableIssues.some((iss) => iss._id === currentIssue);
      if (!exists) {
        setValue("issue", "");
      }
    }
  }, [availableIssues, getValues, setValue]);

  return (
    <div className={styles.createContent_title}>
      <label className="text-[12px] mb-0" htmlFor="issue">
        <span className="animate-pulse text-red-100">
          {selectedTemplate ? (
            <span className="font-semibold">
              {templates?.length > 0 && selectedTemplate === templates[1]?._id ? "جستار" : "ویژه‌نامه"}
            </span>
          ) : (
            <span className="font-bold text-[15px]">***</span>
          )}
        </span>
        - انتخاب شماره
      </label>

      <Controller
        name="issue"
        control={control}
        rules={{ required: "شماره نشریه الزامی است" }}
        render={({ field }) => (
          <select id="issue" className="cursor-pointer" {...field} required>
            <option value="">انتخاب شماره</option>
            {selectedTemplate && availableIssues.length > 0 ? (
              availableIssues.map((issue) => (
                <option key={issue._id} value={issue._id}>
                  {` [${issue.issueNumber}] • ${issue.title} • (${issue.subTitle})`}
                </option>
              ))
            ) : (
              <option value="" disabled>
                {selectedTemplate ? "هیچ شماره‌ای برای این قالب یافت نشد" : "ابتدا قالب نشریه را مشخص کنید"}
              </option>
            )}
          </select>
        )}
      />

      {errors?.issue && <p className="text-red-500 text-xs mt-1">{errors.issue.message}</p>}
    </div>
  );
};

export default IssueNumber;
