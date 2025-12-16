"use client";

import React, {useState} from "react";
import ArrowBackSVG from "/public/svgs/arrow-back.svg";
import BinSVG from "/public/svgs/bin.svg";
import AddPhotoSVG from "/public/svgs/add-photo.svg";
import KeyBoardArrowDownSVG from "/public/svgs/keyboard-arrow-down.svg";
import TruckSVG from "/public/svgs/truck.svg";
import CheckSVG from "/public/svgs/check.svg";
import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {MainCategory, SubCategory} from "@/app/types/admin/category/category";
import useCreateListing from "@/app/hooks/listing/useCreateListing";
import {ListingRequest} from "@/app/types/listing";
import useListMainCategory from "@/app/hooks/main-category/useListMainCategory";
import useListSubCategory from "@/app/hooks/sub-category/useListSubCategory";
import {notifyError, notifySuccess} from "@/app/utils/toastHelper";
import CityDropdown from "@/app/components/city/CityDropdown";
import {City} from "@/app/types/city";
import useListCity from "@/app/hooks/city/useListCity";

export default function CreateListing() {
  const router = useRouter();
  const [images] = useState<string[]>([]); // Added type safety
  const [canShip, setCanShip] = useState(true);
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<MainCategory | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | "">(""); // Allow empty string for input
  const [city, setCity] = useState<City | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);

  const {data: mainCategoriesData} = useQuery<MainCategory[]>({
    queryFn: useListMainCategory,
    queryKey: ["mainCategories"],
  });
  const {data: subCategoriesData} = useQuery<SubCategory[]>({
    queryFn: useListSubCategory,
    queryKey: ["subCategories"],
  });
  const {data: citiesData, isPending: isCitiesDataPending} = useQuery<City[]>({
    queryFn: useListCity,
    queryKey: ["cities"],
  });
  const {
    mutate: createListingMutation,
    isPending: isCreateListingMutationPending,
  } = useCreateListing();

  const removeImage = (index: number) => {
    console.log(index);
  };

  const handleMainCategoryChange = (value: string) => {
    if (value === "") {
      setSelectedMainCategory(null);
      setSelectedSubCategory(null);
      return;
    }
    if (!mainCategoriesData) return;
    const category = mainCategoriesData.find(
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
    if (!subCategoriesData) return;
    const subCategory = subCategoriesData.find(sub => String(sub.id) === value);
    if (subCategory) {
      setSelectedSubCategory(subCategory);
    }
  };

  const handleCreateListing = () => {
    if (!selectedSubCategory?.id || !city) {
      return;
    }
    const request: ListingRequest = {
      canShip: canShip,
      subCategoryId: selectedSubCategory.id,
      name: name,
      price: Number(price),
      city: city,
      description: description,
    };

    createListingMutation(request, {
      onSuccess() {
        notifySuccess("Hirdetés sikeresen létrehozva!");
        router.push("/");
      },
      onError(e) {
        console.error(e);
        notifyError("Hiba történt, Kérem próbálkozzon később!");
      },
    });
  };

  // Shared Input Class for consistency
  const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder-slate-400 text-slate-800";
  const labelClass = "block text-sm font-bold text-slate-700 mb-2";

  return (
    <div className="min-h-screen bg-[#F8F9FE] font-sans text-slate-800 pb-32">
      {/* --- UNIFIED HEADER --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 transition-all">
        <div className="max-w-3xl mx-auto px-4 h-full flex items-center justify-between relative">
          {/* Left button */}
          <button
            onClick={router.back}
            className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-slate-50">
            <ArrowBackSVG className="transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline font-semibold text-sm">
              Vissza
            </span>
          </button>

          {/* Center title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg text-slate-900">
            Új hirdetés
          </div>

          {/* Spacer for balance */}
          <div className="w-16" />
        </div>
      </nav>

      {/* --- MAIN FORM --- */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <form
          className="flex flex-col gap-6"
          onSubmit={e => e.preventDefault()}>
          {/* 1. PHOTOS SECTION */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-bold text-slate-900">Képek</h2>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                {images.length} / 10
              </span>
            </div>

            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Tölts fel jó minőségű képeket a termékedről. Az első feltöltött
              kép lesz a borítókép, ami megjelenik a keresőben.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Image Slots */}
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-slate-100">
                  <img
                    src={img}
                    alt="Upload"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-slate-400 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100 transform scale-90 hover:scale-100">
                    <BinSVG />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 bg-primary/90 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase backdrop-blur-sm shadow-sm tracking-wide">
                      Borító
                    </span>
                  )}
                </div>
              ))}

              {/* Add Button */}
              <button
                type="button"
                className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-primary/50 hover:text-primary text-slate-400 flex flex-col items-center justify-center gap-3 transition-all group">
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all text-current">
                  <AddPhotoSVG />
                </div>
                <span className="text-xs font-bold">Fotó hozzáadása</span>
              </button>
            </div>
          </section>

          {/* 2. DETAILS SECTION */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">
              Termék részletei
            </h2>

            {/* Title */}
            <div>
              <label className={labelClass}>Hirdetés címe</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="pl. Kézzel faragott diófa kanál"
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Leírás</label>
              <textarea
                rows={6}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Írd le az anyagokat, a méretet és a készítési folyamatot..."
                className={`${inputClass} resize-none`}></textarea>
            </div>

            {/* Categories (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* MAIN CATEGORY SELECT */}
              <div>
                <label className={labelClass}>Kategória</label>
                <div className="relative">
                  <select
                    value={selectedMainCategory?.id || ""}
                    onChange={e => handleMainCategoryChange(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Válassz kategóriát</option>
                    {mainCategoriesData?.map(mainCategory => (
                      <option
                        key={mainCategory.uniqueName}
                        value={mainCategory.id}>
                        {mainCategory.displayName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                    <KeyBoardArrowDownSVG />
                  </div>
                </div>
              </div>

              {/* SUB CATEGORY SELECT */}
              <div>
                <label className={labelClass}>Alkategória</label>
                <div className="relative">
                  <select
                    disabled={!selectedMainCategory}
                    value={selectedSubCategory?.id || ""}
                    onChange={e => handleSubCategoryChange(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed`}>
                    <option value="">
                      {selectedMainCategory
                        ? "Válassz alkategóriát"
                        : "Előbb válassz főkategóriát"}
                    </option>
                    {subCategoriesData &&
                      subCategoriesData
                        .filter(
                          subCategory =>
                            subCategory.mainCategory.id ==
                            selectedMainCategory?.id,
                        )
                        .map(subCategory => (
                          <option
                            key={subCategory.uniqueName}
                            value={subCategory.id}>
                            {subCategory.displayName}
                          </option>
                        ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                    <KeyBoardArrowDownSVG />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. PRICE & LOGISTICS */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">
              Ár & Szállítás
            </h2>

            {/* Price Input */}
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
                  placeholder="0"
                  min={0}
                  className={`${inputClass} pr-12 text-lg font-semibold`}
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 font-bold bg-slate-50 pl-2">
                  Ft
                </div>
              </div>
            </div>

            {/* Location */}
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

            {/* Shipping Toggle */}
            <div
              onClick={() => setCanShip(!canShip)}
              className={`group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                canShip
                  ? "border-primary bg-primary/5 shadow-inner"
                  : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
              }`}>
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full transition-colors ${
                    canShip
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-slate-100 text-slate-400 group-hover:bg-white"
                  }`}>
                  <TruckSVG />
                </div>
                <div>
                  <div
                    className={`font-bold transition-colors ${canShip ? "text-primary" : "text-slate-900"}`}>
                    Csomagküldéssel is
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Ezt a terméket tudom postán/futárral küldeni
                  </div>
                </div>
              </div>

              {/* Custom Checkbox visual */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  canShip
                    ? "bg-primary border-primary scale-110"
                    : "border-slate-300 bg-white"
                }`}>
                {canShip && <CheckSVG className="text-white w-3.5 h-3.5" />}
              </div>
            </div>
          </section>
        </form>
      </main>

      {/* --- STICKY FOOTER --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-40">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button
            onClick={handleCreateListing}
            disabled={isCreateListingMutationPending}
            className="w-full bg-primary hover:bg-[#5b4cc4] active:bg-active text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98] text-lg flex justify-center items-center gap-2">
            {isCreateListingMutationPending ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : null}
            Hirdetés létrehozása
          </button>
        </div>
      </div>
    </div>
  );
}
