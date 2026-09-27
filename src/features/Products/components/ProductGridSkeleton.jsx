export default function ProductGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-[#E4E1D6] dark:border-[#28332D] rounded-lg p-4 bg-white dark:bg-[#1A2320] animate-pulse"
        >
          <div className="aspect-[1/0.85] bg-gray-200 dark:bg-gray-700 rounded mb-3" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
}
