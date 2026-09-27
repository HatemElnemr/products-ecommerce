/**
 * Suspense fallback for <CategoriesSection />.
 * Uses the exact same boxes as the real loading state so nothing shifts.
 */
export default function CategoriesSkeleton() {
  return (
    <>
      <div className="flex justify-between items-baseline my-14 mb-6">
        <div className="h-7 w-52 rounded-md bg-[#E4E1D6] dark:bg-[#28332D] animate-pulse" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#1A2320] border border-[#E4E1D6] dark:border-[#28332D] rounded-lg p-5.5 h-28 animate-pulse"
          />
        ))}
      </div>
    </>
  );
}
