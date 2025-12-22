"use client";

import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {User} from "@/app/types/user";
import useLogout from "@/app/hooks/auth/useLogout";
import {notifyError} from "@/app/utils/toastHelper";
import KeyBoardArrowDownSVG from "/public/svgs/keyboard-arrow-down.svg";
import {useQuery} from "@tanstack/react-query";
import {profileUserQuery} from "@/app/queries/profile.queries";

export default function ProfileDropdown({user}: {user: User}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {mutate: logoutMutation} = useLogout();

  const {data: profileData} = useQuery(profileUserQuery(user.id));

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutMutation(undefined, {
      onError(e) {
        console.error(e);
        notifyError("Hiba a kijelentkezés során!");
      },
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* --- TRIGGER BUTTON --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-1 pr-2 rounded-full transition-all border ${
          isOpen
            ? "bg-secondary border-border"
            : "bg-transparent border-transparent hover:bg-bg-hover hover:border-border"
        }`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-9 h-9 bg-border text-primary rounded-full flex items-center justify-center font-bold text-sm border border-secondary">
            {user.name.charAt(0)}
          </div>
        </div>

        {/* Dropdown Arrow (Animated) */}
        <KeyBoardArrowDownSVG />
      </button>

      {/* --- DROPDOWN MENU --- */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-surface rounded-2xl shadow-xl border border-border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          {/* Header section with Name */}
          <div className="px-5 py-3 border-b border-border bg-background/50">
            <p className="text-sm font-bold text-text-main truncate">
              {profileData?.user.name || user.name}
            </p>
            <Link
              href={`/user/${user.id}`}
              onClick={() => setIsOpen(false)}
              className="text-xs text-text-muted hover:text-primary transition-colors font-medium">
              Profil megtekintése
            </Link>
          </div>

          {/* Menu Links */}
          <div className="p-2 flex flex-col gap-1">
            <Link
              href="/my-listings"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-bg-hover hover:text-primary rounded-xl transition-colors flex items-center gap-3">
              Hirdetéseim
            </Link>

            <Link
              href="/favorites"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-bg-hover hover:text-primary rounded-xl transition-colors flex items-center gap-3">
              Kedvelt hirdetések
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-bg-hover hover:text-primary rounded-xl transition-colors flex items-center gap-3">
              Beállítások
            </Link>
          </div>

          <div className="h-px bg-border mx-2 my-1"></div>

          {/* Logout */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-bg-hover rounded-xl transition-colors flex items-center gap-3">
              Kijelentkezés
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
