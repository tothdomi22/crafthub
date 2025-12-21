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

  // 1. LOCAL FILTER STATE
  const [localFilters, setLocalFilters] = useState<FilterState>(initialFilters);

  // 2. EXPANSION STATE
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  // 3. SYNC LOCAL STATE
  useEffect(() => {
    setLocalFilters(initialFilters);
    if (initialFilters.mainCategoryId) {
      setExpandedCategories(prev => {
        if (!prev.includes(initialFilters.mainCategoryId!)) {
          return [...prev, initialFilters.mainCategoryId!];
        }
        return prev;
      });
    }
  }, [initialFilters]);

  // --- HANDLERS ---

  const toggleMainCategory = (catId: number) => {
    setLocalFilters(prev => {
      const isSameCategory = prev.mainCategoryId === catId;

      if (isSameCategory) {
        // Deselect AND Collapse
        setExpandedCategories(prevExpanded =>
          prevExpanded.filter(id => id !== catId),
        );
        return {
          ...prev,
          mainCategoryId: null,
          subCategoryIds: [],
        };
      } else {
        // Select AND Expand
        setExpandedCategories(prevExpanded =>
          prevExpanded.includes(catId)
            ? prevExpanded
            : [...prevExpanded, catId],
        );
        return {
          ...prev,
          mainCategoryId: catId,
          subCategoryIds: [],
        };
      }
    });
  };

  const toggleAccordion = (e: React.MouseEvent, catId: number) => {
    e.stopPropagation();
    setExpandedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId],
    );
  };

  // --- FIXED HANDLER HERE ---
  const toggleSubCategory = (subId: number, parentId: number) => {
    setLocalFilters(prev => {
      // Check if we are switching to a new Main Category
      const isDifferentMainCat = prev.mainCategoryId !== parentId;

      if (isDifferentMainCat) {
        // CASE 1: Switching Main Category
        // We must wipe out the old subCategoryIds and set the new Main ID
        return {
          ...prev,
          mainCategoryId: parentId,
          subCategoryIds: [subId], // Start fresh with just this one
        };
      }

      // CASE 2: Same Main Category - Standard Toggle
      const isSelected = prev.subCategoryIds.includes(subId);
      const newSubIds = isSelected
        ? prev.subCategoryIds.filter(id => id !== subId)
        : [...prev.subCategoryIds, subId];

      return {
        ...prev,
        subCategoryIds: newSubIds,
        mainCategoryId: parentId,
      };
    });
  };

  // --- URL UPDATE LOGIC ---
  const applyFiltersToURL = (filtersToApply: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    if (filtersToApply.mainCategoryId) {
      params.set("mainCategoryId", filtersToApply.mainCategoryId.toString());
      params.delete("mainCategoryIds");
    } else {
      params.delete("mainCategoryId");
      params.delete("mainCategoryIds");
    }

    if (filtersToApply.subCategoryIds.length > 0) {
      params.set("subCategoryIds", filtersToApply.subCategoryIds.join(","));
    } else {
      params.delete("subCategoryIds");
    }

    if (filtersToApply.minPrice)
      params.set("minPrice", filtersToApply.minPrice);
    else params.delete("minPrice");

    if (filtersToApply.maxPrice)
      params.set("maxPrice", filtersToApply.maxPrice);
    else params.delete("maxPrice");

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
      mainCategoryId: null,
      subCategoryIds: [],
      minPrice: "",
      maxPrice: "",
      cities: [],
    };
    setLocalFilters(emptyFilters);
    setExpandedCategories([]);
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
              const isMainSelected = localFilters.mainCategoryId === cat.id;
              const isOpen = expandedCategories.includes(cat.id);
              const childrenSubCategories =
                allSubCategories?.filter(
                  sub => sub.mainCategory.id === cat.id,
                ) || [];

              return (
                <div key={cat.id}>
                  {/* MAIN CATEGORY ROW */}
                  <div
                    className={`w-full flex items-center justify-between rounded-lg transition-colors ${
                      isMainSelected
                        ? "bg-primary/5 text-primary"
                        : "text-slate-900 hover:bg-slate-50"
                    }`}>
                    <button
                      onClick={() => toggleMainCategory(cat.id)}
                      className="flex-1 flex items-center gap-2 px-3 py-2 text-sm text-left font-medium">
                      <span
                        title={cat.description}
                        className={isMainSelected ? "font-bold" : ""}>
                        {cat.displayName}
                      </span>
                      {isMainSelected && <CheckSVG className="w-3.5 h-3.5" />}
                    </button>

                    {childrenSubCategories.length > 0 && (
                      <button
                        onClick={e => toggleAccordion(e, cat.id)}
                        className={`p-2 mr-1 rounded-md transition-colors ${
                          isMainSelected
                            ? "text-primary hover:bg-primary/10"
                            : "text-slate-400 hover:bg-black/5"
                        }`}>
                        <KeyBoardArrowDownSVG
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* SUB CATEGORIES - ANIMATED CONTAINER */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}>
                    <div className="overflow-hidden">
                      {childrenSubCategories.length > 0 && (
                        <div className="ml-3 mt-1 border-l-2 border-slate-100 pl-2 space-y-1 pb-1">
                          {childrenSubCategories.map(sub => {
                            const isSubSelected =
                              localFilters.subCategoryIds.includes(sub.id);
                            return (
                              <button
                                key={sub.id}
                                onClick={() =>
                                  toggleSubCategory(sub.id, cat.id)
                                }
                                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors text-left ${
                                  isSubSelected
                                    ? "text-primary font-bold bg-slate-50"
                                    : "text-slate-700 hover:text-slate-800"
                                }`}>
                                <div
                                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
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
                  </div>
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
