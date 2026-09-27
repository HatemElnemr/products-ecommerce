import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";

import SortFilter from "./SortFilter";
import CategoryFilter from "./CategoryFilter";
import { useSearchParams } from "react-router";



export default function FilterSideBar() {

    const [searchParams, setSearchParams] = useSearchParams();

    // Mobile toggle state. The panel is always visible on md+ (`md:block`),
    // so closing it on a small screen never hides it on a bigger screen.
    const [isOpen, setIsOpen] = useState(true);

    const hasActiveFilters = searchParams.has('search') || searchParams.has('category') || searchParams.has('sort') || (searchParams.has('page') && searchParams.get('page') !== '1');

    const handleResetFilters = () => {
        setSearchParams({});
    }

  return (
    <aside className="bg-white dark:bg-[#1A2320] border border-[#E4E1D6] dark:border-[#28332D] rounded-lg p-5 md:sticky md:top-20">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="filters-panel"
        className="flex md:hidden w-full items-center justify-between font-bold text-sm text-[#16221D] dark:text-[#EFEDE4]"
      >
        <span className="flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filters
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id="filters-panel"
        className={`mt-4 md:mt-0 space-y-4 md:block ${isOpen ? "" : "hidden"}`}
      >
        {/* Category Filter */}
        <CategoryFilter />


        {/* Sort Filter */}
        <SortFilter />

        {/* Reset Action */}
        <button onClick={handleResetFilters} disabled={!hasActiveFilters} className="text-[#2F6F5E] dark:text-[#4C8D7A] font-bold text-xs hover:underline pt-1 block">
          Reset filters
        </button>
      </div>
    </aside>
  );
}
