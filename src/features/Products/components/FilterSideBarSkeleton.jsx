/**
 * Suspense fallback for <FilterSideBar />.
 * Mirrors the sidebar shell + the two filter blocks to avoid layout shift.
 */
export default function FilterSideBarSkeleton() {
  return (
    <aside
      className="bg-white dark:bg-[#1A2320] border border-[#E4E1D6] dark:border-[#28332D] rounded-lg p-5 md:sticky md:top-20"
      role="status"
      aria-label="Loading filters"
    >
      <div className="mt-4 md:mt-0 space-y-4 animate-pulse">
        {/* Category block */}
        <div>
          <div className="h-3.5 w-20 rounded bg-[#E4E1D6] dark:bg-[#28332D] mb-3" />
          <div className="h-9 w-full rounded-lg bg-[#E4E1D6] dark:bg-[#28332D]" />
        </div>

        {/* Sort block */}
        <div>
          <div className="h-3.5 w-16 rounded bg-[#E4E1D6] dark:bg-[#28332D] mb-3" />
          <div className="h-9 w-full rounded-lg bg-[#E4E1D6] dark:bg-[#28332D]" />
        </div>

        {/* Reset action */}
        <div className="h-3 w-20 rounded bg-[#E4E1D6] dark:bg-[#28332D]" />
      </div>
    </aside>
  );
}
