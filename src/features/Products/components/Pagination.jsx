import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-9 h-9 border border-[#E4E1D6] dark:border-[#28332D] bg-white dark:bg-[#1A2320] rounded-md flex items-center justify-center text-[#16221D] dark:text-[#EFEDE4] hover:bg-[#FAF9F4] dark:hover:bg-[#121815] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
            p === currentPage
              ? "bg-[#1D4A3D] text-white font-bold"
              : "border border-[#E4E1D6] dark:border-[#28332D] bg-white dark:bg-[#1A2320] text-[#16221D] dark:text-[#EFEDE4] hover:bg-[#FAF9F4] dark:hover:bg-[#121815]"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-9 h-9 border border-[#E4E1D6] dark:border-[#28332D] bg-white dark:bg-[#1A2320] rounded-md flex items-center justify-center text-[#16221D] dark:text-[#EFEDE4] hover:bg-[#FAF9F4] dark:hover:bg-[#121815] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
