"use client";

import React, {useState} from "react";
import useListMainCategory from "@/app/hooks/admin/main-category/useListMainCategory";
import {useQuery} from "@tanstack/react-query";
import {MainCategory} from "@/app/types/admin/category/category";
import useListListings from "@/app/hooks/listing/useListListing";
import {Listing} from "@/app/types/listing";
import Link from "next/link";
import ListingCard from "@/app/components/listing/ListingCard";
import Header from "@/app/components/global/Header";

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
                <ListingCard listing={item} />
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
}
