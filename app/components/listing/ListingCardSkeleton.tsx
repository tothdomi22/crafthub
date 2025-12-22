import React from "react";

export default function ListingCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-border-subtle shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-primary/10"></div>

      {/* Item Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          {/* Title Placeholder */}
          <div className="h-4 bg-primary/10 rounded w-3/4 mb-2"></div>
          {/* Price Placeholder */}
          <div className="h-6 bg-primary/10 rounded w-1/2"></div>
        </div>

        {/* Footer Placeholder */}
        <div className="mt-auto pt-3 border-t border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Avatar Circle */}
            <div className="w-5 h-5 rounded-full bg-primary/10"></div>
            {/* Seller Name */}
            <div className="h-3 bg-primary/10 rounded w-16"></div>
          </div>
          {/* City */}
          <div className="h-3 bg-primary/10 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}
