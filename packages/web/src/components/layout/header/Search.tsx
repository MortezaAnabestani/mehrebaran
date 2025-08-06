"use client";
import { useState, KeyboardEvent, FC, FocusEvent } from "react";
import { handleSearch } from "@/utils/handleSearch";
import { useRouter } from "next/navigation";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (term: string) => void;
  className?: string;
}

const Search: FC<SearchInputProps> = ({ placeholder = "جست‌وجو...", onSearch, className }) => {
  const [term, setTerm] = useState("");
  const router = useRouter();
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => setFocused(true);
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => setFocused(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(router, term, onSearch);
    }
  };

  return (
    <div
      className={`w-[200px] h-10 flex items-center text-white max-w-md bg-tansparent rounded-xs border-2 border-white px-2 py-1.5 focus-within:border-amber-200 focus-within:animate-pulse transition-all ${className}`}
    >
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex-grow text-xs text-white outline-none bg-transparent"
        placeholder={placeholder}
        aria-label="[جست‌وجو]"
      />
      <button
        type="button"
        onClick={() => handleSearch(router, term, onSearch)}
        className={`cursor-pointer opacity-20 ${
          focused && "-translate-x-5/3 opacity-100"
        } duration-300 transition-all`}
        aria-label="شروع جستجو"
      >
        <OptimizedImage src="/icons/search.svg" alt="icon search" width={30} height={30} />
      </button>
    </div>
  );
};

export default Search;
