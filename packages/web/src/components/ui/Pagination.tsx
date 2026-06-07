"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center space-x-2 space-x-reverse" aria-label="پیمایش صفحات">
      {currentPage <= 1 ? (
        <span
          className="px-2 py-2 rounded-md flex items-center justify-center pointer-events-none text-gray-400"
          aria-disabled="true"
          aria-label="صفحه قبلی"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage - 1)}
          className="px-2 py-2 rounded-md flex items-center justify-center hover:bg-gray-200 text-gray-700"
          aria-label="صفحه قبلی"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      )}

      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <Link
            key={`page-${page}`}
            href={createPageURL(page)}
            className={`px-3 py-1 rounded-md transition-colors ${
              currentPage === page ? "bg-mblue text-white font-bold" : "hover:bg-gray-200 text-gray-700"
            }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Link>
        ) : (
          <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
            {page}
          </span>
        )
      )}

      {currentPage >= totalPages ? (
        <span
          className="px-2 py-2 rounded-md flex items-center justify-center pointer-events-none text-gray-400"
          aria-disabled="true"
          aria-label="صفحه بعدی"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage + 1)}
          className="px-2 py-2 rounded-md flex items-center justify-center hover:bg-gray-200 text-gray-700"
          aria-label="صفحه بعدی"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
