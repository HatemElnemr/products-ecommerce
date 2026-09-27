export default function CategoriesSection({ categories = [], isLoading = false }) {
  return (
    <>
      <div className="flex justify-between items-baseline my-14 mb-6">
        <h2 className="font-serif text-2xl font-bold text-[#16221D] dark:text-[#EFEDE4]">
          Shop by category
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1A2320] border border-[#E4E1D6] dark:border-[#28332D] rounded-lg p-5.5 h-28 animate-pulse"
              />
            ))
          : categories.map((cat, idx) => (
              <div
                key={cat.slug || idx}
                className="bg-white dark:bg-[#1A2320] border border-[#E4E1D6] dark:border-[#28332D] rounded-lg p-5.5 cursor-pointer hover:border-[#2F6F5E] transition-colors"
              >
                <div className={`w-8.5 h-8.5 rounded-lg mb-3.5 ${cat.dotBg}`} />
                <h3 className="font-serif font-bold text-base text-[#16221D] dark:text-[#EFEDE4] mb-1">
                  {cat.title}
                </h3>
                <span className="text-[#4B5A52] dark:text-[#A9B3AC] text-sm">
                  {cat.count}
                </span>
              </div>
            ))}
      </div>
    </>
  );
}
