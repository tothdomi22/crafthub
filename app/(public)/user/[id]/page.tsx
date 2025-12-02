"use client";

import React, {use, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import useListListingById from "@/app/hooks/listing/useListListingById";
import {Listing} from "@/app/types/listing";
import useListReviewsById from "@/app/hooks/review/useListReviewsById";
import {Review} from "@/app/types/review";
import {formatDate} from "@/app/components/utils";
import Link from "next/link";

// --- TYPES & INTERFACES ---

interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  city: string;
  joinedDate: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  responseRate: string;
  shippingTime: string;
}

// --- ICON HELPER (Inlined for portability) ---
// Using the same style classes as previous files
interface IconProps {
  path: React.ReactNode;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({path, size = 20, className = ""}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    {path}
  </svg>
);

const icons = {
  mapPin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  star: (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  message: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  ),
  heart: (
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </>
  ),
  arrowBack: <path d="M19 12H5M12 19l-7-7 7-7" />,
};

// --- COMPONENT ---

export default function UserProfilePage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = use(params);
  const [activeTab, setActiveTab] = useState<"shop" | "reviews">("shop");
  if (!id) {
    return null;
  }

  const {data: listingData} = useQuery<Listing[]>({
    queryFn: () => useListListingById(id),
    queryKey: ["listings" + id],
  });
  const {data: reviewData} = useQuery<Review[]>({
    queryFn: () => useListReviewsById(id),
    queryKey: ["reviews" + id],
  });

  const isNew = (itemCreatedDate: string) => {
    const createdDate = new Date(itemCreatedDate).getTime();
    const diffInDays = (Date.now() - createdDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };
  // --- MOCK DATA ---
  const user: UserProfile = {
    id: "u1",
    name: "Sarah’s Ceramics",
    username: "@sarah_clay",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    bio: "Creating handmade functional pottery in Győr. Custom orders welcome! I use locally sourced clay and food-safe glazes.",
    city: "Győr, Hungary",
    joinedDate: "2023",
    isVerified: true,
    rating: 4.9,
    reviewCount: 24,
    responseRate: "1 óra",
    shippingTime: "1-2 nap",
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] font-sans text-slate-800 pb-20">
      {/* --- UNIFIED HEADER --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <button className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-slate-50">
            <Icon path={icons.arrowBack} />
            <span className="hidden sm:inline font-semibold text-sm">
              Vissza
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-serif font-bold text-lg">A</span>
            </div>
            <span className="font-serif font-bold text-xl text-slate-900 hidden sm:block">
              ArtisanSpace
            </span>
          </div>

          <button className="text-slate-400 hover:text-primary p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <Icon path={icons.share} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- HERO PROFILE CARD --- */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
          {/* Background Accent (Optional nice touch) */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-slate-50 to-[#F8F9FE]"></div>

          <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left mt-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md bg-slate-200"
              />
            </div>

            {/* User Details */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">
                    {user.name}
                  </h1>
                  <p className="text-slate-500 font-medium mb-3">
                    {user.username}
                  </p>

                  {/* Rating Badge */}
                  <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                    <div className="flex text-[#00B894]">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Icon
                          key={i}
                          path={icons.star}
                          size={14}
                          className={
                            i <= Math.round(user.rating)
                              ? "fill-current"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {user.rating}
                    </span>
                    <span className="text-xs text-slate-400 font-medium border-l border-slate-200 pl-2 ml-1">
                      {user.reviewCount} értékelés
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {/*<div className="flex gap-3 w-full md:w-auto">*/}
                {/*  <button className="flex-1 md:flex-none bg-primary hover:bg-[#5b4cc4] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2">*/}
                {/*    <Icon path={icons.message} size={18} />*/}
                {/*    Üzenet*/}
                {/*  </button>*/}
                {/*</div>*/}
              </div>

              {/* Bio & Stats */}
              <p className="mt-5 text-slate-600 leading-relaxed max-w-3xl">
                {user.bio}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6 pt-6 border-t border-slate-50 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <Icon
                    path={icons.mapPin}
                    size={18}
                    className="text-slate-400"
                  />
                  {user.city}
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    path={icons.calendar}
                    size={18}
                    className="text-slate-400"
                  />
                  Regisztrált: {user.joinedDate}
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
            Hirdetései ({listingData && listingData.length})
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
            Értékelések ({reviewData && reviewData.length})
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
              listingData.map(item => (
                <Link key={item.id} href={`/listing/${item.id}`}>
                  <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1">
                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                      <img
                        src={"/images/placeholder.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {isNew(item.createdAt) && (
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
                          Új
                        </span>
                      )}
                      <button className="absolute top-3 right-3 p-2 bg-white/60 backdrop-blur-md rounded-full text-slate-600 hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                        <Icon path={icons.heart} size={18} />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {item.price} Ft
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </p>
                    </div>
                  </div>
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
                      <h3 className="text-sm font-bold text-slate-900 hover:text-primary cursor-pointer truncate pr-4">
                        {review.listing.name}
                      </h3>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-[#00B894]">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Icon
                            key={i}
                            path={icons.star}
                            size={14}
                            className={
                              i <= review.stars
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
                        <span className="text-slate-400">Vásárló</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
