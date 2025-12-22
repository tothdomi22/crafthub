"use client";

import React, {use, useEffect, useState} from "react";
import ArrowBackSVG from "/public/svgs/arrow-back.svg";
import BinSVG from "/public/svgs/bin.svg";
import AddPhotoSVG from "/public/svgs/add-photo.svg";
import KeyBoardArrowDownSVG from "/public/svgs/keyboard-arrow-down.svg";
import TruckSVG from "/public/svgs/truck.svg";
import CheckSVG from "/public/svgs/check.svg";
import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {MainCategory, SubCategory} from "@/app/types/admin/category/category";
import {ListingRequest} from "@/app/types/listing";
import useUpdateListing from "@/app/hooks/listing/useUpdateListing";
import {notifyError, notifySuccess} from "@/app/utils/toastHelper";
import {City} from "@/app/types/city";
import CityDropdown from "@/app/components/city/CityDropdown";
import {listingDetailQuery} from "@/app/queries/listing.queries";
import {cityListQuery} from "@/app/queries/city.queries";
import {
  mainCategoryListQuery,
  subCategoryListQuery,
} from "@/app/queries/category.queries";

export default function EditListing({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params);
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [canShip, setCanShip] = useState(true);
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<MainCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [city, setCity] = useState<City | null>(null);

  const {data: mainCategoriesData} = useQuery(mainCategoryListQuery());

  const {data: subCategoriesData} = useQuery(subCategoryListQuery());

  const {data: existingListing, isLoading: isFetching} = useQuery(
    listingDetailQuery(id),
  );

  const {data: citiesData, isPending: isCitiesDataPending} =
    useQuery(cityListQuery());

  const {mutate: updateListingMutation, isPending: isUpdating} =
    useUpdateListing();

  useEffect(() => {
    if (existingListing && mainCategoriesData && subCategoriesData) {
      setName(existingListing.name);
      setDescription(existingListing.description);
      setPrice(existingListing.price);
      setCity(existingListing.city);
      setCanShip(existingListing.canShip);
      // setImages(existingListing.images || []);

      // Handle Categories logic
      // 1. Find SubCategory
      const sub = subCategoriesData.find(
        s => s.id === existingListing.subCategory.id,
      );
      if (sub) {
        setSelectedSubCategory(sub);
        // 2. Find MainCategory based on Sub
        const main = mainCategoriesData.find(m => m.id === sub.mainCategory.id);
        if (main) setSelectedMainCategory(main);
      }
    }
  }, [existingListing, mainCategoriesData, subCategoriesData]);

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleMainCategoryChange = (value: string) => {
    if (value === "") {
      setSelectedMainCategory(null);
      setSelectedSubCategory(null);
      return;
    }
    const category = mainCategoriesData?.find(
      cat => String(cat.id) === String(value),
    );
    if (category) {
      setSelectedMainCategory(category);
      setSelectedSubCategory(null);
    }
  };

  const handleSubCategoryChange = (value: string) => {
    if (value === "") {
      setSelectedSubCategory(null);
      return;
    }
    const subCategory = subCategoriesData?.find(
      sub => String(sub.id) === value,
    );
    if (subCategory) setSelectedSubCategory(subCategory);
  };

  const handleUpdateListing = () => {
    if (!selectedSubCategory?.id || !city) return;

    const request: ListingRequest = {
      canShip: canShip,
      subCategoryId: selectedSubCategory.id,
      name: name,
      price: Number(price),
      city: city,
      description: description,
    };

    updateListingMutation(
      {id: id, data: request},
      {
        onSuccess() {
          notifySuccess("Hirdetés sikeresen frissítve!");
          router.back();
        },
        onError(e) {
          console.error(e);
          notifyError("Hiba történt a frissítés során!");
        },
      },
    );
  };

  // Shared Styles
  const inputClass =
    "w-full px-4 py-3 bg-background border border-border-subtle rounded-xl focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none placehotext-text-muted text-text-main";
  const labelClass = "block text-sm font-bold text-text-main mb-2";

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-text-main pb-32">
      {/* --- UNIFIED HEADER --- */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle h-16 transition-all">
        <div className="max-w-3xl mx-auto px-4 h-full flex items-center justify-between relative">
          <button
            onClick={router.back}
            className="group flex items-center gap-2 text-text-muted hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-background">
            <ArrowBackSVG className="transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline font-semibold text-sm">
              Mégse
            </span>
          </button>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg text-text-main">
            Hirdetés szerkesztése
          </div>
          <div className="w-16" />
        </div>
      </nav>

      {/* --- MAIN FORM --- */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <form
          className="flex flex-col gap-6"
          onSubmit={e => e.preventDefault()}>
          {/* 1. PHOTOS */}
          <section className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-bold text-text-main">Képek</h2>
              <span className="text-xs font-medium text-text-muted bg-background px-2 py-1 rounded-md border border-border">
                {images.length} / 10
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-border">
                  <img
                    src={img}
                    alt="Upload"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-2 bg-surface/90 backdrop-blur rounded-full text-text-muted hover:text-red-500 hover:bg-surface shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                    <BinSVG />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="aspect-square rounded-xl border-2 border-dashed border-border bg-background hover:bg-border hover:border-primary/50 text-text-muted flex flex-col items-center justify-center gap-3 transition-all group">
                <div className="p-3 bg-surface rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <AddPhotoSVG />
                </div>
              </button>
            </div>
          </section>

          {/* 2. DETAILS */}
          <section className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main border-b border-border pb-4">
              Adatok
            </h2>

            <div>
              <label className={labelClass}>Hirdetés címe</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Leírás</label>
              <textarea
                rows={6}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className={`${inputClass} resize-none`}></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Kategória</label>
                <div className="relative">
                  <select
                    value={selectedMainCategory?.id || ""}
                    onChange={e => handleMainCategoryChange(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Válassz</option>
                    {mainCategoriesData?.map(c => (
                      <option key={c.uniqueName} value={c.id}>
                        {c.displayName}
                      </option>
                    ))}
                  </select>
                  <KeyBoardArrowDownSVG className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Alkategória</label>
                <div className="relative">
                  <select
                    disabled={!selectedMainCategory}
                    value={selectedSubCategory?.id || ""}
                    onChange={e => handleSubCategoryChange(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer disabled:bg-border-subtle`}>
                    <option value="">Válassz</option>
                    {subCategoriesData
                      ?.filter(
                        s => s.mainCategory.id == selectedMainCategory?.id,
                      )
                      .map(s => (
                        <option key={s.uniqueName} value={s.id}>
                          {s.displayName}
                        </option>
                      ))}
                  </select>
                  <KeyBoardArrowDownSVG className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* 3. PRICE & LOGISTICS */}
          <section className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main border-b border-border pb-4">
              Ár & Szállítás
            </h2>

            <div>
              <label className={labelClass}>Ár (HUF)</label>
              <div className="relative">
                <input
                  value={price}
                  onChange={e =>
                    setPrice(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  type="number"
                  className={`${inputClass} pr-12`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">
                  Ft
                </span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Termék helye</label>
              <CityDropdown
                value={city}
                onChange={selectedCity => setCity(selectedCity)}
                citiesData={citiesData}
                isLoading={isCitiesDataPending}
                placeholder="Pl. Budapest"
              />
            </div>

            <div
              onClick={() => setCanShip(!canShip)}
              className={`group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${canShip ? "border-primary bg-primary/5" : "border-border-subtle hover:bg-background"}`}>
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${canShip ? "bg-primary text-surface" : "bg-border-subtle text-text-muted"}`}>
                  <TruckSVG />
                </div>
                <div>
                  <div
                    className={`font-bold ${canShip ? "text-primary" : "text-text-main"}`}>
                    Csomagküldéssel is
                  </div>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${canShip ? "bg-primary border-primary" : "border-border bg-surface"}`}>
                {canShip && <CheckSVG className="text-surface w-3.5 h-3.5" />}
              </div>
            </div>
          </section>
        </form>
      </main>

      {/* --- FOOTER --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-md border-t border-border-subtle p-4 z-40">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleUpdateListing}
            disabled={isUpdating}
            className="w-full bg-primary hover:bg-primary-hover text-surface font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
            {isUpdating && (
              <span className="w-5 h-5 border-2 border-surface/30 border-t-surface rounded-full animate-spin"></span>
            )}
            Mentés
          </button>
        </div>
      </div>
    </div>
  );
}
