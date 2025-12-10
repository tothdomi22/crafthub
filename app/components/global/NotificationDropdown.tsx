"use client";

import React, {useEffect, useRef, useState} from "react";
import BellSVG from "/public/svgs/bell.svg";
import CheckSVG from "/public/svgs/check.svg";
import {Notification, NotificationTypeEnum} from "@/app/types/notification";
import {useQuery} from "@tanstack/react-query";
import useListUnread from "@/app/hooks/notification/useListUnread";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {data: notificationsData} = useQuery<Notification[]>({
    queryFn: useListUnread,
    queryKey: ["unread-notification"],
  });

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

  if (!notificationsData) {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all ${
          isOpen
            ? "bg-slate-100 text-primary"
            : "text-slate-500 hover:text-primary hover:bg-slate-50"
        }`}>
        <BellSVG className="w-6 h-6" />
      </button>
    );
  }

  const unreadCount = notificationsData.filter(n => !n.isRead).length;

  const handleAccept = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // TODO: Call API to accept purchase request
    console.log("Accepted request", id);
    setIsOpen(false);
  };

  const handleDecline = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // TODO: Call API to decline
    console.log("Declined request", id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* --- TRIGGER BUTTON --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all ${
          isOpen
            ? "bg-slate-100 text-primary"
            : "text-slate-500 hover:text-primary hover:bg-slate-50"
        }`}>
        <BellSVG className="w-6 h-6" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-1 ring-white"></span>
        )}
      </button>

      {/* --- DROPDOWN MENU --- */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Értesítések</h3>
            {unreadCount > 0 && (
              <button className="text-xs font-bold text-primary hover:underline">
                Összes olvasott
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notificationsData.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Nincs új értesítésed.
              </div>
            ) : (
              notificationsData.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors relative ${!notif.isRead ? "bg-indigo-50/30" : ""}`}>
                  {/* Unread Indicator */}
                  {!notif.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  )}

                  {notif.type === NotificationTypeEnum.PURCHASE_REQUEST && (
                    <div className="flex gap-4">
                      {/* Item Image */}
                      <div className="w-12 h-12 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden border border-slate-100">
                        <img
                          src={"/images/placeholder.jpg"}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm text-slate-600 leading-snug mb-2">
                          <span className="font-bold text-slate-900">
                            {notif.data.requesterName}
                          </span>{" "}
                          jelezte, hogy megvásárolta a(z){" "}
                          <span className="font-bold text-slate-900">
                            {notif.data.listingTitle}
                          </span>{" "}
                          termékedet.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={e => handleAccept(e, String(notif.id))}
                            className="flex-1 bg-primary hover:bg-[#5b4cc4] text-white text-xs font-bold py-2 rounded-lg shadow-sm flex items-center justify-center gap-1 transition-all">
                            <CheckSVG className="w-3.5 h-3.5" /> Elfogadás
                          </button>
                          <button
                            onClick={e => handleDecline(e, String(notif.id))}
                            className="flex-1 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 text-xs font-bold py-2 rounded-lg transition-all">
                            Elutasítás
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
