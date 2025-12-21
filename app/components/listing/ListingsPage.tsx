"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
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
import {cityListQuery} from "@/app/queries/city.queries";

// Components
import ListingCard from "@/app/components/listing/ListingCard";
import ListingCardSkeleton from "@/app/components/listing/ListingCardSkeleton";
import ProfileOnboardingModal from "@/app/components/profile/ProfileOnboardingModal";
import FilterSVG from "/public/svgs/filter.svg";
import FilterSidebar from "@/app/components/filter/FilterSidebar";

// Hooks
import useManageFavorite from "@/app/hooks/favorite/useManageFavorite";

export default function ListingsPage({user}: {user: User | null}) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // --- QUERIES ---
  const {data: mainCategoriesData} = useQuery(mainCategoryListQuery());
  const {data: subCategoriesData} = useQuery(subCategoryListQuery());
  const {data: profileData} = useQuery(profileUserQuery(user?.id));
  const {data: citiesData, isPending: isCitiesDataPending} =
    useQuery(cityListQuery());

  // --- 1. PARSE URL PARAMS (IDs) ---
  const urlFilters = useMemo(() => {
    const parseIds = (param: string | null) =>
      param
        ? param
            .split(",")
            .map(Number)
            .filter(n => !isNaN(n))
        : [];

    const mainId = searchParams.get("mainCategoryId");
    return {
      mainCategoryId: mainId ? Number(mainId) : null,
      subCategoryIds: parseIds(searchParams.get("subCategoryIds")),
      cityIds: parseIds(searchParams.get("cityIds")), // Get IDs here
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    };
  }, [searchParams]);

  // --- 2. PREPARE FILTER STATE FOR SIDEBAR (UI) ---
  // The Sidebar expects 'cities' to be City[] objects (id + name), not just IDs.
  // We reconstruct this array by finding the IDs in our 'citiesData'
  const initialFilters: FilterState = useMemo(() => {
    const selectedCities = citiesData
      ? citiesData.filter(city => urlFilters.cityIds.includes(city.id))
      : [];
    // Note: If citiesData is loading, this will be empty momentarily.
    // The Dropdown will populate once citiesData arrives.

    return {
      mainCategoryId: urlFilters.mainCategoryId,
      subCategoryIds: urlFilters.subCategoryIds,
      minPrice: urlFilters.minPrice,
      maxPrice: urlFilters.maxPrice,
      cities: selectedCities, // Pass full objects to UI
    };
  }, [urlFilters, citiesData]);

  // --- 3. PASS IDs TO BACKEND QUERY ---
  const queryOptions = listingInfiniteQuery({
    query: searchQuery,
    mainCategoryId: urlFilters.mainCategoryId ?? undefined,
    subCategoryIds: urlFilters.subCategoryIds,
    cityIds: urlFilters.cityIds, // Pass IDs directly to backend
    minPrice: urlFilters.minPrice ? Number(urlFilters.minPrice) : undefined,
    maxPrice: urlFilters.maxPrice ? Number(urlFilters.maxPrice) : undefined,
  });

  const {
    data: listingData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(queryOptions);

  // --- STATE ---
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const observerTarget = useRef(null);

  const {mutate: manageFavoriteMutation, isPending: isManageFavoritePending} =
    useManageFavorite();

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
            initialFilters={initialFilters} // Pass the hydrated objects
            mainCategories={mainCategoriesData}
            allSubCategories={subCategoriesData}
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

              {isFetchingNextPage &&
                Array.from({length: 3}).map((_, i) => (
                  <ListingCardSkeleton key={`skel-${i}`} />
                ))}
            </div>
          )}

          {!isLoading && listingData?.pages[0].content.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
              <p className="text-slate-500 font-medium">
                Nem találtunk a szűrésnek megfelelő terméket.
              </p>
            </div>
          )}

          <div ref={observerTarget} className="py-10 h-10 w-full" />
        </div>
      </div>

      {/* --- MOBILE FILTER DRAWER --- */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl p-0 animate-in slide-in-from-right duration-300">
            <div className="h-full overflow-y-auto">
              <FilterSidebar
                initialFilters={initialFilters}
                mainCategories={mainCategoriesData}
                allSubCategories={subCategoriesData}
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
