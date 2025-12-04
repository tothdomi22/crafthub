"use client";
import Link from "next/link";
import {formatDate} from "@/app/components/utils";
import React from "react";
import {useQuery} from "@tanstack/react-query";
import {Conversation} from "@/app/types/conversation";
import useListConversation from "@/app/hooks/conversation/useListConversation";
import {useRouter} from "next/navigation";

export default function MessagesInbox({userId}: {userId: string | null}) {
  const router = useRouter();
  const {data: conversationsData} = useQuery<Conversation[]>({
    queryFn: useListConversation,
    queryKey: ["conversations"],
  });

  if (!conversationsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }
  if (!userId) {
    // If token is malformed or missing, redirect to log in
    router.push("/login");
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-64px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* --- LEFT COLUMN: CONVERSATION LIST (8/12) --- */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">Üzenetek</h1>
            {/*<div className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">*/}
            {/*  {conversationsData.length} aktív beszélgetés*/}
            {/*</div>*/}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
            <div className="flex flex-col gap-3">
              {conversationsData.map(conv => {
                // const isUnread =
                //   !conv.lastMessage.isRead && !conv.lastMessage.isMine;
                const isUnread = false;
                const otherUser =
                  String(conv.userOne.id) == userId
                    ? conv.userTwo
                    : conv.userOne;

                return (
                  <Link
                    key={conv.id}
                    href={`/messages/${conv.id}`}
                    className={`group flex gap-4 p-4 rounded-xl border transition-all hover:shadow-md ${
                      isUnread
                        ? "bg-indigo-50/50 border-indigo-100"
                        : "bg-white border-slate-100 hover:border-primary/30"
                    }`}>
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-100 text-primary rounded-full flex items-center justify-center font-bold text-lg border border-indigo-50 group-hover:scale-105 transition-transform">
                        {otherUser.name.charAt(0)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3
                          className={`text-base truncate ${isUnread ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                          {otherUser.name}
                        </h3>
                        <span
                          className={`text-xs whitespace-nowrap ml-2 ${isUnread ? "text-primary font-bold" : "text-slate-400"}`}>
                          {formatDate(conv.updatedAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <p
                          className={`text-sm truncate leading-relaxed max-w-[80%] ${
                            isUnread
                              ? "font-bold text-slate-800"
                              : "text-slate-500"
                          }`}>
                          {/*{conv.lastMessage.isMine && (*/}
                          {/*  <span className="font-normal text-slate-400">*/}
                          {/*    Te:{" "}*/}
                          {/*  </span>*/}
                          {/*)}*/}
                          {/*{conv.lastMessage.text}*/}
                        </p>

                        {/* Listing Pill */}
                        <div className="hidden sm:flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm flex-shrink-0 max-w-[150px]">
                          <img
                            src={"/images/placeholder.jpg"}
                            alt=""
                            className="w-4 h-4 rounded object-cover"
                          />
                          <span className="text-[10px] font-bold text-slate-600 truncate">
                            {conv.listing.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {conversationsData.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60 mt-20">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">
                    📭
                  </div>
                  <h3 className="font-bold text-slate-900">
                    Nincsenek üzeneteid
                  </h3>
                  <p className="text-sm text-slate-500">
                    Kezdj el böngészni a piactéren!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: WELCOME / STATS (4/12) --- */}
        {/* Matches the layout of the Chat Page's Sidebar */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-4">
          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center h-full max-h-[400px] justify-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-primary mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Üzenetközpont
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Itt találod az összes beszélgetésedet az eladókkal és a vevőkkel.
              A bal oldali listából válaszd ki azt, amelyiket folytatni
              szeretnéd.
            </p>

            <div className="w-full h-px bg-slate-100 mb-6"></div>

            {/*TODO: set to cols-2 once we have unread*/}
            <div className="grid grid-cols-1 gap-4 w-full">
              {/*<div className="bg-slate-50 rounded-xl p-3 border border-slate-100">*/}
              {/*  <div className="text-2xl font-bold text-primary">1</div>*/}
              {/*  <div className="text-[10px] font-bold text-slate-400 uppercase">*/}
              {/*    Olvasatlan*/}
              {/*  </div>*/}
              {/*</div>*/}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-2xl font-bold text-slate-700">
                  {conversationsData.length}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  Összes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
