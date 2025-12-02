import React from "react";
import {Listing} from "@/app/types/listing";
import FavoriteSVG from "/public/svgs/favorite.svg";

export default function ListingCard({
  listing,
  showFooter = true,
}: {
  listing: Listing;
  showFooter?: boolean;
}) {
  const isNew = (itemCreatedDate: string) => {
    const createdDate = new Date(itemCreatedDate).getTime();
    const diffInDays = (Date.now() - createdDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
        <img
          src={"/images/placeholder.jpg"}
          alt={listing.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* 'New' Badge */}
        {isNew(listing.createdAt) && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
            Új
          </span>
        )}

        {/* Favorite Button */}
        <button
          className="absolute top-3 right-3 p-2 bg-white/60 backdrop-blur-md rounded-full text-slate-600 hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
          onClick={e => {
            e.preventDefault();
            // TODO: Add favorite logic
          }}>
          <FavoriteSVG />
        </button>
      </div>

      {/* Item Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <div className="flex justify-between items-start gap-2">
            <p className="text-sm font-medium text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
              {listing.name}
            </p>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {listing.price} Ft
          </h3>
        </div>

        {/* Seller Info Footer */}
        {showFooter && (
          <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                {listing.user.name.charAt(0)}
              </div>
              <span className="text-xs text-slate-500">
                {listing.user.name}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {listing.city}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
