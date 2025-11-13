import { useState, useEffect } from "react";

const SmartRelatedArticles = ({
  articles,
  selectedRelatedArticles,
  handleRelatedArticleSelection,
  removeRelatedArticle,
  tags,
  sections,
  authors,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [filters, setFilters] = useState({
    tagsFilter: "",
    section: "",
    author: "",
    template: "",
    releaseDate: "",
  });

  // **فیلتر مقالات با ترکیب جستجو و فیلترهای پویا**
  useEffect(() => {
    let results = articles?.articles;
    if (searchTerm) {
      results = results?.filter((article) => article.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filters.tagsFilter) {
      results = results?.filter((article) =>
        article.tagsFilter.some((tag) => tag._id === filters.tagsFilter)
      );
    }

    if (filters.section) {
      results = results?.filter((article) => article.section._id === filters.section);
    }

    if (filters.author) {
      results = results?.filter((article) => article.author._id === filters.author);
    }

    if (filters.template) {
      results = results?.filter((article) => article.template._id === filters.template);
    }

    if (filters.releaseDate) {
      results = results?.filter((article) => article.releaseDate === filters.releaseDate);
    }

    setFilteredArticles(results);
  }, [searchTerm, filters, articles?.articles]);

  return (
    <div className="mt-6">
      <label className="text-xs font-medium text-gray-600"> مقالات پیشنهادی</label>

      {/* **جستجو در عنوان مقالات** */}
      <input
        type="text"
        placeholder="جستجوی مقاله..."
        className="w-full px-3 py-2 mt-1 text-sm border rounded-md focus:ring-2 focus:ring-gray-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* **فیلترهای پویا** */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, tagsFilter: e.target.value })}
        >
          <option value="">بر اساس برچسب</option>
          {tags?.map((tag) => (
            <option key={tag._id}>{tag.name}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, section: e.target.value })}
        >
          <option value="">بر اساس بخش</option>
          {sections?.map((section) => (
            <option key={section._id}>{section?.title}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, author: e.target.value })}
        >
          <option value="">بر اساس نویسنده</option>
          {authors?.map((author) => (
            <option key={author._id}>{author.name}</option>
          ))}{" "}
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, template: e.target.value })}
        >
          <option value="">بر اساس قالب</option>
          {/* گزینه‌های فیلتر بر اساس قالب */}
        </select>

        <input
          type="month"
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, releaseDate: e.target.value })}
        />
      </div>

      {/* **لیست مقالات پیشنهادی** */}
      {filteredArticles?.length > 0 && (
        <ul className="mt-2 border rounded-md p-2 max-h-40 overflow-auto">
          {filteredArticles?.map((article) => (
            <li key={article._id} className="flex justify-between items-center p-2 border-b last:border-b-0">
              <div>
                <p className="text-sm font-semibold">{article.title}</p>
                <p className="text-xs text-gray-500">
                  {article.subTitle && `${article.subTitle} • `}
                  {article.author?.name && `نویسنده: ${article.author.name} • `}
                  {article.section?.title && `بخش: ${article.section.title} • `}
                  {article.releaseDate && `انتشار: ${article.releaseDate}`}
                </p>
              </div>
              <button
                className="text-green-600 text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-500 hover:text-white"
                onClick={(() => handleRelatedArticleSelection, article._id)}
              >
                + انتخاب
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* **مقالات انتخاب‌شده** */}
      {selectedRelatedArticles.length > 0 && (
        <div className="mt-3">
          <label className="text-xs font-medium text-gray-600">📌 مقالات انتخاب‌شده</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedRelatedArticles.map((articleId) => {
              const article = articles?.articles?.find((a) => a._id === articleId);
              if (!article) return null;
              return (
                <div key={articleId} className="flex items-center px-3 py-1 bg-gray-200 rounded-md">
                  <span className="text-sm text-gray-700">{article.title}</span>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => removeRelatedArticle(articleId)}
                  >
                    ✖
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartRelatedArticles;
