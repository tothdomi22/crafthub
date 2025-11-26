"use client";

import React, {useState} from "react";
import ArrowBackSVG from "/public/svgs/arrow-back.svg";
import BinSVG from "/public/svgs/bin.svg";
import AddPhotoSVG from "/public/svgs/add-photo.svg";
import KeyBoardArrowDownSVG from "/public/svgs/keyboard-arrow-down.svg";
import LocationSVG from "/public/svgs/location.svg";
import TruckSVG from "/public/svgs/truck.svg";
import CheckSVG from "/public/svgs/check.svg";

const CreateListing = () => {
  // --- MOCK STATE ---
  const [images, setImages] = useState([]);
  const [canShip, setCanShip] = useState(true);

  // Helper to simulate "deleting" an image
  const removeImage = (index: number) => {
    console.log(index);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] font-sans text-slate-800 pb-24">
      {/* --- HEADER --- */}
      <nav className="bg-white border-b border-slate-100 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowBackSVG />
            <span className="hidden sm:inline font-medium">Vissza</span>
          </button>
          <div className="font-bold text-lg text-slate-900">Új hirdetés</div>
          <button className="text-primary font-bold text-sm hover:underline"></button>
        </div>
      </nav>

      {/* --- MAIN FORM --- */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <form className="flex flex-col gap-8">
          {/* 1. PHOTOS SECTION */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Képek</h2>
            <p className="text-sm text-slate-400 mb-6">
              Adj hozzá legfeljebb 10 fotót. Az első fotó lesz a borító.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Image Slots */}
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                  <img
                    src={img}
                    alt="Upload"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-all opacity-0 group-hover:opacity-100">
                    <BinSVG />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 bg-slate-900/70 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase backdrop-blur-sm">
                      Borítókép
                    </span>
                  )}
                </div>
              ))}

              {/* Add Button */}
              <button
                type="button"
                className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-primary hover:text-primary text-slate-400 flex flex-col items-center justify-center gap-2 transition-all group">
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <AddPhotoSVG />
                </div>
                <span className="text-xs font-bold">Fotó hozzáadása</span>
              </button>
            </div>
          </section>

          {/* 2. DETAILS SECTION */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-slate-900">
              Termék részletei
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Hirdetés címe
              </label>
              <input
                type="text"
                placeholder="pl. Kézzel faragott diófa kanál"
                className="w-full px-4 py-3 bg-[#F8F9FE] border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Leírás
              </label>
              <textarea
                rows={5}
                placeholder="Írd le az anyagokat, a méretet és a készítési folyamatot..."
                className="w-full px-4 py-3 bg-[#F8F9FE] border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"></textarea>
            </div>

            {/* Categories (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Kategória
                </label>
                <div className="relative">
                  <select className="w-full px-4 py-3 bg-[#F8F9FE] border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer">
                    <option>Woodwork</option>
                    <option>Ceramics</option>
                    <option>Textiles</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                    <KeyBoardArrowDownSVG />
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Alkategória
                </label>
                <div className="relative">
                  <select className="w-full px-4 py-3 bg-[#F8F9FE] border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer">
                    <option>Kitchenware</option>
                    <option>Decor</option>
                    <option>Furniture</option>
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
            <h2 className="text-lg font-bold text-slate-900">Ár & Szállítás</h2>

            {/* Price Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Ár (HUF)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  className="w-full pl-4 pr-12 py-3 bg-[#F8F9FE] border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-lg font-bold"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 font-bold">
                  Ft
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Termék helye
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                  <LocationSVG />
                </div>
                <input
                  type="text"
                  defaultValue="Győr, Hungary" // Mock default from user profile
                  className="w-full pl-11 pr-4 py-3 bg-[#F8F9FE] border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
              </div>
            </div>

            {/* Shipping Toggle */}
            <div
              onClick={() => setCanShip(!canShip)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                canShip
                  ? "border-active bg-primary/5"
                  : "border-secondary hover:border-slate-300"
              }`}>
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${canShip ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>
                  <TruckSVG />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    Csomagküldéssel is
                  </div>
                  <div className="text-xs text-slate-500">
                    Ezt a terméket tudom postán/futárral küldeni
                  </div>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  canShip ? "bg-primary border-primary" : "border-slate-300"
                }`}>
                {canShip && <CheckSVG />}
              </div>
            </div>
          </section>
        </form>
      </main>

      {/* --- STICKY FOOTER --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-40">
        <div className="max-w-3xl mx-auto flex gap-4">
          {/*<button className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">*/}
          {/*  Előnézet*/}
          {/*</button>*/}
          <button className="flex-[2] bg-primary hover:bg-primary-hover active:bg-active text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-transform active:scale-95">
            Hirdetés létrehozása
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
