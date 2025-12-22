"use client";

import React, {useEffect, useRef, useState} from "react";
import KeyBoardArrowDownSVG from "/public/svgs/keyboard-arrow-down.svg";
import SearchSVG from "/public/svgs/search.svg";
import CheckSVG from "/public/svgs/check.svg";

interface CategoryItem {
  id: number;
  displayName: string;
  [key: string]: any;
}

interface CategoryDropdownProps<T extends CategoryItem> {
  data: T[] | undefined;
  value: T | null;
  onChange: (item: T) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  position?: "absolute" | "relative";
}

export default function CategoryDropdown<T extends CategoryItem>({
  data,
  value,
  onChange,
  placeholder = "Válassz...",
  disabled = false,
  isLoading = false,
  position = "absolute",
}: CategoryDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- 1. CLICK OUTSIDE ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 2. AUTOFOCUS SEARCH ---
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // --- 3. SMART AUTO-SCROLL ---
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      // Wait for the accordion animation (300ms) to finish
      setTimeout(() => {
        const element = dropdownRef.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Height of your sticky footer (approx 80-90px) + 20px breathing room
        const footerOffset = 110;

        // Check if the bottom of the dropdown is hidden behind the footer
        const visibleBottom = windowHeight - footerOffset;
        const isCovered = rect.bottom > visibleBottom;

        if (isCovered) {
          // Calculate exactly how much to scroll to show the bottom
          const scrollAmount = rect.bottom - visibleBottom;

          window.scrollBy({
            top: scrollAmount,
            behavior: "smooth",
          });
        }
      }, 300);
    }
  }, [isOpen]);

  const handleSelect = (item: T) => {
    onChange(item);
    setIsOpen(false);
    setSearchTerm("");
  };

  const safeData = data || [];
  const filteredData = safeData.filter(item =>
    item.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Reusable List Content
  const listContent = (
    <div className="bg-surface overflow-hidden flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-3 border-b border-border-subtle bg-border-subtle/50">
        <div className="relative">
          <SearchSVG className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Keresés..."
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* List */}
      <div className="max-h-[250px] overflow-y-auto p-1 scroll-smooth">
        {isLoading ? (
          <div className="p-4 text-center text-text-muted text-sm">
            Betöltés...
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map(item => {
            const isSelected = value?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors text-sm font-medium
                    ${
                      isSelected
                        ? "bg-primary/5 text-primary"
                        : "text-text-main hover:bg-border hover:text-text-main"
                    }
                `}>
                <span>{item.displayName}</span>
                {isSelected && <CheckSVG className="w-4 h-4 text-primary" />}
              </button>
            );
          })
        ) : (
          <div className="p-4 text-center text-text-muted text-sm">
            Nincs találat.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 text-left outline-none transition-all relative z-20
          ${
            disabled
              ? "py-3 bg-border-subtle text-text-muted border border-border rounded-xl cursor-not-allowed"
              : isOpen
                ? `py-3 bg-surface border border-primary ${position === "relative" ? "rounded-t-xl rounded-b-none border-b-0 pb-[13px]" : "rounded-xl shadow-sm"}`
                : "py-3 bg-background border border-border hover:border-border hover:bg-surface text-text-main rounded-xl"
          }
        `}>
        <span
          className={`font-medium truncate ${
            value ? "text-text-main" : "text-text-muted"
          }`}>
          {value ? value.displayName : placeholder}
        </span>
        <KeyBoardArrowDownSVG
          className={`w-5 h-5 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* --- RENDER LOGIC --- */}
      {position === "absolute" ? (
        // OPTION A: Floating Overlay
        isOpen && (
          <div className="absolute top-full mt-2 left-0 w-full bg-surface rounded-xl shadow-xl border border-primary overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            {listContent}
          </div>
        )
      ) : (
        // OPTION B: Push/Accordion
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out relative z-10 ${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}>
          <div
            className={`overflow-hidden bg-surface rounded-b-xl -mt-[1px] ${
              isOpen ? "border border-primary border-t-0 shadow-sm" : ""
            }`}>
            {listContent}
          </div>
        </div>
      )}
    </div>
  );
}
