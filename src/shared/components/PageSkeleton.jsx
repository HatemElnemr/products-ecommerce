/**
 * Route-level Suspense fallback (shared between the Landing and Products routes).
 * Mimics a full page layout so nothing jumps when the real page chunk arrives.
 */
export default function PageSkeleton() {
  return (
    <main
      className="max-w-275 mx-auto px-5 py-9 pb-16"
      role="status"
      aria-label="Loading page"
    >
      {/* Page title */}
      <div className="h-8 w-40 rounded-md bg-[#E4E1D6] dark:bg-[#28332D] animate-pulse mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-stretch">
        {/* Text block */}
        <div className="flex flex-col justify-center gap-4 py-6">
          <div className="h-3 w-24 rounded bg-[#E4E1D6] dark:bg-[#28332D] animate-pulse" />
          <div className="h-10 w-3/4 rounded-md bg-[#E4E1D6] dark:bg-[#28332D] animate-pulse" />
          <div className="h-4 w-full rounded bg-[#E4E1D6] dark:bg-[#28332D] animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-[#E4E1D6] dark:bg-[#28332D] animate-pulse" />
          <div className="h-11 w-40 rounded-md bg-[#E4E1D6] dark:bg-[#28332D] animate-pulse mt-2" />
        </div>

        {/* Visual banner */}
        <div className="aspect-[4/3.2] md:aspect-auto min-h-95 rounded-xl bg-[#E4E1D6] dark:bg-[#28332D] animate-pulse" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 rounded-lg bg-[#E4E1D6] dark:bg-[#28332D] animate-pulse"
          />
        ))}
      </div>
    </main>
  );
}
