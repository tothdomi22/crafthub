import React from "react";

export default function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
      {/* Image Container - Aspect [4/5] matches real card */}
      <div className="relative aspect-[4/5] bg-slate-200"></div>

      {/* Item Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          {/* Title Placeholder */}
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          {/* Price Placeholder */}
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
        </div>

        {/* Footer Placeholder */}
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Avatar Circle */}
            <div className="w-5 h-5 rounded-full bg-slate-200"></div>
            {/* Seller Name */}
            <div className="h-3 bg-slate-200 rounded w-16"></div>
          </div>
          {/* City */}
          <div className="h-3 bg-slate-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}
