"use client";

import React, {useEffect, useState} from "react";
import SearchBar from "@/app/components/global/SearchBar";
import SearchSVG from "/public/svgs/search.svg";
import {useSearchParams} from "next/navigation";

export default function MobileSearchToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();

  // Close the search bar automatically when the URL changes (user searched)
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <>
      {/* --- TRIGGER BUTTON (Mobile Only) --- */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 -mr-2 text-text-muted hover:bg-bg-hover hover:text-primary rounded-full transition-colors"
        aria-label="Keresés">
        <SearchSVG className="w-6 h-6" />
      </button>

      {/* --- OVERLAY (The actual search bar) --- */}
      {isOpen && (
        <div className="absolute inset-0 z-[60] bg-surface flex items-center px-4 gap-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm border-b border-border-subtle">
          <div className="flex-1">
            {/* We render the existing SearchBar here */}
            <SearchBar autoFocus={true} />
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-text-main font-medium text-sm hover:bg-bg-hover rounded-lg transition-colors">
            Mégse
          </button>
        </div>
      )}
    </>
  );
}
