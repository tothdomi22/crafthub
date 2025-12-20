"use client";

import React, {useEffect, useRef, useState} from "react";
import KeyBoardArrowDownSVG from "/public/svgs/keyboard-arrow-down.svg";
import SearchSVG from "/public/svgs/search.svg";
import LocationSVG from "/public/svgs/location.svg";
import CheckSVG from "/public/svgs/check.svg";
import {City} from "@/app/types/city";

// --- Types ---
interface CommonProps {
  citiesData: City[] | undefined;
  isLoading?: boolean;
  placeholder?: string;
}

interface SingleSelectProps extends CommonProps {
  isMulti?: false;
  value: City | null;
  onChange: (city: City) => void;
}

interface MultiSelectProps extends CommonProps {
  isMulti: true;
  value: City[];
  onChange: (cities: City[]) => void;
}

type CityDropdownProps = SingleSelectProps | MultiSelectProps;

export default function CityDropdown(props: CityDropdownProps) {
  const {
    citiesData,
    isLoading = false,
    placeholder = "Válassz várost...",
    isMulti = false,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // --- Helpers ---
  const getSelectedArray = (): City[] => {
    if (isMulti) return (props.value as City[]) || [];
    return props.value ? [props.value as City] : [];
  };

  const isSelected = (city: City) => {
    const selected = getSelectedArray();
    return selected.some(c => c.name === city.name);
  };

  // --- FILTER & SORT LOGIC ---
  const safeCities = citiesData || [];

  const filteredCities = safeCities
    .filter(city => city.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // 1. Check selection status
      const aSelected = isSelected(a);
      const bSelected = isSelected(b);

      // 2. If one is selected and the other isn't, prioritize the selected one
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      // 3. Otherwise, keep original order (or sort alphabetically if needed)
      return 0;
    })
    .slice(0, 25);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(0);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autofocus search input
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Reset highlight on search
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  // Scroll highlight into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  // --- SELECTION HANDLER ---
  const handleSelect = (city: City) => {
    if (isMulti) {
      const currentValues = (props.value as City[]) || [];
      const exists = currentValues.some(c => c.name === city.name);

      let newValues;
      if (exists) {
        newValues = currentValues.filter(c => c.name !== city.name);
      } else {
        newValues = [...currentValues, city];
      }

      (props.onChange as (cities: City[]) => void)(newValues);

      // Don't clear search on multi-select to allow rapid selection
      searchInputRef.current?.focus();
    } else {
      (props.onChange as (city: City) => void)(city);
      setIsOpen(false);
      setSearchTerm("");
      setHighlightedIndex(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredCities.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCities.length > 0) {
          handleSelect(filteredCities[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const renderTriggerText = () => {
    if (isMulti) {
      const values = props.value as City[];
      if (!values || values.length === 0) return placeholder;
      return values.map(c => c.name).join(", ");
    } else {
      const val = props.value as City | null;
      return val?.name || placeholder;
    }
  };

  const hasValue = isMulti ? (props.value as City[]).length > 0 : !!props.value;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-left
          ${
            isOpen
              ? "ring-4 ring-primary/10 border-primary bg-white"
              : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }
        `}>
        <div className="flex items-center gap-2 overflow-hidden">
          <LocationSVG
            className={`w-5 h-5 flex-shrink-0 ${
              hasValue ? "text-primary" : "text-slate-400"
            }`}
          />
          <span
            className={`font-medium truncate ${
              hasValue ? "text-slate-900" : "text-slate-400"
            }`}>
            {renderTriggerText()}
          </span>
        </div>

        <div
          className={`text-slate-400 transition-transform duration-200 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}>
          <KeyBoardArrowDownSVG className="w-5 h-5" />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top">
          {/* Search */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <SearchSVG className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Keresés..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                onClick={e => e.stopPropagation()}
              />
            </div>
          </div>

          {/* List */}
          <div
            ref={listRef}
            className="max-h-[200px] overflow-y-auto p-1 scroll-smooth">
            {isLoading ? (
              <div className="space-y-1 p-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="w-4 h-4 bg-slate-100 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : filteredCities.length > 0 ? (
              filteredCities.map((city, index) => {
                const selected = isSelected(city);
                const isHighlighted = index === highlightedIndex;

                return (
                  <button
                    key={index}
                    type="button"
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelect(city)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium
                        ${
                          selected
                            ? "bg-primary/5 text-primary"
                            : isHighlighted
                              ? "bg-slate-100 text-slate-900"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                    `}>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0
                        ${selected ? "bg-primary border-primary" : "border-slate-300 bg-white"}
                    `}>
                      {selected && <CheckSVG className="w-3 h-3 text-white" />}
                    </div>
                    <span className="truncate">{city.name}</span>
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-slate-400 font-medium">
                Nincs találat: &#34;{searchTerm}&#34;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
