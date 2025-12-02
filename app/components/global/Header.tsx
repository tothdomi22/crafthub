import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-serif font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-serif font-bold text-slate-900 hidden md:block tracking-tight">
            ArtisanSpace
          </span>
        </div>

        {/* Search Bar - Standardized Radius */}
        <div className="flex-1 max-w-2xl relative">
          <input
            type="text"
            className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all"
            placeholder="Keress kézzel készült kincseket..."
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href={"/create-listing"}>
            <button className="hidden sm:flex items-center gap-2 bg-primary hover:bg-[#5b4cc4] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-95">
              <span>Termék eladása</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
