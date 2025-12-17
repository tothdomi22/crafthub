"use client";

import React, {useEffect, useRef, useState} from "react";
import {MainCategory} from "@/app/types/admin/category/category";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import Link from "next/link";
import ListingCard from "@/app/components/listing/ListingCard";
import ListingCardSkeleton from "@/app/components/listing/ListingCardSkeleton"; // Import Skeleton
import {Profile} from "@/app/types/profile";
import useGetProfile from "@/app/hooks/profile/useGetProfile";
import {User} from "@/app/types/user";
import ProfileOnboardingModal from "@/app/components/profile/ProfileOnboardingModal";
import useManageFavorite from "@/app/hooks/favorite/useManageFavorite";
import {listingInfiniteQuery} from "@/app/queries/list.queries";
import {mainCategoryListQuery} from "@/app/queries/category.queries";

export default function ListingsPage({user}: {user: User | null}) {
  const [activeCategory, setActiveCategory] = useState<MainCategory | null>(
    null,
  );
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const observerTarget = useRef(null);

  const {data: mainCategoriesData} = useQuery(mainCategoryListQuery());

  const {
    data: listingData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(listingInfiniteQuery());

  const {data: profileData} = useQuery<Profile>({
    queryFn: () => useGetProfile(String(user?.id)),
    queryKey: ["profile" + user?.id],
    enabled: !!user,
  });

  const {mutate: manageFavoriteMutation, isPending: isManageFavoritePending} =
    useManageFavorite();

  const handleManageFavorite = (
    listingId: number,
    isCurrentlyLiked: boolean,
  ) => {
    manageFavoriteMutation({listingId, isCurrentlyLiked});
  };

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {threshold: 1.0},
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // --- INITIAL LOADING STATE ---
  // If loading the *first* page, show a full grid of skeletons
  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Skeleton Filters */}
        <div className="flex gap-3 overflow-hidden pb-8">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="h-10 w-24 bg-slate-200 rounded-xl animate-pulse"
            />
          ))}
        </div>

        {/* Skeleton Grid (8 items) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({length: 8}).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </main>
    );
  }

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
        {/* Render Real Items */}
        {listingData?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.content.map(item => (
              <Link key={item.id} href={`/listing/${item.id}`}>
                <ListingCard
                  listing={item}
                  handleManageFavorite={handleManageFavorite}
                  isManageFavoritePending={isManageFavoritePending}
                />
              </Link>
            ))}
          </React.Fragment>
        ))}

        {/* --- INFINITE SCROLL LOADING STATE --- */}
        {/* If fetching next page, append a row of skeletons directly into the grid */}
        {isFetchingNextPage && (
          <>
            {Array.from({length: 4}).map((_, i) => (
              <ListingCardSkeleton key={`skeleton-${i}`} />
            ))}
          </>
        )}
      </div>

      {/* Empty State */}
      {listingData?.pages[0].content.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-500">Nincs találat ebben a kategóriában.</p>
        </div>
      )}

      {/* Observer Trigger */}
      <div ref={observerTarget} className="py-10 flex justify-center w-full">
        {!hasNextPage && listingData?.pages[0].content.length !== 0 && (
          <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
            <span className="w-12 h-px bg-slate-200"></span>
            Vége a találatoknak
            <span className="w-12 h-px bg-slate-200"></span>
          </div>
        )}
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
