import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSections } from "../../features/sectionsSlice";
import { Link } from "react-router-dom";

const Sections = () => {
  const { sections } = useSelector((state) => state.sections);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  const selectHandler = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const filteredSections = selectedTemplate
    ? sections.filter((section) => section.template._id === selectedTemplate)
    : sections;

  return (
    <div className="ml-3">
      <div className="bg-white rounded-md ">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">فهرست دسته‌بندی محتوایی</h2>
          <Link
            rel="preconnect"
            to="#"
            className="px-3 py-[6px] text-xs hidden lg:block bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 animate-ease-in-out cursor-progress">
              برای اضافه‌کردن بخش جدید با تیم توسعه در ارتباط باشید
            </span>
          </Link>
        </div>
      </div>

      <div>
        <ul className="overflow-hidden sm:rounded-md max-w-full lg:max-w-4xl mx-auto mt-6">
          <form className="w-full flex flex-col gap-y-2 mb-4">
            <label htmlFor="template" className="block text-xs font-medium text-gray-600">
              نمایش بر اساس قالب
            </label>
            <select
              name="template"
              id="template"
              className="px3 text-sm py-2 rounded-md outline-0 border border-gray-200 shadow-md bg-gray-100 h-10"
              onChange={selectHandler}
              value={selectedTemplate}
            >
              <option value={""}>همه</option>
              {[...new Set(sections.map((section) => section.template._id))].map((templateId) => {
                const templateName = sections.find((sec) => sec.template._id === templateId)?.template.name;
                return (
                  <option key={templateId} value={templateId}>
                    {templateName}
                  </option>
                );
              })}
            </select>
          </form>
          {filteredSections.map((section) => {
            return (
              <li
                key={section._id}
                className="border-gray-200 hover:translate-1 m-1 duration-300 mb-5 bg-white shadow-sm border rounded-sm"
              >
                <div className="bg-linear-to-r from-gray-200 via-red-500 to-red-700">
                  <img
                    className="w-50 h-30 mx-auto"
                    src={`/assets/images/site/sections/${section.title}.svg`}
                    alt={section.title}
                  />
                </div>
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between flex-col lg:flex-row">
                    <h3 className="text-lg leading-6 font-semibold text-gray-900 mb-2 lg:mb-0">
                      <p className="text-sm font-medium text-gray-500">
                        عنوان بخش: <span className="text-gray-800 font-semibold">{section.title}</span>
                      </p>
                    </h3>
                    <p className="mt-1 max-w-2xl rtl text-sm text-gray-500 text-justify">
                      {section.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      قالب: <span className="text-red-600">{section.template.name}</span>
                    </p>
                    <Link
                      rel="preconnect"
                      to={`edit/${section._id}`}
                      className="font-medium text-white text-sm px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-900"
                    >
                      ویرایش
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sections;
