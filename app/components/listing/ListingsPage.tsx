"use client";

import React, {useEffect, useState} from "react";
import {MainCategory} from "@/app/types/admin/category/category";
import {useQuery} from "@tanstack/react-query";
import useListMainCategory from "@/app/hooks/main-category/useListMainCategory";
import {Listing} from "@/app/types/listing";
import useListListings from "@/app/hooks/listing/useListListing";
import Link from "next/link";
import ListingCard from "@/app/components/listing/ListingCard";
import {Profile} from "@/app/types/profile";
import useGetProfile from "@/app/hooks/profile/useGetProfile";
import {User} from "@/app/types/user";
import ProfileOnboardingModal from "@/app/components/profile/ProfileOnboardingModal";

export default function ListingsPage({user}: {user: User | null}) {
  const [activeCategory, setActiveCategory] = useState<MainCategory | null>(
    null,
  );
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  const {data: mainCategoriesData} = useQuery<MainCategory[]>({
    queryFn: useListMainCategory,
    queryKey: ["mainCategories"],
  });

  const {data: listingData} = useQuery<Listing[]>({
    queryFn: useListListings,
    queryKey: ["listings"],
  });
  const {data: profileData} = useQuery<Profile>({
    queryFn: () => useGetProfile(String(user?.id)),
    queryKey: ["profile" + user?.id],
    enabled: !!user,
  });

  const handleSetCategory = (category: MainCategory) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  useEffect(() => {
    if (profileData) {
      setIsOnboardingOpen(
        !profileData.bio && !profileData.city && !profileData.birthDate,
      );
    }
  }, [profileData]);

  if (!listingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  const filteredListings = listingData?.filter(listing =>
    activeCategory
      ? listing.subCategory.mainCategory.id === activeCategory.id
      : true,
  );

  return (
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
        {filteredListings.map(item => (
          <Link key={item.id} href={`/listing/${item.id}`}>
            <ListingCard listing={item} />
          </Link>
        ))}
      </div>
      {user && (
        <ProfileOnboardingModal
          isOpen={isOnboardingOpen}
          onCloseAction={() => setIsOnboardingOpen(false)}
          user={user}
        />
      )}
    </main>
  );
}
