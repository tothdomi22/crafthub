"use client";

import React, {use, useEffect, useRef, useState} from "react";
import SubHeader from "@/app/components/global/SubHeader";
import Link from "next/link"; // --- MOCK DATA ---

// --- MOCK DATA ---
const mockChatDetail = {
  id: "1",
  otherUser: {
    name: "Nagy Anna",
    id: "user_123",
    lastActive: "Active now",
  },
  listing: {
    id: "list_999",
    name: "Kézzel faragott diófa kanál - Extra hosszú nyéllel",
    price: 4500,
    image: "/images/placeholder.jpg",
    location: "Budapest, XI. kerület",
    status: "ACTIVE", // ACTIVE, SOLD, FROZEN
  },
  messages: [
    {id: 1, text: "Szia! Megvan még a termék?", isMine: false, sentAt: "14:30"},
    {
      id: 2,
      text: "Szia! Igen, megvan még. Érdekelne?",
      isMine: true,
      sentAt: "14:32",
    },
    {
      id: 3,
      text: "Igen! Postázni tudnád esetleg? Budapestre kellene.",
      isMine: false,
      sentAt: "14:35",
    },
    {
      id: 4,
      text: "Persze, Foxposttal tudom küldeni. Az +1500 Ft lenne.",
      isMine: true,
      sentAt: "14:40",
    },
    {
      id: 5,
      text: "Rendben, akkor szeretném megvenni.",
      isMine: false,
      sentAt: "14:45",
    },
    {
      id: 6,
      text: "Rendben, küldöm az adatokat.",
      isMine: true,
      sentAt: "14:46",
    },
    {id: 7, text: "Köszönöm! Utaltam is.", isMine: false, sentAt: "14:50"},
    {
      id: 8,
      text: "Megjött, holnap feladom a csomagot! 😊",
      isMine: true,
      sentAt: "14:55",
    },
    {id: 9, text: "Szuper, várom!", isMine: false, sentAt: "15:00"},
  ],
};

export default function ChatRoom({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params);
  console.log(id);
  const [messages, setMessages] = useState(mockChatDetail.messages);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      text: newMessage,
      isMine: true,
      sentAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <div className="h-screen bg-[#F8F9FE] font-sans text-slate-800 flex flex-col overflow-hidden">
      {/* 1. Global Navigation */}
      <SubHeader />

      {/* 2. Main Layout - Split View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* --- LEFT COLUMN: CHAT INTERFACE (8/12) --- */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
            {/* Chat Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                <Link
                  href={`/user/${mockChatDetail.otherUser.id}`}
                  className="relative group">
                  <div className="w-10 h-10 bg-indigo-50 text-primary rounded-full flex items-center justify-center font-bold text-lg border border-indigo-100 group-hover:scale-105 transition-transform">
                    {mockChatDetail.otherUser.name.charAt(0)}
                  </div>
                  {/* Online dot indicator example */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </Link>
                <div>
                  <h1 className="font-bold text-slate-900 text-base leading-tight">
                    {mockChatDetail.otherUser.name}
                  </h1>
                  <p className="text-xs text-slate-400">
                    {mockChatDetail.otherUser.lastActive}
                  </p>
                </div>
              </div>

              {/* Mobile Listing Toggle (Visible only on small screens) */}
              <div className="lg:hidden text-xs font-bold text-primary">
                Hirdetés megtekintése
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-white scroll-smooth">
              {/* Date Separator */}
              <div className="flex justify-center py-4">
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-wider border border-slate-100">
                  Ma
                </span>
              </div>

              {messages.map((msg, index) => {
                const isMine = msg.isMine;
                const isSequence =
                  index > 0 && messages[index - 1].isMine === isMine;

                return (
                  <div
                    key={msg.id}
                    className={`flex w-full ${isMine ? "justify-end" : "justify-start"} ${isSequence ? "mt-1" : "mt-4"}`}>
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-5 py-3 text-[15px] leading-relaxed break-words whitespace-pre-wrap shadow-sm transition-all hover:shadow-md ${
                          isMine
                            ? "bg-primary text-white rounded-2xl rounded-tr-sm"
                            : "bg-[#F3F4F6] text-slate-800 border border-slate-100 rounded-2xl rounded-tl-sm"
                        }`}>
                        {msg.text}
                      </div>
                      <span
                        className={`text-[10px] text-slate-400 mt-1 px-1 font-medium select-none ${isSequence ? "hidden hover:block" : "block"}`}>
                        {msg.sentAt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Footer */}
            <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-white">
              <form onSubmit={handleSend} className="flex items-end gap-3">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                  <textarea
                    rows={1}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Írj egy üzenetet..."
                    className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 text-slate-800 placeholder-slate-400 resize-none max-h-32 min-h-[48px] text-base"
                    style={{height: "auto"}}
                    onInput={e => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="h-[48px] w-[48px] flex items-center justify-center bg-primary text-white rounded-xl hover:bg-[#5b4cc4] disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/20 disabled:shadow-none flex-shrink-0"></button>
              </form>
            </div>
          </div>

          {/* --- RIGHT COLUMN: SIDEBAR CONTEXT (4/12) --- */}
          {/* This is hidden on mobile, visible on desktop */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 overflow-y-auto pr-1">
            {/* 1. Listing Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                A Hirdetés
              </h3>

              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-slate-100">
                <img
                  src={mockChatDetail.listing.image}
                  alt="Listing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm">
                  {mockChatDetail.listing.status === "ACTIVE"
                    ? "Aktív"
                    : "Eladva"}
                </div>
              </div>

              <Link href={`/listing/${mockChatDetail.listing.id}`}>
                <h2 className="font-bold text-slate-900 text-lg leading-snug hover:text-primary transition-colors mb-2">
                  {mockChatDetail.listing.name}
                </h2>
              </Link>

              <div className="text-2xl font-bold text-primary mb-4">
                {mockChatDetail.listing.price} Ft
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <div className="w-4 h-4 text-slate-400">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                {mockChatDetail.listing.location}
              </div>

              <Link
                href={`/listing/${mockChatDetail.listing.id}`}
                className="block w-full text-center py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
                Hirdetés megtekintése
              </Link>
            </div>

            {/* 2. Safety / Tips Card */}
            <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-full text-primary shadow-sm"></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Biztonságos vásárlás
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Soha ne utalj előre, ha nem vagy biztos az eladóban.
                    Használd a csomagküldő szolgáltatásokat utánvéttel.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Helper Links */}
            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-400 px-2">
              <button className="hover:text-primary transition-colors">
                Jelentés
              </button>
              <span>•</span>
              <button className="hover:text-primary transition-colors">
                Felhasználó tiltása
              </button>
              <span>•</span>
              <button className="hover:text-primary transition-colors">
                Segítség
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
