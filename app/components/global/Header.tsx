import React from "react";
import Link from "next/link";
import SearchSVG from "/public/svgs/search.svg";
import getCurrentUser from "@/app/utils/getCurrentUser";
import {User} from "@/app/types/user";
import HeaderRightActions from "@/app/components/global/HeaderRightActions";

export default async function Header() {
  const user: User | null = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* --- LEFT: LOGO --- */}
        <Link
          href="/"
          className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#5b4cc4] transition-colors">
            <span className="text-white font-serif font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-serif font-bold text-slate-900 hidden md:block tracking-tight">
            ArtisanSpace
          </span>
        </Link>

        {/* --- CENTER: SEARCH BAR --- */}
        <div className="flex-1 max-w-2xl relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <SearchSVG className="w-5 h-5" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all shadow-sm"
              placeholder="Keress..."
            />
          </div>
        </div>

        {/* --- RIGHT: ACTIONS --- */}
        <HeaderRightActions user={user} />
      </div>
    </header>
  );
}
