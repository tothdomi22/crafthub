"use client";
import Link from "next/link";
import {formatDate} from "@/app/components/utils";
import React from "react";
import {useQuery} from "@tanstack/react-query";
import {User} from "@/app/types/user";
import {conversationListQuery} from "@/app/queries/conversation.queries";

export default function MessagesInbox({user}: {user: User}) {
  const {data: conversationsData} = useQuery(conversationListQuery());

  if (!conversationsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-secondary rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-secondary rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-64px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* --- LEFT COLUMN: CONVERSATION LIST (8/12) --- */}
        <div className="lg:col-span-8 flex flex-col bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden h-full">
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-border-subtle flex items-center justify-between">
            <h1 className="text-xl font-bold text-text-main">Üzenetek</h1>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
            <div className="flex flex-col gap-3">
              {conversationsData.conversations.map(conv => {
                const otherUser =
                  conv.conversation.userOne.id == user.id
                    ? conv.conversation.userTwo
                    : conv.conversation.userOne;

                return (
                  <Link
                    key={conv.conversation.id}
                    href={`/messages/${conv.conversation.id}`}
                    className={`group flex gap-4 p-4 rounded-xl border transition-all hover:shadow-md ${
                      !conv.isRead
                        ? "bg-primary/5 border-primary/20" // UPDATED: Soft purple tint for unread
                        : "bg-surface border-border-subtle hover:border-primary/30"
                    }`}>
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg border border-primary/10 group-hover:scale-105 transition-transform">
                        {otherUser.name.charAt(0)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3
                          className={`text-base truncate ${!conv.isRead ? "font-bold text-text-main" : "font-semibold text-text-main"}`}>
                          {otherUser.name}
                        </h3>
                        <span
                          className={`text-xs surfacespace-nowrap ml-2 ${!conv.isRead ? "text-primary font-bold" : "text-text-muted"}`}>
                          {formatDate(conv.conversation.updatedAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <p
                          className={`text-sm truncate leading-relaxed max-w-[80%] ${
                            !conv.isRead
                              ? "font-bold text-text-main"
                              : "text-text-muted"
                          }`}>
                          {conv.lastMessage.sender.id == user.id && (
                            <span className="font-normal text-text-muted">
                              Te:{" "}
                            </span>
                          )}
                          {conv.lastMessage.textContent}
                        </p>

                        {/* Listing Pill */}
                        <div className="hidden sm:flex items-center gap-2 bg-surface px-2 py-1 rounded-lg border border-border-subtle shadow-sm flex-shrink-0 max-w-[150px]">
                          <img
                            src={"/images/placeholder.jpg"}
                            alt=""
                            className="w-4 h-4 rounded object-cover"
                          />
                          <span className="text-[10px] font-bold text-text-muted truncate">
                            {conv.conversation.listing.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {conversationsData.conversations.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60 mt-20">
                  <div className="w-16 h-16 bg-border-subtle rounded-full flex items-center justify-center text-3xl mb-4">
                    📭
                  </div>
                  <h3 className="font-bold text-text-main">
                    Nincsenek üzeneteid
                  </h3>
                  <p className="text-sm text-text-muted">
                    Kezdj el böngészni a piactéren!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: WELCOME / STATS (4/12) --- */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-4">
          {/* Info Card */}
          <div className="bg-surface rounded-2xl shadow-sm border border-border-subtle p-6 flex flex-col items-center text-center h-full max-h-[400px] justify-center">
            {/* UPDATED: Matches Avatar style (bg-primary/10) */}
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-text-main mb-2">
              Üzenetközpont
            </h2>
            <p className="text-sm text-text-muted leading-relaxed mb-6">
              Itt találod az összes beszélgetésedet az eladókkal és a vevőkkel.
              A bal oldali listából válaszd ki azt, amelyiket folytatni
              szeretnéd.
            </p>

            <div className="w-full h-px bg-border-subtle mb-6"></div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-background rounded-xl p-3 border border-border-subtle">
                <div className="text-2xl font-bold text-primary">
                  {conversationsData.unread}
                </div>
                <div className="text-[10px] font-bold text-text-muted uppercase">
                  Olvasatlan
                </div>
              </div>
              <div className="bg-background rounded-xl p-3 border border-border-subtle">
                <div className="text-2xl font-bold text-text-main">
                  {conversationsData.conversations.length}
                </div>
                <div className="text-[10px] font-bold text-text-muted uppercase">
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
