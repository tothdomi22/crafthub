"use client";

import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";
import {Listing, ListingStatusEnum} from "@/app/types/listing";
import useListMyListings from "@/app/hooks/listing/useListMyListings";
import {formatDate} from "@/app/components/utils";

// SVGs (Matching ListingDetails)
import LocationSVG from "/public/svgs/location.svg";
import ShowCredentialsSVG from "/public/svgs/show-credentials.svg";
import KeyBoardArrowDownSVG from "/public/svgs/keyboard-arrow-down.svg";
import FavoriteSVG from "/public/svgs/favorite.svg";
import EditSVG from "/public/svgs/edit.svg";

export default function MyListings() {
  const [activeTab, setActiveTab] = useState<ListingStatusEnum | "ALL">("ALL");

  const {data: listings, isLoading} = useQuery<Listing[]>({
    queryFn: useListMyListings,
    queryKey: ["my-listings"],
  });

  // Mock handler for status change
  const handleStatusChange = (id: number, newStatus: ListingStatusEnum) => {
    console.log("Change status to", newStatus);
    // updateStatus({ id, status: newStatus }, ...);
  };

  const filteredListings = listings?.filter(item => {
    if (activeTab === "ALL") return true;
    return item.status === activeTab;
  });

  // UI Helpers
  const getStatusLabel = (status: ListingStatusEnum) => {
    switch (status) {
      case ListingStatusEnum.ACTIVE:
        return "Aktív";
      case ListingStatusEnum.FROZEN:
        return "Foglalt (Jegelve)";
      case ListingStatusEnum.ARCHIVED:
        return "Eladva (Archivált)";
      default:
        return status;
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hirdetéseim</h1>
          <p className="text-slate-500 text-sm mt-1">
            {listings?.length || 0} hirdetés feltöltve
          </p>
        </div>
        <Link href="/create-listing">
          <button className="bg-primary hover:bg-[#5b4cc4] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
            + Új hirdetés
          </button>
        </Link>
      </div>

      {/* --- TABS --- */}
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2 no-scrollbar">
        {[
          {id: "ALL", label: "Összes"},
          {id: ListingStatusEnum.ACTIVE, label: "Aktív"},
          {id: ListingStatusEnum.FROZEN, label: "Foglalt"},
          {id: ListingStatusEnum.ARCHIVED, label: "Eladva"},
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
              activeTab === tab.id
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- LISTINGS LIST --- */}
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="text-slate-400 font-medium">Betöltés...</div>
          </div>
        ) : filteredListings?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
            <p className="text-slate-500 font-medium">
              Nincs megjeleníthető hirdetés.
            </p>
          </div>
        ) : (
          filteredListings?.map(listing => (
            <div
              key={listing.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 transition-all hover:border-primary/30 group">
              {/* 1. IMAGE */}
              <div className="relative w-full md:w-48 lg:w-56 aspect-[4/3] md:aspect-square flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                <img
                  src={"/images/placeholder.jpg"}
                  alt={listing.name}
                  className="w-full h-full object-cover"
                />

                {/* Status Overlays */}
                {listing.status === ListingStatusEnum.FROZEN && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg transform -rotate-6 border-2 border-white">
                      FOGLALT
                    </span>
                  </div>
                )}
                {listing.status === ListingStatusEnum.ARCHIVED && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-slate-800 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg border-2 border-slate-600">
                      ELADVA
                    </span>
                  </div>
                )}
              </div>

              {/* 2. DETAILS */}
              <div className="flex-1 flex flex-col">
                {/* Title & Date */}
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/listing/${listing.id}`}>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
                      {listing.name}
                    </h3>
                  </Link>
                  <div className="hidden sm:block text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">
                    {formatDate(listing.createdAt)}
                  </div>
                </div>

                {/* Price (Exact style match) */}
                <div className="text-2xl font-bold text-primary mb-4">
                  {listing.price} Ft
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {/* Location */}
                  <div>
                    <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Helyszín
                    </span>
                    <div className="flex items-center gap-1 font-medium text-slate-700 text-sm">
                      <LocationSVG className="w-3.5 h-3.5 text-slate-400" />
                      {listing.city}
                    </div>
                  </div>

                  {/* Views (Styled like the Seller Review count) */}
                  <div>
                    <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Megtekintés
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-sm">
                      <ShowCredentialsSVG className="w-4 h-4 text-slate-400" />
                      <span>0</span> {/* listing.viewCount */}
                    </div>
                  </div>

                  {/* Favorites */}
                  <div>
                    <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Mentések
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-sm">
                      <FavoriteSVG className="w-4 h-4 text-slate-400" />
                      <span>0</span>
                    </div>
                  </div>
                </div>

                {/* 3. ACTIONS BAR (Divider + Buttons) */}
                <div className="mt-auto pt-4 border-t border-slate-50 flex flex-col sm:flex-row gap-3 items-center">
                  {/* Status Select */}
                  <div className="relative w-full sm:w-auto min-w-[180px]">
                    <div className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-colors group/select">
                      <div className="flex items-col gap-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Státusz
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            listing.status === ListingStatusEnum.ACTIVE
                              ? "text-green-600"
                              : listing.status === ListingStatusEnum.FROZEN
                                ? "text-yellow-600"
                                : "text-slate-500"
                          }`}>
                          {getStatusLabel(listing.status)}
                        </span>
                      </div>
                      <KeyBoardArrowDownSVG className="w-4 h-4 text-slate-400" />
                    </div>
                    <select
                      value={listing.status}
                      onChange={e =>
                        handleStatusChange(
                          listing.id,
                          e.target.value as ListingStatusEnum,
                        )
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                      <option value={ListingStatusEnum.ACTIVE}>Aktív</option>
                      <option value={ListingStatusEnum.FROZEN}>
                        Foglalt (Jegelve)
                      </option>
                      <option value={ListingStatusEnum.ARCHIVED}>
                        Eladva (Archivált)
                      </option>
                    </select>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden sm:block"></div>

                  {/* Edit Button  */}
                  <Link
                    href={`/my-listings/edit/${listing.id}`}
                    className="w-full sm:w-auto">
                    <button className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                      <EditSVG className="w-4 h-4" />
                      Szerkesztés
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
