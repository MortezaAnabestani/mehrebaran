import { useState, useEffect } from "react";

const RelatedArticles = ({
  articles,
  selectedRelatedArticles,
  handleRelatedArticleSelection,
  removeRelatedArticle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  // **فیلتر مقالات بر اساس جستجو**
  useEffect(() => {
    if (!searchTerm) {
      setFilteredArticles([]);
      return;
    }

    const filtered = articles?.articles?.filter(
      (article) =>
        article?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        (article?.subTitle && article?.subTitle?.toLowerCase()?.includes(searchTerm?.toLowerCase())) ||
        (article?.author && article?.author?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())) ||
        (article?.section && article?.section?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
    );

    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  return (
    <div>
      <label className="text-xs font-medium text-gray-600"> مقالات مرتبط</label>

      {/* **فیلد جستجو** */}
      <input
        type="text"
        placeholder="جستجوی مقاله..."
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* **لیست مقالات فیلترشده** */}
      {filteredArticles?.length > 0 && (
        <ul
          className="mt-1 border border-gray-300 shadow-md rounded-sm p-2 max-h-40 overflow-auto"
          onBlur={() => setFilteredArticles("")}
        >
          {filteredArticles.map((article) => (
            <li
              key={article._id}
              className="flex justify-between items-center p-2 border-b-2 border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-100"
            >
              <div>
                <p className="text-sm font-medium">{article?.title}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {article?.subTitle && `زیرعنوان: ${article?.subTitle} • `}
                  {article?.author?.name && `نویسنده: ${article?.author?.name} • `}
                  {article?.section?.title && `بخش: ${article?.section?.title} • `}
                </p>
              </div>
              <button
                className="text-green-600 text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-500 hover:text-white"
                onClick={(e) => e.preventDefault() & handleRelatedArticleSelection(article._id)}
              >
                + انتخاب
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* **مقالات انتخاب‌شده** */}
      {selectedRelatedArticles?.length > 0 && (
        <div className="mt-6 ">
          <div className="flex flex-wrap gap-2 rounded-sm">
            {selectedRelatedArticles?.map((articleId) => {
              const article = articles?.articles?.find((a) => a._id === articleId);
              if (!article) return null;
              return (
                <div key={articleId} className="flex items-center px-3 py-1 bg-gray-200 rounded-md">
                  <span className="text-sm text-gray-700"> {article?.title} </span>
                  <span className="text-sm text-gray-700">{article?.subTitle}</span>
                  <button
                    className="mr-2 text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={(e) => e.preventDefault() & removeRelatedArticle(articleId)}
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

export default RelatedArticles;
