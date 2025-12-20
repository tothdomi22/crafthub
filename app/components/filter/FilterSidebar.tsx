"use client";

import React, {useEffect, useState} from "react";
import {MainCategory, SubCategory} from "@/app/types/admin/category/category";
import {FilterState} from "@/app/types/filters";
import KeyBoardArrowDownSVG from "/public/svgs/keyboard-arrow-down.svg";
import CloseSVG from "/public/svgs/close.svg";
import CheckSVG from "/public/svgs/check.svg";
import CityDropdown from "@/app/components/city/CityDropdown";
import {City} from "@/app/types/city";

interface FilterSidebarProps {
  mainCategories: MainCategory[] | undefined;
  allSubCategories: SubCategory[] | undefined;
  citiesData: City[] | undefined;
  isCitiesDataPending: boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  className?: string;
  onClose?: () => void;
}

export default function FilterSidebar({
  mainCategories,
  allSubCategories,
  filters,
  setFilters,
  className = "",
  onClose,
  citiesData,
  isCitiesDataPending,
}: FilterSidebarProps) {
  // 1. LOCAL STATE: Tracks changes before they are applied
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // 2. SYNC: If parent filters change (e.g. user clears filters from the empty state view), sync local state
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // --- HANDLERS (Modifying Local State Only) ---

  const toggleMainCategory = (catId: number) => {
    setLocalFilters(prev => {
      const isSelected = prev.mainCategoryIds.includes(catId);
      let newMainIds;

      if (isSelected) {
        newMainIds = prev.mainCategoryIds.filter(id => id !== catId);

        // Remove child subcategories to avoid stale state
        const childSubIds =
          allSubCategories
            ?.filter(sub => sub.mainCategory.id === catId)
            .map(sub => sub.id) || [];

        const newSubIds = prev.subCategoryIds.filter(
          id => !childSubIds.includes(id),
        );

        return {
          ...prev,
          mainCategoryIds: newMainIds,
          subCategoryIds: newSubIds,
        };
      } else {
        newMainIds = [...prev.mainCategoryIds, catId];
        return {...prev, mainCategoryIds: newMainIds};
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

  // Clears local inputs
  const clearLocalFilters = () => {
    const emptyState = {
      mainCategoryIds: [],
      subCategoryIds: [],
      minPrice: "",
      maxPrice: "",
      cities: [],
    };
    // 2. Update local state (visuals)
    setLocalFilters(emptyState);

    // 3. Update parent state immediately (triggers API)
    setFilters(emptyState);

    // Optional: Close the mobile drawer if open
    if (onClose) onClose();
  };

  // 3. APPLY: The function that actually triggers the API call
  const handleApply = () => {
    setFilters(localFilters);
    if (onClose) onClose(); // Close mobile drawer if open
  };

  const hasActiveLocalFilters =
    localFilters.mainCategoryIds.length > 0 ||
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

      <div className="flex-1  pr-1 pb-4 space-y-8">
        {/* --- CATEGORIES --- */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Kategóriák
          </h4>
          <div className="space-y-1">
            {mainCategories?.map(cat => {
              const isMainSelected = localFilters.mainCategoryIds.includes(
                cat.id,
              );

              const childrenSubCategories =
                allSubCategories?.filter(
                  sub => sub.mainCategory.id === cat.id,
                ) || [];

              const hasSelectedChildren = childrenSubCategories.some(sub =>
                localFilters.subCategoryIds.includes(sub.id),
              );

              const isOpen = isMainSelected || hasSelectedChildren;

              return (
                <div key={cat.id}>
                  <button
                    onClick={() => toggleMainCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isMainSelected
                        ? "bg-primary/5 text-primaryDarker"
                        : "text-slate-900 hover:bg-slate-50"
                    }`}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isMainSelected
                            ? "bg-primary border-primary"
                            : "border-slate-300 bg-white"
                        }`}>
                        {isMainSelected && (
                          <CheckSVG className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span>{cat.displayName}</span>
                    </div>

                    {childrenSubCategories.length > 0 && (
                      <KeyBoardArrowDownSVG
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Subcategories */}
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
                            {sub.displayName}
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
