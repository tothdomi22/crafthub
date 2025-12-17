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
import useListMainCategory from "@/app/hooks/main-category/useListMainCategory";
import useListSubCategory from "@/app/hooks/sub-category/useListSubCategory";
import useUpdateListing from "@/app/hooks/listing/useUpdateListing";
import {notifyError, notifySuccess} from "@/app/utils/toastHelper";
import {City} from "@/app/types/city";
import CityDropdown from "@/app/components/city/CityDropdown";
import useListCity from "@/app/hooks/city/useListCity";
import {listingDetailQuery} from "@/app/queries/list.queries";

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

  const {data: mainCategoriesData} = useQuery<MainCategory[]>({
    queryFn: useListMainCategory,
    queryKey: ["mainCategories"],
  });

  const {data: subCategoriesData} = useQuery<SubCategory[]>({
    queryFn: useListSubCategory,
    queryKey: ["subCategories"],
  });

  const {data: existingListing, isLoading: isFetching} = useQuery(
    listingDetailQuery(id),
  );

  const {data: citiesData, isPending: isCitiesDataPending} = useQuery<City[]>({
    queryFn: useListCity,
    queryKey: ["cities"],
  });

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
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder-slate-400 text-slate-800";
  const labelClass = "block text-sm font-bold text-slate-700 mb-2";

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] font-sans text-slate-800 pb-32">
      {/* --- UNIFIED HEADER --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 transition-all">
        <div className="max-w-3xl mx-auto px-4 h-full flex items-center justify-between relative">
          <button
            onClick={router.back}
            className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-slate-50">
            <ArrowBackSVG className="transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline font-semibold text-sm">
              Mégse
            </span>
          </button>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg text-slate-900">
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
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-bold text-slate-900">Képek</h2>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                {images.length} / 10
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-slate-100">
                  <img
                    src={img}
                    alt="Upload"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-slate-400 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                    <BinSVG />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-primary/50 text-slate-400 flex flex-col items-center justify-center gap-3 transition-all group">
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <AddPhotoSVG />
                </div>
              </button>
            </div>
          </section>

          {/* 2. DETAILS */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">
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
                  <KeyBoardArrowDownSVG className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Alkategória</label>
                <div className="relative">
                  <select
                    disabled={!selectedMainCategory}
                    value={selectedSubCategory?.id || ""}
                    onChange={e => handleSubCategoryChange(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer disabled:bg-slate-100`}>
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
                  <KeyBoardArrowDownSVG className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* 3. PRICE & LOGISTICS */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">
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
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
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
              className={`group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${canShip ? "border-primary bg-primary/5" : "border-slate-200 hover:bg-slate-50"}`}>
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${canShip ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>
                  <TruckSVG />
                </div>
                <div>
                  <div
                    className={`font-bold ${canShip ? "text-primary" : "text-slate-900"}`}>
                    Csomagküldéssel is
                  </div>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${canShip ? "bg-primary border-primary" : "border-slate-300 bg-white"}`}>
                {canShip && <CheckSVG className="text-white w-3.5 h-3.5" />}
              </div>
            </div>
          </section>
        </form>
      </main>

      {/* --- FOOTER --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-40">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleUpdateListing}
            disabled={isUpdating}
            className="w-full bg-primary hover:bg-[#5b4cc4] text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
            {isUpdating && (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            Mentés
          </button>
        </div>
      </div>
    </div>
  );
}
