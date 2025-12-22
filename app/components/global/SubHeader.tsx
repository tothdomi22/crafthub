"use client";

import React from "react";
import ArrowBackSVG from "/public/svgs/arrow-back.svg";
import ShareSVG from "/public/svgs/share.svg";
import {useRouter} from "next/navigation";
import {User} from "@/app/types/user";
import {notifyError, notifySuccess} from "@/app/utils/toastHelper";
import HeaderRightActions from "@/app/components/global/HeaderRightActions";
import BrandLogo from "@/app/components/global/BrandLogo";

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
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle h-14 sm:h-16 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* --- LEFT SIDE: BACK + LOGO --- */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 z-10">
          {/* 1. Back Button */}
          <button
            onClick={() => router.back()}
            className="group flex items-center justify-center sm:justify-start gap-1.5 text-text-muted hover:text-text-main transition-colors p-2 -ml-2 rounded-xl hover:bg-bg-hover active:bg-surface"
            aria-label="Vissza">
            <ArrowBackSVG className="w-6 h-6 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="hidden sm:inline font-bold text-sm">Vissza</span>
          </button>

          {/* Divider (Visual separation) */}
          <div className="h-5 w-px bg-border-subtle hidden sm:block"></div>

          {/* 2. Brand Logo (Left Aligned) */}
          {/* We keep 'mobile-short' here so on tiny phones it's just 'me.' next to the arrow */}
          <div className="pb-1">
            <BrandLogo variant="mobile-short" />
          </div>
        </div>

        {/* --- CENTER: EMPTY --- */}
        {/* You can put a Page Title here later if you want */}
        <div className="flex-1"></div>

        {/* --- RIGHT SIDE: ACTIONS --- */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0 z-10">
          <button
            onClick={copyURL}
            className="text-text-muted hover:text-primary p-2 rounded-xl hover:bg-bg-hover transition-colors active:scale-95"
            title="Megosztás">
            <ShareSVG className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="hidden sm:block h-5 w-px bg-border-subtle mx-1"></div>
          <HeaderRightActions user={user} />
        </div>
      </div>
    </nav>
  );
}
