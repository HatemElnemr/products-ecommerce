import { Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(searchParam);

  // Sync search input if URL changes externally
  useEffect(() => {
    function handlePopState() {
      setSearchInput(searchParam);
    }

    handlePopState();
  }, [searchParam]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchParam) {
        const newParams = new URLSearchParams(searchParams);
        if (searchInput.trim()) {
          newParams.set("search", searchInput.trim());
        } else {
          newParams.delete("search");
        }
        newParams.set("page", "1");
        setSearchParams(newParams);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, searchParam, searchParams, setSearchParams]);

  return (
    <div className="relative mb-6">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5A52] dark:text-[#A9B3AC]" />
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search products… "
        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#1A2320] border border-[#E4E1D6] dark:border-[#28332D] rounded-lg text-[#16221D] dark:text-[#EFEDE4] placeholder-[#4B5A52] dark:placeholder-[#A9B3AC] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]"
      />
    </div>
  );
}
