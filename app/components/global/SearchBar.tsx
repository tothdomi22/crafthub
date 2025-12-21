"use client";

import React, {useState} from "react";
import SearchSVG from "/public/svgs/search.svg";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import CloseSVG from "/public/svgs/close.svg";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();

  // Local state to track typing before pressing Enter
  const [term, setTerm] = useState(searchParams.get("q")?.toString() || "");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    // Reset page to start from the top when searching
    params.delete("page");

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    // Update URL only when this function is called
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
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted">
        <SearchSVG className="w-5 h-5" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-4 py-2.5 border border-border placeholder:text-text-muted rounded-xl text-text-muted leading-5 bg-background placehotext-text-muted focus:outline-none focus:bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all shadow-sm"
        placeholder="Keress..."
        value={term}
        onChange={e => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {term.trim() && (
        <div className="absolute inset-y-0 right-3 flex items-center text-text-muted  ">
          <button onClick={handleDeleteSearch} className="cursor-pointer">
            <CloseSVG />
          </button>
        </div>
      )}
    </div>
  );
}
