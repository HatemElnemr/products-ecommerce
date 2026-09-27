import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import React from "react";
import { useSearchParams } from "react-router";

const SORT_OPTIONS = [
  { value: 'default', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Top rated' },
  { value: 'title-asc', label: 'Name: A to Z' },
];


export default function SortFilter() {

    const [searchParams, setSearchParams] = useSearchParams();
    const currentSort = searchParams.get("sort") || "default";

    const selectedOption = SORT_OPTIONS.find(option => option.value === currentSort) || SORT_OPTIONS[0]

    const handleSelect = (option) => {
        const newParams = new URLSearchParams(searchParams);
        if(option.value !== "default") {
            newParams.set("sort", option.value);
        } else {
            newParams.delete("sort");
        }
        newParams.set("page", "1")
        setSearchParams(newParams);
    }

  return (
    <div>
      <h3 className="text-sm font-bold text-[#16221D] dark:text-[#EFEDE4] mb-3">
        Sort by
      </h3>
      <Listbox value={selectedOption} onChange={handleSelect}>
        <div className="relative">
          {/* Listbox Trigger Button */}
          <Listbox.Button className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#FAF9F4] dark:bg-[#121815] border border-[#E4E1D6] dark:border-[#28332D] rounded-lg text-sm text-[#16221D] dark:text-[#EFEDE4] hover:border-[#2F6F5E] transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]">
            <span className="truncate">{selectedOption.label}</span>
            <ChevronDown className="w-4 h-4 text-[#4B5A52] dark:text-[#A9B3AC] shrink-0" />
          </Listbox.Button>

          {/* Listbox Options Menu */}
          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute top-full left-0 right-0 z-30 mt-1 max-h-60 overflow-auto rounded-lg bg-white dark:bg-[#1A2320] p-1 border border-[#E4E1D6] dark:border-[#28332D] shadow-lg text-sm focus:outline-none">
              {SORT_OPTIONS.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option}
                  className={({ active, selected }) =>
                    `flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer transition-colors ${
                      selected
                        ? 'bg-[#2F6F5E]/10 font-bold text-[#16221D] dark:text-[#EFEDE4]'
                        : active
                        ? 'bg-[#FAF9F4] dark:bg-[#121815] text-[#16221D] dark:text-[#EFEDE4]'
                        : 'text-[#4B5A52] dark:text-[#A9B3AC]'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className="truncate">{option.label}</span>
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
  );
}
