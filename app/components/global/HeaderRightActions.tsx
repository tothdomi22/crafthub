"use client";

import React from "react";
import Link from "next/link";
import ChatSVG from "/public/svgs/chat.svg";
import NotificationDropdown from "@/app/components/global/NotificationDropdown";
import ProfileDropdown from "@/app/components/global/ProfileDropdown";
import {User} from "@/app/types/user";
import {useQuery} from "@tanstack/react-query";
import {NotificationWithUnreadMessage} from "@/app/types/notification";
import useListUnread from "@/app/hooks/notification/useListUnread";

export default function HeaderRightActions({user}: {user: User | null}) {
  const {data: notificationsData} = useQuery<NotificationWithUnreadMessage>({
    queryFn: useListUnread,
    queryKey: ["unread-notification"],
  });
  return (
    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
      {user ? (
        <>
          {/* Create Listing CTA (Desktop) */}
          <Link href={"/create-listing"} className="hidden lg:block mr-2">
            <button className="bg-primary hover:bg-[#5b4cc4] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
              Termék eladása
            </button>
          </Link>

          {/* Messages Button */}
          <Link href="/messages">
            <button className="relative p-2.5 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-xl transition-all">
              <ChatSVG className="w-6 h-6" />
              {notificationsData?.unreadMessage && (
                <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-1 ring-white"></span>
              )}
            </button>
          </Link>

          {/* Notifications Dropdown (New) */}
          <NotificationDropdown notificationsData={notificationsData} />

          {/* Profile Dropdown */}
          <ProfileDropdown user={user} />
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
            <button className="hidden sm:block px-4 py-2.5 text-sm font-bold bg-primary hover:bg-[#5b4cc4] text-white rounded-xl transition-colors shadow-sm">
              Regisztráció
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
