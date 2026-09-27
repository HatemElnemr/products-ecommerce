import React from "react";
import { useCategories } from "../../../hooks/useProducts";
import { useSearchParams } from "react-router";
import { Check, ChevronDown } from "lucide-react";

import { Listbox, Transition } from "@headlessui/react";
function formatCategoryLabel(slug) {
  if (!slug) return "All categories";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export default function CategoryFilter() {

      const { data: categoriesData, isLoading } = useCategories();
    
      const [searchParams, setSearchParams] = useSearchParams();
      const selectedCategory = searchParams.get("category") || null;
    
      const handleSelect = (category) => {
        const newParams = new URLSearchParams(searchParams);
    
        if (category) {
          newParams.set("category", category);
        } else {
          newParams.delete("category");
        }
    
        newParams.set("page", "1");
        setSearchParams(newParams);
      };
    
      const currentLabel = formatCategoryLabel(selectedCategory);
  return (
    <div>
                <h3 className="text-sm font-bold text-[#16221D] dark:text-[#EFEDE4] mb-3">
                  Category
                </h3>
                <Listbox value={selectedCategory} onChange={handleSelect}>
                  <div className="relative">
                    <Listbox.Button className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#FAF9F4] dark:bg-[#121815] border border-[#E4E1D6] dark:border-[#28332D] rounded-lg text-sm text-[#16221D] dark:text-[#EFEDE4] hover:border-[#2F6F5E] transition-colors text-left">
                      <span className="truncate">
                        {isLoading ? "Loading..." : currentLabel}
                      </span>
                      <ChevronDown className="w-4 h-4 text-[#4B5A52] dark:text-[#A9B3AC] shrink-0" />
                    </Listbox.Button>

                    <Transition
                      as={React.Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute top-full left-0 right-0 z-30 mt-1 max-h-60 overflow-auto rounded-lg bg-white dark:bg-[#1A2320] p-1 border border-[#E4E1D6] dark:border-[#28332D] shadow-lg text-sm focus:outline-none">
                        <Listbox.Option
                          value={null}
                          className={({ active, selected }) =>
                              `flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer ${
                                selected
                                  ? "bg-[#2F6F5E]/10 font-bold text-[#16221D] dark:text-[#EFEDE4]"
                                  : active
                                    ? "bg-[#FAF9F4] dark:bg-[#121815] text-[#16221D] dark:text-[#EFEDE4]"
                                    : "text-[#4B5A52] dark:text-[#A9B3AC]"
                              }`
                            }
                        >
                          {({ selected }) => (
                              <>
                                <span className="flex items-center gap-2 truncate">
                                  <span>All Categories</span>
                                </span>
                                {selected && (
                                  <Check className="w-4 h-4 text-[#1D4A3D] dark:text-[#4C8D7A] shrink-0" />
                                )}
                              </>
                            )}
                        </Listbox.Option>
                        {categoriesData?.map((cat, i) => (
                          <Listbox.Option
                            key={i}
                            value={cat}
                            className={({ active, selected }) =>
                              `flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer ${
                                selected
                                  ? "bg-[#2F6F5E]/10 font-bold text-[#16221D] dark:text-[#EFEDE4]"
                                  : active
                                    ? "bg-[#FAF9F4] dark:bg-[#121815] text-[#16221D] dark:text-[#EFEDE4]"
                                    : "text-[#4B5A52] dark:text-[#A9B3AC]"
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span className="flex items-center gap-2 truncate">
                                  <span>{formatCategoryLabel(cat)}</span>
                                </span>
                                {selected && (
                                  <Check className="w-4 h-4 text-[#1D4A3D] dark:text-[#4C8D7A] shrink-0" />
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
  )
}
