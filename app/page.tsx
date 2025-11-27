"use client";

import React, {useState} from "react";
import useListMainCategory from "@/app/hooks/admin/main-category/useListMainCategory";
import {useQuery} from "@tanstack/react-query";
import {MainCategory} from "@/app/types/admin/category/category";
import useListListings from "@/app/hooks/listing/useListListing";
import {Listing} from "@/app/types/listing";
import Link from "next/link";
import FavoriteSVG from "/public/svgs/favorite.svg";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<MainCategory | null>(
    null,
  );
  const {data: mainCategoriesData} = useQuery<MainCategory[]>({
    queryFn: useListMainCategory,
    queryKey: ["mainCategories"],
  });
  // const {data: subCategoriesData} = useQuery<SubCategory[]>({
  //   queryFn: useListSubCategory,
  //   queryKey: ["subCategories"],
  // });

  const {data: listingData} = useQuery<Listing[]>({
    queryFn: useListListings,
    queryKey: ["listings"],
  });

  console.log(listingData);
  const isNew = (itemCreatedDate: string) => {
    const createdDate = new Date(itemCreatedDate).getTime();
    const now = Date.now();
    const diffInMs = now - createdDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays <= 7;
  };

  const handleSetCategory = (category: MainCategory) => {
    if (activeCategory == category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  const filteredListings = listingData?.filter(listing =>
    activeCategory
      ? listing.subCategory.mainCategory.id === activeCategory.id
      : true,
  );

  return (
    <div className="min-h-screen bg-[#F8F9FE] font-sans text-slate-800">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-serif font-bold text-slate-900 hidden md:block">
              ArtisanSpace
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"></div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
              placeholder="Keress kézzel készült kincseket..."
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href={"/create-listing"}>
              <button className="hidden sm:flex items-center gap-1 bg-primary hover:bg-[#5b4cc4] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                <span>Termék eladása</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Filter */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:border-primary text-slate-700 whitespace-nowrap">
            Szűrés
          </button>
          <div className="h-8 w-px bg-slate-200 mx-1"></div>
          {mainCategoriesData &&
            mainCategoriesData.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleSetCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-active text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"
                }`}>
                {cat.displayName}
              </button>
            ))}
        </div>

        {/* Listings Grid - Vinted Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredListings &&
            filteredListings.map(item => (
              <Link key={item.id} href={`/listing/${item.id}`}>
                <div className="group flex flex-col gap-2">
                  {/* Image Card */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-200 shadow-sm group-hover:shadow-md transition-all cursor-pointer">
                    <img
                      src={"/images/placeholder.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* 'New' Badge */}
                    {isNew(item.createdAt) && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                        Új
                      </span>
                    )}

                    {/* Favorite Button Overlay */}
                    <button className="absolute top-3 right-3 p-2 bg-white/50 backdrop-blur-md rounded-full text-slate-700 hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                      <FavoriteSVG />
                    </button>
                  </div>

                  {/* Item Details */}
                  <div className="px-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {item.price} Ft
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-1">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    {/* Seller Info (Hardverapro Style) */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#F4F1FA] flex items-center justify-center text-[10px] font-bold text-primary">
                          {item.user.name.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-500 hover:text-primary cursor-pointer">
                          {item.user.name}
                        </span>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1">
                        <div className="text-[#00B894]"></div>
                        <span className="text-xs font-bold text-slate-700">
                          {/*{item.seller.rating}*/}
                          {4.9}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {/*({item.seller.reviews})*/}
                          (10)
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 mt-1 text-slate-400">
                      <span className="text-[10px]">{item.city}</span>
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
