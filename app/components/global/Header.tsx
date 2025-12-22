import React from "react";
import Link from "next/link";
import getCurrentUser from "@/app/utils/getCurrentUser";
import {User} from "@/app/types/user";
import HeaderRightActions from "@/app/components/global/HeaderRightActions";
import SearchBar from "@/app/components/global/SearchBar";

export default async function Header() {
  const user: User | null = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-slate-200 dark:border-border-subtle dark transition-all ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* --- LEFT: LOGO --- */}
        <Link
          href="/"
          className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary-hover transition-colors">
            <span className="text-surface font-serif font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-serif font-bold text-text-main hidden md:block tracking-tight">
            ArtisanSpace
          </span>
        </Link>

        {/* --- CENTER: SEARCH BAR --- */}
        <div className="flex-1 max-w-2xl relative">
          <SearchBar />
        </div>

        {/* --- RIGHT: ACTIONS --- */}
        <HeaderRightActions user={user} />
      </div>
    </header>
  );
}
