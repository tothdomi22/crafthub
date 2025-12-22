import React from "react";
import getCurrentUser from "@/app/utils/getCurrentUser";
import {User} from "@/app/types/user";
import HeaderRightActions from "@/app/components/global/HeaderRightActions";
import SearchBar from "@/app/components/global/SearchBar";
import BrandLogo from "@/app/components/global/BrandLogo";
import MobileSearchToggle from "@/app/components/global/MobileSearchToggle"; // Import it

export default async function Header() {
  const user: User | null = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle transition-all">
      {/* Note: 'relative' is crucial here so the Mobile Search Overlay
          knows where to position itself (inset-0)
      */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* --- LEFT: LOGO --- */}
        <BrandLogo />

        {/* --- CENTER: DESKTOP SEARCH --- */}
        <div className="hidden md:block flex-1 max-w-xl relative">
          <SearchBar />
        </div>

        {/* --- RIGHT: ACTIONS + MOBILE SEARCH TRIGGER --- */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* 1. Mobile Search Icon (Client Component) */}
          <MobileSearchToggle />

          {/* 2. User Actions (Login, Profile, etc.) */}
          <HeaderRightActions user={user} />
        </div>
      </div>
    </header>
  );
}
