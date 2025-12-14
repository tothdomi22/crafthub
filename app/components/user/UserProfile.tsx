"use client";
import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {ListingPagination} from "@/app/types/listing";
import useListListingById from "@/app/hooks/listing/useListListingById";
import {Review, ReviewTypeEnum} from "@/app/types/review";
import useListReviewsById from "@/app/hooks/review/useListReviewsById";
import {Profile} from "@/app/types/profile";
import useGetProfile from "@/app/hooks/profile/useGetProfile";
import LocationSVG from "/public/svgs/location.svg";
import CalendarSvg from "/public/svgs/calendar.svg";
import StarSvg from "/public/svgs/star.svg";
import Link from "next/link";
import ListingCard from "@/app/components/listing/ListingCard";
import {formatDate} from "@/app/components/utils";
import useManageFavorite from "@/app/hooks/favorite/useManageFavorite";

export default function UserProfile({id}: {id: string}) {
  const [activeTab, setActiveTab] = useState<"shop" | "reviews">("shop");
  const {data: listingData} = useQuery<ListingPagination>({
    queryFn: () => useListListingById(id),
    queryKey: ["listings" + id],
  });
  const {data: reviewData} = useQuery<Review[]>({
    queryFn: () => useListReviewsById(id),
    queryKey: ["reviews" + id],
  });
  const {data: profileData} = useQuery<Profile>({
    queryFn: () => useGetProfile(id),
    queryKey: ["profile" + id],
  });

  const {mutate: manageFavoriteMutation, isPending: isManageFavoritePending} =
    useManageFavorite();

  const handleManageFavorite = (
    listingId: number,
    isCurrentlyLiked: boolean,
  ) => {
    manageFavoriteMutation({listingId, isCurrentlyLiked, userId: id});
  };

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* --- HERO PROFILE CARD --- */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left mt-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={"/images/placeholder.jpg"}
              alt={"alt"}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md bg-slate-200"
            />
          </div>

          {/* User Details */}
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                  {profileData.user.name}
                </h1>

                {/* Rating Badge */}
                <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                  <div className="flex text-[#00B894]">
                    {/*FIXME: fix the filling of stars*/}
                    {[1, 2, 3, 4, 5].map(i => (
                      <StarSvg
                        key={i}
                        className={
                          i <= Math.round(profileData.review)
                            ? "fill-current"
                            : "text-slate-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {profileData.review.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium border-l border-slate-200 pl-2 ml-1">
                    {profileData.reviewCount} értékelés
                  </span>
                </div>
              </div>
              {/*Action Buttons*/}
              {/*<div className="flex gap-3 w-full md:w-auto">*/}
              {/*  <button className="flex-1 md:flex-none bg-primary hover:bg-[#5b4cc4] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2">*/}
              {/*    Üzenet*/}
              {/*  </button>*/}
              {/*</div>*/}
            </div>

            {/* Bio & Stats */}
            <p className="mt-5 text-slate-600 leading-relaxed max-w-3xl">
              {profileData.bio}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6 pt-6 border-t border-slate-50 text-sm text-slate-500 font-medium">
              {profileData.city && (
                <div className="flex items-center gap-2">
                  <LocationSVG />
                  {profileData.city}
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
      <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab("shop")}
          className={`pb-3 text-sm font-bold transition-all relative px-1 ${
            activeTab === "shop"
              ? "text-primary"
              : "text-slate-500 hover:text-slate-800"
          }`}>
          Hirdetései ({listingData && listingData.totalElements})
          {activeTab === "shop" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 text-sm font-bold transition-all relative px-1 ${
            activeTab === "reviews"
              ? "text-primary"
              : "text-slate-500 hover:text-slate-800"
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listingData &&
            listingData.content.map(item => (
              <Link key={item.id} href={`/listing/${item.id}`}>
                <ListingCard
                  listing={item}
                  showFooter={false}
                  handleManageFavorite={handleManageFavorite}
                  isManageFavoritePending={isManageFavoritePending}
                />
              </Link>
            ))}
        </div>
      ) : (
        /* REVIEWS LIST (Unified Card Style) */
        <div className="flex flex-col gap-4 max-w-4xl">
          {reviewData &&
            reviewData.map(review => (
              <div
                key={review.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 transition-colors hover:border-primary/30">
                {/* 1. THE SOLD ITEM (Visual Context) */}
                <div className="w-full sm:w-28 flex-shrink-0">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
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
                      <h3 className="text-sm font-bold text-slate-900 hover:text-primary cursor-pointer truncate pr-4">
                        {review.listing.name}
                      </h3>
                    </Link>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-[#00B894]">
                      {/*FIXME: fix the filling of stars*/}
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
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    &#34;{review.reviewText}&#34;
                  </p>
                </div>

                {/* 3. THE BUYER (Social Proof) */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-50 sm:pl-6 sm:w-32 gap-3 min-w-max">
                  <div className="flex items-center gap-3 sm:flex-col sm:text-right">
                    <img
                      src={"/images/placeholder.jpg"}
                      alt={review.reviewerUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                    />
                    <div className="text-xs">
                      <span className="block font-bold text-slate-900">
                        {review.reviewerUser.name}
                      </span>
                      <span className="text-slate-400">
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
