"use client";

import React, {useEffect, useRef, useState} from "react";
import KeyBoardArrowDownSVG from "/public/svgs/keyboard-arrow-down.svg";
import SearchSVG from "/public/svgs/search.svg";
import LocationSVG from "/public/svgs/location.svg";
import {City} from "@/app/types/city";

interface CityDropdownProps {
  value: City | null;
  onChange: (city: City) => void;
  citiesData: City[] | undefined;
  isLoading?: boolean;
  placeholder?: string;
}

export default function CityDropdown({
  value,
  onChange,
  citiesData,
  isLoading = false,
  placeholder = "Válassz várost...",
}: CityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0); // Track keyboard focus

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null); // Ref for the scrollable list container

  // Filter logic
  const safeCities = citiesData || [];
  const filteredCities = safeCities
    .filter(city => city.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 25);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autofocus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Reset highlight when search changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  // Scroll highlighted item into view
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

  const handleSelect = (city: City) => {
    onChange(city);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(0);
  };

  // --- KEYBOARD NAVIGATION HANDLER ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      // If closed and user types specific keys, open it
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault(); // Prevent cursor moving in input
        setHighlightedIndex(prev =>
          prev < filteredCities.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault(); // Prevent form submission
        if (filteredCities.length > 0) {
          handleSelect(filteredCities[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* --- Trigger Button --- */}
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
              value ? "text-primary" : "text-slate-400"
            }`}
          />
          <span
            className={`font-medium truncate ${
              value ? "text-slate-900" : "text-slate-400"
            }`}>
            {value?.name || placeholder}
          </span>
        </div>

        <div
          className={`text-slate-400 transition-transform duration-200 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}>
          <KeyBoardArrowDownSVG className="w-5 h-5" />
        </div>
      </button>

      {/* --- Dropdown Menu --- */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top">
          {/* 1. Search Bar */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <SearchSVG className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown} // Attached Handler Here
                placeholder="Keresés..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                onClick={e => e.stopPropagation()}
              />
            </div>
          </div>

          {/* 2. Results List */}
          <div
            ref={listRef}
            className="max-h-[200px] overflow-y-auto p-1 scroll-smooth">
            {isLoading ? (
              // Skeleton Rows
              <div className="space-y-1 p-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="w-4 h-4 bg-slate-100 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : filteredCities.length > 0 ? (
              // Actual Results
              filteredCities.map((city, index) => {
                const isSelected = city.name === value?.name;
                const isHighlighted = index === highlightedIndex; // Check highlight state

                return (
                  <button
                    key={index}
                    type="button"
                    // Update index on mouse hover so mouse and keyboard don't fight
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelect(city)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium
                        ${
                          isSelected
                            ? "bg-primary/5 text-primary"
                            : isHighlighted
                              ? "bg-slate-100 text-slate-900" // Highlight style
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                    `}>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mb-0.5"></div>
                    )}
                    <span className={isSelected ? "ml-0" : "ml-3.5"}>
                      {city.name}
                    </span>
                  </button>
                );
              })
            ) : (
              // Empty State
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
