"use client";

import React, {useEffect, useRef, useState} from "react";
import SearchSVG from "/public/svgs/search.svg";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import CloseSVG from "/public/svgs/close.svg";

interface SearchBarProps {
  autoFocus?: boolean;
}

export default function SearchBar({autoFocus = false}: SearchBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Small timeout ensures the animation finishes before focusing
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [autoFocus]);

  const [term, setTerm] = useState(searchParams.get("q")?.toString() || "");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDeleteSearch = () => {
    const params = new URLSearchParams(searchParams);
    setTerm("");
    params.delete("q");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative group">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
        <SearchSVG className="w-5 h-5" />
      </div>

      <input
        ref={inputRef}
        type="text"
        placeholder="Keress..."
        value={term}
        onChange={e => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="
            block w-full pl-10 pr-10 py-2.5 rounded-xl sm:text-sm shadow-sm transition-all
            bg-bg-hover border border-border-subtle
            text-text-main placeholder:text-text-muted
            focus:outline-none focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10
        "
      />

      {/* Clear Button */}
      {term.trim() && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <button
            onClick={handleDeleteSearch}
            className="p-1 rounded-full text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <CloseSVG className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
