"use client";

import React, {useState} from "react";
import useListMainCategory from "@/app/hooks/admin/main-category/useListMainCategory";
import {useQuery} from "@tanstack/react-query";
import {MainCategory} from "@/app/types/admin/category/category";
import useListListings from "@/app/hooks/listing/useListListing";
import {Listing} from "@/app/types/listing";
import Link from "next/link";
import FavoriteSVG from "/public/svgs/favorite.svg";

// --- Components (You could extract these) ---
// Unified Header Component Logic to match Detail view
const Header = () => (
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-white font-serif font-bold text-xl">A</span>
        </div>
        <span className="text-xl font-serif font-bold text-slate-900 hidden md:block tracking-tight">
          ArtisanSpace
        </span>
      </div>

      {/* Search Bar - Standardized Radius */}
      <div className="flex-1 max-w-2xl relative">
        <input
          type="text"
          className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all"
          placeholder="Keress kézzel készült kincseket..."
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href={"/create-listing"}>
          <button className="hidden sm:flex items-center gap-2 bg-primary hover:bg-[#5b4cc4] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-95">
            <span>Termék eladása</span>
          </button>
        </Link>
      </div>
    </div>
  </header>
);

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<MainCategory | null>(
    null,
  );

  const {data: mainCategoriesData} = useQuery<MainCategory[]>({
    queryFn: useListMainCategory,
    queryKey: ["mainCategories"],
  });

  const {data: listingData} = useQuery<Listing[]>({
    queryFn: useListListings,
    queryKey: ["listings"],
  });

  const isNew = (itemCreatedDate: string) => {
    const createdDate = new Date(itemCreatedDate).getTime();
    const diffInDays = (Date.now() - createdDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };

  const handleSetCategory = (category: MainCategory) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const filteredListings = listingData?.filter(listing =>
    activeCategory
      ? listing.subCategory.mainCategory.id === activeCategory.id
      : true,
  );

  return (
    <div className="min-h-screen bg-[#F8F9FE] font-sans text-slate-800">
      <Header />

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex items-center gap-3 overflow-x-auto pb-8 scrollbar-hide">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:border-primary text-slate-700 whitespace-nowrap transition-colors shadow-sm">
            Szűrés
          </button>
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          {mainCategoriesData &&
            mainCategoriesData.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleSetCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-primary/25"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"
                }`}>
                {cat.displayName}
              </button>
            ))}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings &&
            filteredListings.map(item => (
              <Link key={item.id} href={`/listing/${item.id}`}>
                {/* UNIFIED CARD STYLE: White bg, rounded-2xl, border */}
                <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                    <img
                      src={"/images/placeholder.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* 'New' Badge */}
                    {isNew(item.createdAt) && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
                        Új
                      </span>
                    )}

                    {/* Favorite Button */}
                    <button
                      className="absolute top-3 right-3 p-2 bg-white/60 backdrop-blur-md rounded-full text-slate-600 hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                      onClick={e => {
                        e.preventDefault();
                        // Add favorite logic here
                      }}>
                      <FavoriteSVG />
                    </button>
                  </div>

                  {/* Item Details */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="mb-2">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-medium text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                          {item.name}
                        </p>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {item.price} Ft
                      </h3>
                    </div>

                    {/* Seller Info Footer */}
                    <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {item.user.name.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-500">
                          {item.user.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.city}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
}
