import { PackageX } from "lucide-react";

export default function ProductsEmpty() {
  return (
    <div className="p-16 text-center border border-dashed border-[#E4E1D6] dark:border-[#28332D] rounded-xl text-[#4B5A52] dark:text-[#A9B3AC] flex flex-col items-center">
      <PackageX className="w-10 h-10 mb-2 stroke-1" />
      <p className="font-bold text-base text-[#16221D] dark:text-[#EFEDE4]">
        No products match your search or filters.
      </p>
      <p className="text-xs mt-1">Try adjusting your filters or search terms.</p>
    </div>
  );
}
