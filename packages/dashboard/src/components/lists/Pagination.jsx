const Pagination = ({
  filters,
  handleLimitChange,
  currentPage,
  totalPages,
  total,
  goToPrevPage,
  goToNextPage,
}) => {
  return (
    <div className="flex justify-between items-center py-6">
      <div className="flex gap-4 items-center group">
        <label className="text-xs font-medium">تعداد </label>
        <select
          name="limit"
          value={filters.limit}
          onChange={handleLimitChange}
          className="px-2 py-1 rounded-md border border-red-200 focus:border-red-300 focus:outline-none"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          {currentPage}/{totalPages} از {total}
        </span>
        <div className="flex gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className={`${
              currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:text-gray-600"
            }`}
          >
            <img
              className="w-6 h-6 text-gray-300"
              src="/assets/images/dashboard/icons/rightArrow.svg"
              alt="right arrow"
            />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className={`${
              currentPage >= totalPages
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:text-gray-600"
            }`}
          >
            <img
              className="w-6 h-6 text-gray-300"
              src="/assets/images/dashboard/icons/leftArrow.svg"
              alt="left arrow"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
