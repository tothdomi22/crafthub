"use client";

import React, {useEffect, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import Link from "next/link";

// Types & Queries
import {User} from "@/app/types/user";
import {FilterState} from "@/app/types/filters";
import {
  mainCategoryListQuery,
  subCategoryListQuery,
} from "@/app/queries/category.queries";
import {listingInfiniteQuery} from "@/app/queries/listing.queries";
import {profileUserQuery} from "@/app/queries/profile.queries";

// Components
import ListingCard from "@/app/components/listing/ListingCard";
import ListingCardSkeleton from "@/app/components/listing/ListingCardSkeleton";
import ProfileOnboardingModal from "@/app/components/profile/ProfileOnboardingModal";
import FilterSVG from "/public/svgs/filter.svg";
// Hooks
import useManageFavorite from "@/app/hooks/favorite/useManageFavorite";
import FilterSidebar from "@/app/components/filter/FilterSidebar";
import {cityListQuery} from "@/app/queries/city.queries";

export default function ListingsPage({user}: {user: User | null}) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // --- STATE ---
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const observerTarget = useRef(null);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    mainCategoryIds: [],
    subCategoryIds: [],
    cities: [],
    minPrice: "",
    maxPrice: "",
  });

  // --- QUERIES ---
  const {data: mainCategoriesData} = useQuery(mainCategoryListQuery());
  const {data: subCategoriesData} = useQuery(subCategoryListQuery());
  const {data: profileData} = useQuery(profileUserQuery(user?.id));
  const {data: citiesData, isPending: isCitiesDataPending} =
    useQuery(cityListQuery());

  const queryOptions = listingInfiniteQuery({
    query: searchQuery,
    mainCategoryIds: filters.mainCategoryIds,
    subCategoryIds: filters.subCategoryIds,
    cityIds: filters.cities.map(c => {
      return c.id;
    }),
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
  });

  const {
    data: listingData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(queryOptions);

  const {mutate: manageFavoriteMutation, isPending: isManageFavoritePending} =
    useManageFavorite();

  // --- HANDLERS ---
  const handleManageFavorite = (
    listingId: number,
    isCurrentlyLiked: boolean,
  ) => {
    manageFavoriteMutation({listingId, isCurrentlyLiked});
  };

  useEffect(() => {
    if (profileData) {
      setIsOnboardingOpen(
        !profileData.bio && !profileData.city && !profileData.birthDate,
      );
    }
  }, [profileData]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {threshold: 1.0},
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [observerTarget, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* --- PAGE TITLE & MOBILE FILTER TOGGLE --- */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">
          {searchQuery ? `Találatok erre: "${searchQuery}"` : ""}
        </h1>
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
          <FilterSVG className="w-4 h-4" /> Szűrés
        </button>
      </div>

      <div className="flex gap-8 items-start">
        {/* --- LEFT SIDEBAR (Desktop) --- */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24">
          <FilterSidebar
            mainCategories={mainCategoriesData}
            allSubCategories={subCategoriesData}
            filters={filters}
            setFilters={setFilters}
            citiesData={citiesData}
            isCitiesDataPending={isCitiesDataPending}
          />
        </aside>

        {/* --- RIGHT GRID --- */}
        <div className="flex-1">
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({length: 6}).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Results */}
          {!isLoading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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

              {/* Skeletons for Next Page */}
              {isFetchingNextPage &&
                Array.from({length: 3}).map((_, i) => (
                  <ListingCardSkeleton key={`skel-${i}`} />
                ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && listingData?.pages[0].content.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
              <p className="text-slate-500 font-medium">
                Nem találtunk a szűrésnek megfelelő terméket.
              </p>
            </div>
          )}

          {/* Observer Trigger */}
          <div ref={observerTarget} className="py-10 h-10 w-full" />
        </div>
      </div>

      {/* --- MOBILE FILTER DRAWER/MODAL --- */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          {/* Drawer Content */}
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl p-0 animate-in slide-in-from-right duration-300">
            <div className="h-full overflow-y-auto">
              <FilterSidebar
                mainCategories={mainCategoriesData}
                allSubCategories={subCategoriesData}
                filters={filters}
                setFilters={setFilters}
                className="border-none shadow-none h-full rounded-none"
                onClose={() => setIsMobileFilterOpen(false)}
                citiesData={citiesData}
                isCitiesDataPending={isCitiesDataPending}
              />
            </div>
          </div>
        </div>
      )}

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
