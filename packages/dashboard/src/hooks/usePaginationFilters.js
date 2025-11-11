import { useState } from "react";

const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    searchQuery: "",
    status: "",
  });

  const updateFilters = (newValues) => {
    setFilters((prev) => ({
      ...prev,
      ...newValues,
      // Always reset to page 1 when changing filters (except page navigation)
      page: newValues.page !== undefined ? newValues.page : 1,
    }));
  };

  const handleStatusChange = (e) => updateFilters({ status: e.target.value });
  const handleSearchChange = (e) => updateFilters({ searchQuery: e.target.value });
  const handleLimitChange = (e) => updateFilters({ limit: parseInt(e.target.value) });

  const goToNextPage = (totalPages) => {
    if (totalPages && filters.page < totalPages) {
      updateFilters({ page: filters.page + 1 });
    }
  };

  const goToPrevPage = () => {
    if (filters.page > 1) {
      updateFilters({ page: filters.page - 1 });
    }
  };

  return {
    filters,
    handleStatusChange,
    handleSearchChange,
    handleLimitChange,
    goToNextPage,
    goToPrevPage,
    setFilters: updateFilters, // For direct filter updates if needed
  };
};

export default useFilters;
