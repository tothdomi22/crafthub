"use client";

import React from "react";
import Link from "next/link";
import FavoriteSVG from "/public/svgs/favorite.svg";
import {useQuery} from "@tanstack/react-query";
import {Favorite} from "@/app/types/favorite";
import useListFavorite from "@/app/hooks/favorite/useListFavorite";
import useManageFavorite from "@/app/hooks/favorite/useManageFavorite";
import ListingCard from "@/app/components/listing/ListingCard";

export default function Favorites() {
  const {data: favorites, isLoading} = useQuery<Favorite[]>({
    queryFn: useListFavorite,
    queryKey: ["favorites"],
    select: data =>
      [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
  });

  const {mutate: manageFavoriteMutation, isPending: isManageFavoritePending} =
    useManageFavorite();

  const handleManageFavorite = (
    listingId: number,
    isCurrentlyLiked: boolean,
  ) => {
    manageFavoriteMutation({listingId, isCurrentlyLiked});
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Kedvelt hirdetések
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {favorites?.length || 0} hirdetés kedvelve
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="bg-white rounded-2xl p-3 h-64 animate-pulse border border-slate-100">
              <div className="w-full h-40 bg-slate-200 rounded-xl mb-3"></div>
              <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : favorites?.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <FavoriteSVG className="w-8 h-8" />
          </div>
          <h3 className="text-slate-900 font-bold text-lg mb-1">
            Még nincs kedvelt hirdetésed
          </h3>
          <p className="text-slate-500 font-medium mb-6">
            Böngéssz a kategóriák között és kedveld, ami tetszik!
          </p>
          <Link href="/">
            <button className="bg-primary hover:bg-[#5b4cc4] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all">
              Hirdetések böngészése
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites?.map(fav => {
            const item = fav.listing;

            return (
              <Link href={`/listing/${item.id}`} key={fav.id} className="group">
                <ListingCard
                  listing={fav.listing}
                  isManageFavoritePending={isManageFavoritePending}
                  handleManageFavorite={listingId =>
                    handleManageFavorite(listingId, true)
                  }
                  isFavoritesPage={true}
                />
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
