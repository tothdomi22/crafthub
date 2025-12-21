"use client";

import React from "react";
import ArrowBackSVG from "/public/svgs/arrow-back.svg";
import ShareSVG from "/public/svgs/share.svg";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {User} from "@/app/types/user";
import {notifyError, notifySuccess} from "@/app/utils/toastHelper";
import HeaderRightActions from "@/app/components/global/HeaderRightActions";

export default function SubHeader({user}: {user: User}) {
  const router = useRouter();

  const copyURL = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        notifySuccess("Link másolva!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        notifyError("Hiba a másolás közben!");
      });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200 h-14 sm:h-16 transition-all supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between relative">
        {/* --- LEFT: BACK BUTTON --- */}
        <div className="flex-shrink-0 z-10">
          <button
            onClick={() => router.back()}
            className="group flex items-center justify-center sm:justify-start gap-1.5 text-slate-500 hover:text-primary transition-colors p-2 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 active:bg-slate-200"
            aria-label="Vissza">
            <ArrowBackSVG className="w-6 h-6 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline font-semibold text-sm">
              Vissza
            </span>
          </button>
        </div>

        {/* --- CENTER: BRAND (Absolute) --- */}
        {/* HIDDEN ON MOBILE: explicit 'hidden sm:flex' to prevent overlap */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center pointer-events-none">
          <Link
            href="/"
            className="flex items-center gap-2 group pointer-events-auto">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#5b4cc4] transition-colors">
              <span className="text-white font-serif font-bold text-lg sm:text-xl">
                A
              </span>
            </div>
          </Link>
        </div>

        {/* --- RIGHT: ACTIONS --- */}
        {/* Increased gap from 1 to 3 for breathing room */}
        <div className="flex items-center gap-3 flex-shrink-0 z-10">
          <button
            onClick={copyURL}
            className="text-slate-400 hover:text-primary p-2 rounded-xl hover:bg-slate-50 transition-colors active:scale-95"
            title="Megosztás">
            <ShareSVG className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Divider - Hidden on mobile to save space */}
          <div className="hidden sm:block h-5 w-px bg-slate-200 mx-1"></div>

          {/* User Actions */}
          <HeaderRightActions user={user} />
        </div>
      </div>
    </nav>
  );
}
