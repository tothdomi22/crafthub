"use client";
import React, {use, useState} from "react";
import {Listing, ListingStatusEnum} from "@/app/types/listing";
import {useQuery} from "@tanstack/react-query";
import useGetListing from "@/app/hooks/listing/useGetListing";
import FavoriteSVG from "/public/svgs/favorite.svg";
import LocationSVG from "/public/svgs/location.svg";
import ChatSVG from "/public/svgs/chat.svg";
import Link from "next/link";
import {formatDate} from "@/app/components/utils";
import SubHeader from "@/app/components/global/SubHeader";
import {Profile} from "@/app/types/profile";
import useGetProfile from "@/app/hooks/profile/useGetProfile";
import SendMessageModal from "@/app/components/message/SendMessageModal";

export default function ListingDetails({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = use(params);
  const [isSaved, setIsSaved] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const {data: listingData} = useQuery<Listing>({
    queryFn: () => useGetListing(id),
    queryKey: ["listing" + id],
  });
  const {data: profileData} = useQuery<Profile>({
    queryFn: () => useGetProfile(String(listingData?.user.id)),
    queryKey: ["profile" + id],
    enabled: !!listingData,
  });

  if (!listingData || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  // TODO: implement logic
  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
    setIsMessageModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] text-slate-800 font-sans pb-20">
      <SubHeader />

      {/* --- CONTENT WRAPPER (Matching Home Width) --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm text-slate-500 mb-6 flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="hover:text-primary cursor-pointer transition-colors">
            Főoldal
          </span>{" "}
          /
          <span className="hover:text-primary cursor-pointer transition-colors">
            {listingData.subCategory.mainCategory.displayName}
          </span>{" "}
          /{" "}
          <span className="hover:text-primary cursor-pointer transition-colors">
            {listingData.subCategory.displayName}
          </span>{" "}
          /{" "}
          <span className="text-slate-900 font-semibold truncate">
            {listingData.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- LEFT COLUMN: IMAGES (7/12) --- */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <img
                src={"/images/placeholder.jpg"}
                alt="Main view"
                className="w-full h-full object-cover"
              />

              {/* Status Overlays */}
              {listingData.status === ListingStatusEnum.FROZEN && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-yellow-400 text-yellow-900 px-8 py-3 rounded-2xl font-bold text-xl shadow-xl transform -rotate-6 border-4 border-white">
                    FOGLALT
                  </span>
                </div>
              )}
              {listingData.status === ListingStatusEnum.ARCHIVED && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold text-xl shadow-xl border-4 border-slate-600">
                    ELADVA
                  </span>
                </div>
              )}
            </div>
            {/* Thumbnails would go here... */}
          </div>

          {/* --- RIGHT COLUMN: INFO (5/12) --- */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Price & Title Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-slate-900 leading-tight pr-4">
                  {listingData.name}
                </h1>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex-shrink-0 p-3 rounded-xl transition-all ${
                    isSaved
                      ? "text-red-500 bg-red-50"
                      : "text-slate-400 bg-slate-50 hover:bg-slate-100"
                  }`}>
                  <FavoriteSVG
                    className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              <div className="text-4xl font-bold text-primary mb-6">
                {listingData.price} Ft
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 border-t border-slate-100 pt-5">
                <div>
                  <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    Állapot
                  </span>
                  <span className="font-medium text-slate-900">Újszerű</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    Feltöltve
                  </span>
                  <span className="font-medium text-slate-900">
                    {formatDate(listingData.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-primary font-bold text-xl border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                  {listingData.user.name.charAt(0)}
                </div>

                <div className="flex-1">
                  <Link href={`/user/${listingData.user.id}`}>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">
                      {listingData.user.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <span className="font-bold text-[#00B894]">
                      {profileData.review}
                    </span>
                    <span>•</span>
                    <span>{profileData.reviewCount} értékelés</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <LocationSVG className="w-4 h-4 text-slate-400" />
                  <span>{listingData.city}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Leírás</h3>
              <p className="text-slate-600 leading-7 whitespace-pre-line text-[15px]">
                {listingData.description}
              </p>
            </div>

            {/* Action Bar (Sticky on Desktop too for ease) */}
            <div className="sticky bottom-4 z-40 pt-2">
              {listingData.status === ListingStatusEnum.ACTIVE ? (
                <button
                  onClick={() => setIsMessageModalOpen(true)}
                  className="w-full bg-primary hover:bg-[#5b4cc4] text-white py-4 rounded-xl shadow-lg shadow-primary/20 font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                  <ChatSVG className="w-6 h-6" />
                  Üzenj az eladónak
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-slate-100 text-slate-400 py-4 rounded-xl font-bold text-lg cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200">
                  {listingData.status === ListingStatusEnum.FROZEN
                    ? "Foglalt"
                    : "Eladva"}
                </button>
              )}
              <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                A fizetés és a szállítás közvetlenül az eladóval történik.
              </p>
            </div>
            {listingData && (
              <SendMessageModal
                isOpen={isMessageModalOpen}
                onCloseAction={() => setIsMessageModalOpen(false)}
                listing={listingData}
                sellerName={listingData.user.name}
                onSubmitAction={handleSendMessage}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
