"use client";

import React from "react";
import Link from "next/link";
import ChatSVG from "/public/svgs/chat.svg";
import SearchSVG from "/public/svgs/search.svg";
import ProfileDropdown from "@/app/components/global/ProfileDropdown"; // Import the new component

export default function Header() {
  // TODO: Replace with your actual auth hook
  // const { isLoggedIn } = useAuth();
  const isLoggedIn = true;

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
        <div className="flex items-center gap-3 flex-shrink-0">
          {isLoggedIn ? (
            <>
              {/* Create Listing CTA (Desktop) */}
              <Link href={"/create-listing"} className="hidden sm:block">
                <button className="bg-primary hover:bg-[#5b4cc4] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                  Termék eladása
                </button>
              </Link>

              {/* Messages Button */}
              <Link href="/messages">
                <button className="relative p-2.5 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-xl transition-all">
                  <ChatSVG className="w-6 h-6" />
                </button>
              </Link>

              {/* Profile Dropdown */}
              <ProfileDropdown />
            </>
          ) : (
            /* Logged Out State */
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-primary transition-colors">
                  Belépés
                </button>
              </Link>
              <Link href="/register">
                <button className="hidden sm:block px-4 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
                  Regisztráció
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
