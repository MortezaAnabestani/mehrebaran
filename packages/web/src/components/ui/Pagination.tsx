"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import SmartButton from "./SmartButton";

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
    <nav className="flex items-center justify-center space-x-2" dir="ltr">
      <Link
        href={createPageURL(currentPage - 1)}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1 ? "pointer-events-none text-gray-400" : "hover:bg-gray-200"
        }`}
        aria-disabled={currentPage === 1}
      >
        <SmartButton rightIcon className="h-5 w-5" />
      </Link>

      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <Link
            key={index}
            href={createPageURL(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page ? "bg-mblue text-white" : "hover:bg-gray-200"
            }`}
          >
            {page}
          </Link>
        ) : (
          <span key={index} className="px-3 py-1">
            {page}
          </span>
        )
      )}

      <Link
        href={createPageURL(currentPage + 1)}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages ? "pointer-events-none text-gray-400" : "hover:bg-gray-200"
        }`}
        aria-disabled={currentPage === totalPages}
      >
        <SmartButton leftIcon className="h-5 w-5" />
      </Link>
    </nav>
  );
}
