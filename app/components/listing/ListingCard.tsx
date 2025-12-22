import React from "react";
import {Listing} from "@/app/types/listing";
import FavoriteSVG from "/public/svgs/favorite.svg";

export default function ListingCard({
  listing,
  showFooter = true,
  isManageFavoritePending,
  handleManageFavorite,
  isFavoritesPage = false,
}: {
  listing: Listing;
  showFooter?: boolean;
  isFavoritesPage?: boolean;
  isManageFavoritePending: boolean;
  handleManageFavorite: (listingId: number, isCurrentlyLiked: boolean) => void;
}) {
  const isNew = (itemCreatedDate: string) => {
    const createdDate = new Date(itemCreatedDate).getTime();
    const diffInDays = (Date.now() - createdDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };
  return (
    <div className="group bg-surface rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-surface overflow-hidden">
        <img
          src={"/images/placeholder.jpg"}
          alt={listing.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* 'New' Badge */}
        {isNew(listing.createdAt) && (
          <span className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
            Új
          </span>
        )}

        {/* Like Button */}
        <button
          disabled={isManageFavoritePending}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            handleManageFavorite(listing.id, listing.isLiked);
          }}
          title={listing.isLiked || isFavoritesPage ? "Eltávolítás" : "Mentés"}
          className={`
            absolute top-2 right-2 p-2 rounded-full shadow-sm backdrop-blur-sm z-10 
            transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center
            ${
              listing.isLiked || isFavoritesPage
                ? "bg-surface text-red-500 opacity-100"
                : "bg-surface/80 text-text-muted lg:opacity-0 group-hover:opacity-100 hover:bg-bg-hover hover:text-text-muted"
            }
          `}>
          <FavoriteSVG className={`w-5 h-5 transition-colors`} />
        </button>
      </div>

      {/* Item Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <div className="flex justify-between items-start gap-2">
            <p className="text-sm font-medium text-text-main line-clamp-1 group-hover:text-primary transition-colors">
              {listing.name}
            </p>
          </div>
          <h3 className="text-lg font-bold text-text-main">
            {listing.price} Ft
          </h3>
        </div>

        {/* Seller Info Footer */}
        {showFooter && (
          <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-border flex items-center justify-center text-[10px] font-bold text-text-muted">
                {listing.user.name.charAt(0)}
              </div>
              <span className="text-xs text-text-muted">
                {listing.user.name}
              </span>
            </div>
            <span className="text-[10px] text-text-muted font-medium">
              {listing.city.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
