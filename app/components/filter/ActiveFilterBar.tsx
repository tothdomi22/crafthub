"use client";

import React, {useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import CloseSVG from "/public/svgs/close.svg";
import KeyBoardArrowDownSVG from "/public/svgs/keyboard-arrow-down.svg";
import {MainCategory, SubCategory} from "@/app/types/admin/category/category";
import {FilterState} from "@/app/types/filters";

interface ActiveFilterBarProps {
  filters: FilterState;
  mainCategories?: MainCategory[];
  subCategories?: SubCategory[];
}

export default function ActiveFilterBar({
  filters,
  mainCategories,
  subCategories,
}: ActiveFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isExpanded, setIsExpanded] = useState(false);
  // Separate state to control WHEN the mask appears (avoids the instant fade glitch)
  const [maskActive, setMaskActive] = useState(true);

  // --- SYNC MASK ANIMATION ---
  useEffect(() => {
    if (isExpanded) {
      // When expanding: Remove mask IMMEDIATELY so full content is visible during growth
      setMaskActive(false);
    } else {
      // When collapsing: Wait for the height animation (500ms) to finish BEFORE adding the mask
      const timer = setTimeout(() => {
        setMaskActive(true);
      }, 500); // Matches duration-500
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // --- HELPER: Update URL ---
  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // --- REMOVAL HANDLERS ---
  const removeMainCategory = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("mainCategoryId");
    params.delete("subCategoryIds");
    router.push(`${pathname}?${params.toString()}`);
  };

  const removeSubCategory = (idToRemove: number) => {
    const newIds = filters.subCategoryIds.filter(id => id !== idToRemove);
    updateParams("subCategoryIds", newIds.length > 0 ? newIds.join(",") : null);
  };

  const removeCity = (idToRemove: number) => {
    const currentIds = filters.cities.map(c => c.id);
    const newIds = currentIds.filter(id => id !== idToRemove);
    updateParams("cityIds", newIds.length > 0 ? newIds.join(",") : null);
  };

  const removePrice = (type: "min" | "max") => {
    updateParams(type === "min" ? "minPrice" : "maxPrice", null);
  };

  const clearAll = () => {
    router.push(pathname);
  };

  // --- Active Check ---
  const activeCount =
    (filters.mainCategoryId ? 1 : 0) +
    filters.subCategoryIds.length +
    filters.cities.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0);

  if (activeCount === 0) return null;

  const showExpandButton = activeCount > 4;

  // Mask should only be active if:
  // 1. We are collapsed (!isExpanded)
  // 2. We have overflow (showExpandButton)
  // 3. The animation delay allows it (maskActive)
  const shouldMask = !isExpanded && showExpandButton && maskActive;

  return (
    <div className="mb-6 flex items-start gap-4">
      {/* 1. Label */}
      <span className="text-sm font-bold text-slate-500 py-1.5 flex-shrink-0">
        Szűrők:
      </span>

      {/* 2. Scrollable/Collapsible Area */}
      <div
        className={`flex flex-wrap gap-2 flex-1 transition-all duration-500 ease-in-out overflow-hidden
          ${isExpanded ? "max-h-[500px]" : "max-h-[54px]"} 
        `}
        style={{
          maskImage: shouldMask
            ? "linear-gradient(to bottom, black 65%, transparent 100%)"
            : "none",
          WebkitMaskImage: shouldMask
            ? "linear-gradient(to bottom, black 65%, transparent 100%)"
            : "none",
        }}>
        {/* Main Category */}
        {filters.mainCategoryId && (
          <Badge
            label={
              mainCategories?.find(c => c.id === filters.mainCategoryId)
                ?.displayName || "Kategória"
            }
            onRemove={removeMainCategory}
          />
        )}

        {/* Sub Categories */}
        {filters.subCategoryIds.map(id => (
          <Badge
            key={`sub-${id}`}
            label={
              subCategories?.find(c => c.id === id)?.displayName ||
              "Alkategória"
            }
            onRemove={() => removeSubCategory(id)}
          />
        ))}

        {/* Cities */}
        {filters.cities.map(city => (
          <Badge
            key={`city-${city.id}`}
            label={city.name}
            onRemove={() => removeCity(city.id)}
          />
        ))}

        {/* Price Min */}
        {filters.minPrice && (
          <Badge
            label={`Min: ${filters.minPrice} Ft`}
            onRemove={() => removePrice("min")}
          />
        )}

        {/* Price Max */}
        {filters.maxPrice && (
          <Badge
            label={`Max: ${filters.maxPrice} Ft`}
            onRemove={() => removePrice("max")}
          />
        )}
      </div>

      {/* 3. Actions */}
      <div className="flex items-center gap-3 flex-shrink-0 py-1">
        {showExpandButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-full hover:bg-slate-200 text-slate-500 hover:text-primary transition-colors"
            title={isExpanded ? "Kevesebb" : "Több"}>
            <KeyBoardArrowDownSVG
              className={`w-5 h-5 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
        <button
          onClick={clearAll}
          className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline transition-colors whitespace-nowrap">
          Összes törlése
        </button>
      </div>
    </div>
  );
}

function Badge({label, onRemove}: {label: string; onRemove: () => void}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 transition-colors hover:bg-primary/15 whitespace-nowrap h-[30px]">
      {label}
      <button
        onClick={onRemove}
        className="p-0.5 rounded-full hover:bg-primary/20 text-primary flex-shrink-0">
        <CloseSVG className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}
