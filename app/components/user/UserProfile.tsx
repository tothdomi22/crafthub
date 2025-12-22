"use client";
import React, {useEffect, useRef, useState} from "react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {ReviewTypeEnum} from "@/app/types/review";
import LocationSVG from "/public/svgs/location.svg";
import CalendarSvg from "/public/svgs/calendar.svg";
import StarSvg from "/public/svgs/star.svg";
import Link from "next/link";
import ListingCard from "@/app/components/listing/ListingCard";
import ListingCardSkeleton from "@/app/components/listing/ListingCardSkeleton"; // Import the skeleton
import {formatDate} from "@/app/components/utils";
import useManageFavorite from "@/app/hooks/favorite/useManageFavorite";
import {listingInfiniteUserQuery} from "@/app/queries/listing.queries";
import {reviewUserQuery} from "@/app/queries/review.queries";
import {profileUserQuery} from "@/app/queries/profile.queries";

export default function UserProfile({id}: {id: string}) {
  const [activeTab, setActiveTab] = useState<"shop" | "reviews">("shop");
  const observerTarget = useRef(null);

  // --- INFINITE QUERY FOR LISTINGS ---
  const {
    data: listingData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isListingsLoading,
  } = useInfiniteQuery(listingInfiniteUserQuery(id, activeTab));

  const {data: reviewData} = useQuery(reviewUserQuery(id));

  const {data: profileData} = useQuery(profileUserQuery(id));

  const {mutate: manageFavoriteMutation, isPending: isManageFavoritePending} =
    useManageFavorite();

  const handleManageFavorite = (
    listingId: number,
    isCurrentlyLiked: boolean,
  ) => {
    manageFavoriteMutation({listingId, isCurrentlyLiked, userId: id});
  };

  // --- INFINITE SCROLL OBSERVER ---
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

  console.log(profileData);

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-secondary rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-secondary rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* --- HERO PROFILE CARD --- */}
      <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border mb-8 relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left mt-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={"/images/placeholder.jpg"}
              alt={"alt"}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-border shadow-md bg-bg-hover"
            />
          </div>

          {/* User Details */}
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5">
              <div>
                <h1 className="text-3xl font-bold text-text-main mb-1">
                  {profileData.user.name}
                </h1>

                {/* Rating Badge */}
                <div className="inline-flex items-center gap-2 bg-background px-4 py-1.5 rounded-full border border-border">
                  <div className="flex text-[#00B894]">
                    {[1, 2, 3, 4, 5].map(i => (
                      <StarSvg
                        key={i}
                        className={
                          i <= Math.round(profileData.review)
                            ? "fill-current"
                            : "text-text-muted"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-text-main">
                    {profileData.review.toFixed(1)}
                  </span>
                  <span className="text-xs text-text-muted font-medium border-l border-border pl-2 ml-1">
                    {profileData.reviewCount} értékelés
                  </span>
                </div>
              </div>
            </div>

            {/* Bio & Stats */}
            <p className="mt-5 text-text-muted leading-relaxed max-w-3xl">
              {profileData.bio}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6 pt-6 border-t border-border text-sm text-text-muted font-medium">
              {profileData.city && (
                <div className="flex items-center gap-2">
                  <LocationSVG />
                  {profileData.city.name}
                </div>
              )}

              <div className="flex items-center gap-2">
                <CalendarSvg />
                Regisztrált: {formatDate(profileData.user.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex items-center gap-8 border-b border-border mb-8">
        <button
          onClick={() => setActiveTab("shop")}
          className={`pb-3 text-sm font-bold transition-all relative px-1 ${
            activeTab === "shop"
              ? "text-primary"
              : "text-text-muted hover:text-text-main"
          }`}>
          Hirdetései ({listingData?.pages[0]?.totalElements || 0})
          {activeTab === "shop" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 text-sm font-bold transition-all relative px-1 ${
            activeTab === "reviews"
              ? "text-primary"
              : "text-text-muted hover:text-text-main"
          }`}>
          Értékelések ({profileData.reviewCount})
          {activeTab === "reviews" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
          )}
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      {activeTab === "shop" ? (
        /* ACTIVE LISTINGS GRID (Unified with Home Page) */
        <>
          {isListingsLoading ? (
            /* Initial Skeleton Load */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({length: 8}).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Render Real Items */}
              {listingData?.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.content.map(item => (
                    <Link key={item.id} href={`/listing/${item.id}`}>
                      <ListingCard
                        listing={item}
                        showFooter={false}
                        handleManageFavorite={handleManageFavorite}
                        isManageFavoritePending={isManageFavoritePending}
                      />
                    </Link>
                  ))}
                </React.Fragment>
              ))}

              {/* Append Loading Skeletons when fetching next page */}
              {isFetchingNextPage && (
                <>
                  {Array.from({length: 4}).map((_, i) => (
                    <ListingCardSkeleton key={`skeleton-${i}`} />
                  ))}
                </>
              )}
            </div>
          )}

          {/* Observer / End of List Trigger */}
          <div
            ref={observerTarget}
            className="py-10 flex justify-center w-full">
            {!hasNextPage &&
              listingData?.pages[0]?.content.length !== 0 &&
              !isListingsLoading && (
                <div className="flex items-center gap-2 text-text-main text-sm font-medium"></div>
              )}
          </div>
        </>
      ) : (
        /* REVIEWS LIST (Unified Card Style) */
        <div className="flex flex-col gap-4 max-w-4xl">
          {reviewData &&
            reviewData.map(review => (
              <div
                key={review.id}
                className="bg-surface p-5 rounded-2xl shadow-sm border border-border flex flex-col sm:flex-row gap-6 transition-colors hover:border-primary/30">
                {/* 1. THE SOLD ITEM (Visual Context) */}
                <div className="w-full sm:w-28 flex-shrink-0">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-background border border-border">
                    <img
                      src={"/images/placeholder.jpg"}
                      alt={review.listing.name}
                      className="w-full h-full object-cover opacity-90 grayscale-[20%]"
                    />
                    <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center backdrop-blur-[1px]">
                      <span className="bg-slate-800/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                        Eladva
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. THE REVIEW CONTENT */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/listing/${review.listing.id}`}>
                      <h3 className="text-sm font-bold text-text-main hover:text-primary cursor-pointer truncate pr-4">
                        {review.listing.name}
                      </h3>
                    </Link>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-[#00B894]">
                      {[1, 2, 3, 4, 5].map(i => (
                        <StarSvg
                          key={i}
                          className={
                            i <= Math.round(review.stars)
                              ? "fill-current"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-text-muted italic leading-relaxed">
                    &#34;{review.reviewText}&#34;
                  </p>
                </div>

                {/* 3. THE BUYER (Social Proof) */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-border sm:pl-6 sm:w-32 gap-3 min-w-max">
                  <div className="flex items-center gap-3 sm:flex-col sm:text-right">
                    <img
                      src={"/images/placeholder.jpg"}
                      alt={review.reviewerUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-border shadow-sm"
                    />
                    <div className="text-xs">
                      <span className="block font-bold text-text-main">
                        {review.reviewerUser.name}
                      </span>
                      <span className="text-text-muted">
                        {review.reviewType == ReviewTypeEnum.PURCHASER
                          ? "Vásárló"
                          : "Eladó"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
