"use client";

import React from "react";
import ArrowBackSVG from "/public/svgs/arrow-back.svg";
import ShareSVG from "/public/svgs/share.svg";
import {useRouter} from "next/navigation";
import Link from "next/link";
import ProfileDropdown from "@/app/components/global/ProfileDropdown"; // Import here too

export default function SubHeader() {
  const router = useRouter();
  // TODO: Replace with auth hook
  const isLoggedIn = true;

  const copyURL = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        // You might want to use your notifySuccess toast here
        alert("Link másolva!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left: Back Button */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-slate-50">
          <ArrowBackSVG className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline font-semibold text-sm">Vissza</span>
        </button>

        {/* Center: Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 group absolute left-1/2 -translate-x-1/2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:bg-[#5b4cc4] transition-colors">
            <span className="text-white font-serif font-bold text-lg">A</span>
          </div>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyURL}
            className="text-slate-400 hover:text-primary p-2 rounded-xl hover:bg-slate-50 transition-colors"
            title="Megosztás">
            <ShareSVG />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          {isLoggedIn ? (
            <ProfileDropdown />
          ) : (
            <Link href="/login" className="text-sm font-bold text-primary">
              Belépés
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
