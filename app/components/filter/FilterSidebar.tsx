"use client";

import React, {useEffect, useState} from "react";
import {MainCategory, SubCategory} from "@/app/types/admin/category/category";
import {FilterState} from "@/app/types/filters";
import KeyBoardArrowDownSVG from "/public/svgs/keyboard-arrow-down.svg";
import CloseSVG from "/public/svgs/close.svg";
import CheckSVG from "/public/svgs/check.svg";
import CityDropdown from "@/app/components/city/CityDropdown";
import {City} from "@/app/types/city";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

interface FilterSidebarProps {
  mainCategories: MainCategory[] | undefined;
  allSubCategories: SubCategory[] | undefined;
  citiesData: City[] | undefined;
  isCitiesDataPending: boolean;
  className?: string;
  initialFilters: FilterState;
  onClose?: () => void;
}

export default function FilterSidebar({
  mainCategories,
  allSubCategories,
  className = "",
  onClose,
  initialFilters,
  citiesData,
  isCitiesDataPending,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. LOCAL STATE
  const [localFilters, setLocalFilters] = useState<FilterState>(initialFilters);

  // 2. SYNC
  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  // --- HANDLERS ---

  // UPDATED: Only allows 1 active Main Category
  const toggleMainCategory = (catId: number) => {
    setLocalFilters(prev => {
      const isSameCategory = prev.mainCategoryId === catId;

      if (isSameCategory) {
        // If clicking the currently active one -> Deselect it AND clear subcats
        return {
          ...prev,
          mainCategoryId: null,
          subCategoryIds: [], // Clear subs because they belong to this cat
        };
      } else {
        // If clicking a NEW one -> Set it as active AND clear previous subcats
        return {
          ...prev,
          mainCategoryId: catId,
          subCategoryIds: [], // Reset subs when switching main category
        };
      }
    });
  };

  const toggleSubCategory = (subId: number) => {
    setLocalFilters(prev => {
      const isSelected = prev.subCategoryIds.includes(subId);
      const newSubIds = isSelected
        ? prev.subCategoryIds.filter(id => id !== subId)
        : [...prev.subCategoryIds, subId];

      return {...prev, subCategoryIds: newSubIds};
    });
  };

  // --- URL UPDATE LOGIC ---
  const applyFiltersToURL = (filtersToApply: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());

    // 1. Reset page
    params.delete("page");

    // 2. Main Category (Singular)
    if (filtersToApply.mainCategoryId) {
      params.set("mainCategoryId", filtersToApply.mainCategoryId.toString());
    } else {
      params.delete("mainCategoryId");
    }

    // 3. Sub Categories (Multiple)
    if (filtersToApply.subCategoryIds.length > 0) {
      params.set("subCategoryIds", filtersToApply.subCategoryIds.join(","));
    } else {
      params.delete("subCategoryIds");
    }

    // 4. Price
    if (filtersToApply.minPrice)
      params.set("minPrice", filtersToApply.minPrice);
    else params.delete("minPrice");

    if (filtersToApply.maxPrice)
      params.set("maxPrice", filtersToApply.maxPrice);
    else params.delete("maxPrice");

    // 5. Cities
    if (filtersToApply.cities.length > 0) {
      const cityIds = filtersToApply.cities.map(c => c.id).join(",");
      params.set("cityIds", cityIds);
    } else {
      params.delete("cityIds");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleApply = () => {
    applyFiltersToURL(localFilters);
    if (onClose) onClose();
  };

  const clearLocalFilters = () => {
    const emptyFilters: FilterState = {
      mainCategoryId: null, // Reset to null
      subCategoryIds: [],
      minPrice: "",
      maxPrice: "",
      cities: [],
    };
    setLocalFilters(emptyFilters);
    applyFiltersToURL(emptyFilters);
    if (onClose) onClose();
  };

  const hasActiveLocalFilters =
    localFilters.mainCategoryId !== null ||
    localFilters.minPrice !== "" ||
    localFilters.maxPrice !== "" ||
    localFilters.cities.length > 0;

  return (
    <div
      className={`bg-white p-5 rounded-2xl border border-slate-100 h-fit flex flex-col ${className}`}>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 text-lg">Szűrés</h3>
        {hasActiveLocalFilters && (
          <button
            onClick={clearLocalFilters}
            className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">
            Törlés
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-slate-400">
            <CloseSVG className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 pr-1 pb-4 space-y-8">
        {/* --- CATEGORIES --- */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Kategóriák
          </h4>
          <div className="space-y-1">
            {mainCategories?.map(cat => {
              // Check if THIS category is the single active one
              const isMainSelected = localFilters.mainCategoryId === cat.id;

              const childrenSubCategories =
                allSubCategories?.filter(
                  sub => sub.mainCategory.id === cat.id,
                ) || [];

              // Open accordion if selected
              const isOpen = isMainSelected;

              return (
                <div key={cat.id}>
                  <button
                    onClick={() => toggleMainCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isMainSelected
                        ? "bg-primary/5 text-primaryDarker"
                        : "text-slate-900 hover:bg-slate-50"
                    }`}>
                    <div className="flex items-center gap-2 text-start">
                      <span title={cat.description}>{cat.displayName}</span>
                    </div>

                    {childrenSubCategories.length > 0 && (
                      <KeyBoardArrowDownSVG
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Subcategories - Only show if parent is selected/open */}
                  {isOpen && childrenSubCategories.length > 0 && (
                    <div className="ml-4 mt-1 border-l-2 border-slate-100 pl-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {childrenSubCategories.map(sub => {
                        const isSubSelected =
                          localFilters.subCategoryIds.includes(sub.id);
                        return (
                          <button
                            key={sub.id}
                            onClick={() => toggleSubCategory(sub.id)}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors text-left ${
                              isSubSelected
                                ? "text-primaryDarker font-bold bg-slate-50"
                                : "text-slate-700 hover:text-slate-800"
                            }`}>
                            {/* Square checkbox for multiple subcats */}
                            <div
                              className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                                isSubSelected
                                  ? "bg-primary border-primary"
                                  : "border-slate-300 bg-white"
                              }`}>
                              {isSubSelected && (
                                <CheckSVG className="w-2.5 h-2.5 text-white" />
                              )}
                            </div>
                            <span title={sub.description}>
                              {sub.displayName}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/*--- CITY ---*/}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Város
          </h4>
          <CityDropdown
            value={localFilters.cities}
            onChange={selectedCities =>
              setLocalFilters({...localFilters, cities: selectedCities})
            }
            citiesData={citiesData}
            isLoading={isCitiesDataPending}
            placeholder="Pl. Budapest"
            isMulti={true}
          />
        </div>

        {/* --- PRICE --- */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Ár (Ft)
          </h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice}
              onChange={e =>
                setLocalFilters({...localFilters, minPrice: e.target.value})
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-all"
            />
            <span className="text-slate-300">-</span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice}
              onChange={e =>
                setLocalFilters({...localFilters, maxPrice: e.target.value})
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* --- CTA BUTTON --- */}
      <div className="pt-6 mt-2 border-t border-slate-50 sticky bottom-0 bg-white">
        <button
          onClick={handleApply}
          className="w-full bg-primary hover:bg-[#5b4cc4] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          Szűrés
        </button>
      </div>
    </div>
  );
}
