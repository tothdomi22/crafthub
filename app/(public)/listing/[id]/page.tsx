"use client";
import React, {use, useState} from "react";
import {Listing, ListingStatusEnum} from "@/app/types/listing";
import {useQuery} from "@tanstack/react-query";
import useGetListing from "@/app/hooks/listing/useGetListing";
import FavoriteSVG from "/public/svgs/favorite.svg";
import ArrowBackSVG from "/public/svgs/arrow-back.svg";
import ShareSVG from "/public/svgs/share.svg";
import LocationSVG from "/public/svgs/location.svg";
import ClockSVG from "/public/svgs/clock.svg";
import {useRouter} from "next/navigation";
import ChatSVG from "/public/svgs/chat.svg";

export default function ListingDetails({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = use(params);
  const [isSaved, setIsSaved] = useState(false);
  const {data: listingData} = useQuery<Listing>({
    queryFn: () => useGetListing(id),
    queryKey: ["listing" + id],
  });
  const router = useRouter();
  if (!listingData) {
    return <div>Loading</div>;
  }
  // const [activeImage, setActiveImage] = useState();

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const year = date.getFullYear(); // 4-digit year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] text-slate-800 font-sans pb-20">
      {/* --- HEADER / NAV (Simplified) --- */}
      <nav className="bg-white border-b border-slate-100 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
            <ArrowBackSVG />
            <span className="hidden sm:inline font-medium">Vissza</span>
          </button>
          <div className="font-serif font-bold text-xl text-primary">
            ArtisanSpace
          </div>
          <button className="text-slate-400 hover:text-primary">
            <ShareSVG />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* --- BREADCRUMBS --- */}
        <div className="text-sm text-slate-400 mb-6">
          Főoldal / {listingData.subCategory.mainCategory.displayName} /{" "}
          {listingData.subCategory.displayName} /{" "}
          <span className="text-slate-800 font-medium truncate">
            {listingData.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- LEFT COLUMN: IMAGES (7/12 width) --- */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Image Stage */}
            <div className="relative aspect-[4/5] sm:aspect-square bg-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={"/images/placeholder.jpg"}
                alt="Main view"
                className="w-full h-full object-cover"
              />

              {/* Status Overlays (The Freeze Logic) */}
              {listingData.status === ListingStatusEnum.FROZEN && (
                <div className="absolute inset-0 bg-yellow-100/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full font-bold text-xl shadow-lg transform -rotate-6 border-2 border-white">
                    RESERVED
                  </span>
                </div>
              )}
              {listingData.status === ListingStatusEnum.ARCHIVED && (
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-slate-700 text-white px-6 py-2 rounded-full font-bold text-xl shadow-lg border-2 border-slate-500">
                    SOLD
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {/*{listing.images.map((img, idx) => (*/}
              {/*  <button*/}
              {/*    key={idx}*/}
              {/*    onClick={() => setActiveImage(img)}*/}
              {/*    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${*/}
              {/*      activeImage === img*/}
              {/*        ? "border-primary ring-2 ring-primary/20"*/}
              {/*        : "border-transparent opacity-70 hover:opacity-100"*/}
              {/*    }`}>*/}
              {/*    <img*/}
              {/*      src={img}*/}
              {/*      alt={`View ${idx}`}*/}
              {/*      className="w-full h-full object-cover"*/}
              {/*    />*/}
              {/*  </button>*/}
              {/*))}*/}
            </div>
          </div>

          {/* --- RIGHT COLUMN: INFO & ACTIONS (5/12 width) --- */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Price & Title Block */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  {listingData.name}
                </h1>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-2 rounded-full transition-colors ${
                    isSaved
                      ? "text-red-500 bg-red-50"
                      : "text-slate-400 hover:bg-slate-50"
                  }`}>
                  <FavoriteSVG className={isSaved ? "fill-current" : ""} />
                </button>
              </div>

              <div className="text-3xl font-bold text-primary mb-4">
                {listingData.price}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 border-t border-slate-100 pt-4">
                <div>
                  <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">
                    Állapot
                  </span>
                  {/*{listing.condition}*/}
                </div>
                <div>
                  <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">
                    Feltöltve
                  </span>
                  {formatDate(listingData.createdAt)}
                </div>
              </div>
            </div>

            {/* Seller Card (The Trust Factor) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 bg-[#F4F1FA] rounded-full flex items-center justify-center text-primary font-bold text-xl border-2 border-white shadow-sm">
                  {/*{listing.seller.avatar}*/}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {listingData.user.name}
                    </h3>
                    <span className="text-sm font-medium text-slate-600">
                      {/*{listing.seller.rating}{" "}*/}
                      {4.9}{" "}
                      <span className="text-slate-400">
                        {/*({listing.seller.reviewCount})*/}
                        (10)
                      </span>
                    </span>
                  </div>

                  {/* Hardverapro Style Ratings */}
                  <div className="flex items-center gap-2 mt-1"></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-2 text-xs text-slate-400">
                <LocationSVG />
                <span>{listingData.city}</span>
                <span className="mx-1">•</span>
                <ClockSVG />
                <span>Regisztált: {}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3">Leírás</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {listingData.description}
              </p>
            </div>

            {/* Sticky Action Bar (For Mobile/Desktop Consistency) */}
            <div className="sticky bottom-4 z-40">
              {listingData.status === ListingStatusEnum.ACTIVE ? (
                <button className="w-full bg-primary hover:bg-[#5b4cc4] text-white py-4 rounded-xl shadow-lg shadow-indigo-200 font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <ChatSVG />
                  Üzenj az eladónak
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-slate-200 text-slate-400 py-4 rounded-xl font-bold text-lg cursor-not-allowed flex items-center justify-center gap-2">
                  {listingData.status === ListingStatusEnum.FROZEN
                    ? "Item Reserved"
                    : "Item Sold"}
                </button>
              )}

              {/* Trust Note */}
              <p className="text-center text-xs text-slate-400 mt-3">
                A fizetés és a szállítás közvetlenül az eladóval történik.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
