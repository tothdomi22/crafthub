"use client";

import React, {useState} from "react";
import ArrowBackSVG from "/public/svgs/arrow-back.svg";
import BinSVG from "/public/svgs/bin.svg";
import AddPhotoSVG from "/public/svgs/add-photo.svg";
import TruckSVG from "/public/svgs/truck.svg";
import CheckSVG from "/public/svgs/check.svg";
import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {MainCategory, SubCategory} from "@/app/types/admin/category/category";
import useCreateListing from "@/app/hooks/listing/useCreateListing";
import {ListingRequest} from "@/app/types/listing";
import {notifyError, notifySuccess} from "@/app/utils/toastHelper";
import CityDropdown from "@/app/components/city/CityDropdown";
import CategoryDropdown from "@/app/components/category/CategoryDropdown";
import {City} from "@/app/types/city";
import {cityListQuery} from "@/app/queries/city.queries";
import {
  mainCategoryListQuery,
  subCategoryListQuery,
} from "@/app/queries/category.queries";

export default function CreateListing() {
  const router = useRouter();

  // --- STATE ---
  const [images] = useState<string[]>([]);
  const [canShip, setCanShip] = useState(true);
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<MainCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [city, setCity] = useState<City | null>(null);

  // --- QUERIES ---
  const {data: mainCategoriesData, isLoading: isMainCatsLoading} = useQuery(
    mainCategoryListQuery(),
  );
  const {data: subCategoriesData, isLoading: isSubCatsLoading} = useQuery(
    subCategoryListQuery(),
  );
  const {data: citiesData, isPending: isCitiesDataPending} =
    useQuery(cityListQuery());

  const {
    mutate: createListingMutation,
    isPending: isCreateListingMutationPending,
  } = useCreateListing();

  // --- VALIDATION ---
  const isFormValid =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    price !== "" &&
    Number(price) > 0 &&
    city !== null &&
    selectedMainCategory !== null &&
    selectedSubCategory !== null;

  // --- HANDLERS ---
  const removeImage = (index: number) => {
    console.log("Remove image at index:", index);
  };

  const handleMainCategoryChange = (category: MainCategory) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryChange = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const handleCreateListing = () => {
    if (!isFormValid || !selectedSubCategory?.id || !city) return;

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

  const inputClass =
    "w-full px-4 py-3 bg-background border border-border rounded-xl focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder-text-muted text-text-main";
  const labelClass = "block text-sm font-bold text-text-main mb-2";

  return (
    <div className="min-h-screen bg-background font-sans text-text-main pb-32">
      {/* --- HEADER --- */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border h-16 transition-all">
        <div className="max-w-3xl mx-auto px-4 h-full flex items-center justify-between relative">
          <button
            onClick={router.back}
            className="group flex items-center gap-2 text-text-muted hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-background">
            <ArrowBackSVG className="transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline font-semibold text-sm">
              Vissza
            </span>
          </button>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg text-text-main">
            Új hirdetés
          </div>
          <div className="w-16" />
        </div>
      </nav>

      {/* --- FORM --- */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <form
          className="flex flex-col gap-6"
          onSubmit={e => e.preventDefault()}>
          {/* 1. PHOTOS (Placeholder) */}
          <section className="bg-surface p-6 rounded-2xl shadow-sm border border-border-subtle">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-bold text-text-main">Képek</h2>
              <span className="text-xs font-medium text-text-muted bg-background px-2 py-1 rounded-md border border-border-subtle">
                {images.length} / 10
              </span>
            </div>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              Tölts fel jó minőségű képeket a termékedről. (A funkció jelenleg
              fejlesztés alatt).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-border-subtle">
                  <img
                    src={img}
                    alt="Upload"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-2 bg-surface/90 rounded-full text-text-muted hover:text-red-500">
                    <BinSVG />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="aspect-square rounded-xl border-2 border-dashed border-border bg-background text-text-muted flex flex-col items-center justify-center gap-3 cursor-not-allowed opacity-60">
                <div className="p-3 bg-surface rounded-full shadow-sm text-current">
                  <AddPhotoSVG />
                </div>
                <span className="text-xs font-bold">Fotó hozzáadása</span>
              </button>
            </div>
          </section>

          {/* 2. DETAILS */}
          <section className="bg-surface p-6 rounded-2xl shadow-sm border border-border-subtle flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main border-b border-border-subtle pb-4">
              Termék részletei
            </h2>

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

            <div>
              <label className={labelClass}>Leírás</label>
              <textarea
                rows={6}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Írd le az anyagokat, a méretet és a készítési folyamatot..."
                className={`${inputClass} resize-none`}></textarea>
            </div>

            {/* CATEGORIES - Stacked Vertically */}
            <div className="flex flex-col gap-6">
              <div>
                <label className={labelClass}>Kategória</label>
                <CategoryDropdown
                  data={mainCategoriesData}
                  value={selectedMainCategory}
                  onChange={handleMainCategoryChange}
                  isLoading={isMainCatsLoading}
                  placeholder="Válassz kategóriát"
                  position="relative" // Push animation
                />
              </div>

              <div>
                <label className={labelClass}>Alkategória</label>
                <CategoryDropdown
                  data={subCategoriesData?.filter(
                    sub => sub.mainCategory.id === selectedMainCategory?.id,
                  )}
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  isLoading={isSubCatsLoading}
                  disabled={!selectedMainCategory}
                  placeholder={
                    selectedMainCategory
                      ? "Válassz alkategóriát"
                      : "Előbb válassz főkategóriát"
                  }
                  position="relative" // Push animation
                />
              </div>
            </div>
          </section>

          {/* 3. PRICE & LOCATION */}
          <section className="bg-surface p-6 rounded-2xl shadow-sm border border-border-subtle flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main border-b border-border-subtle pb-4">
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
                  placeholder="0"
                  min={0}
                  className={`${inputClass} pr-12 text-lg font-semibold`}
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-text-muted font-bold pl-2 bg-transparent">
                  Ft
                </div>
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
                isMulti={false}
                position="relative" // Push animation
              />
            </div>

            <div
              onClick={() => setCanShip(!canShip)}
              className={`group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                canShip
                  ? "border-primary bg-primary/5 shadow-inner"
                  : "border-border hover:border-primary/50 hover:bg-background"
              }`}>
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full transition-colors ${canShip ? "bg-primary text-surface" : "bg-border-subtle text-text-muted"}`}>
                  <TruckSVG />
                </div>
                <div>
                  <div
                    className={`font-bold transition-colors ${canShip ? "text-primary" : "text-text-main"}`}>
                    Csomagküldéssel is
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">
                    Ezt a terméket tudom postán/futárral küldeni
                  </div>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${canShip ? "bg-primary border-primary scale-110" : "border-slate-300 bg-surface"}`}>
                {canShip && <CheckSVG className="text-surface w-3.5 h-3.5" />}
              </div>
            </div>
          </section>
        </form>
      </main>

      {/* --- STICKY FOOTER --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-md border-t border-border p-4 z-40">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button
            onClick={handleCreateListing}
            disabled={!isFormValid || isCreateListingMutationPending}
            className={`
                w-full font-bold py-4 rounded-xl shadow-lg transition-all text-lg flex justify-center items-center gap-2
                ${
                  !isFormValid || isCreateListingMutationPending
                    ? "bg-bg-disabled text-text-muted cursor-not-allowed shadow-none"
                    : "bg-primary hover:bg-primary-hover active:bg-active text-surface shadow-primary/25 active:scale-[0.98]"
                }
            `}>
            {isCreateListingMutationPending && (
              <span className="w-5 h-5 border-2 border-surface/30 border-t-surface rounded-full animate-spin"></span>
            )}
            Hirdetés létrehozása
          </button>
        </div>
      </div>
    </div>
  );
}
