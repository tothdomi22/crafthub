"use client";

import React, {useState} from "react";
import {notifyError, notifySuccess} from "@/app/utils/toastHelper";
import {User} from "@/app/types/user";
import {useQuery} from "@tanstack/react-query";
import {City} from "@/app/types/city";
import CityDropdown from "@/app/components/city/CityDropdown";
import useCreateProfile from "@/app/hooks/profile/useCreateProfile";
import {cityListQuery} from "@/app/queries/city.queries";

export default function ProfileOnboardingModal({
  isOpen,
  onCloseAction,
  user,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  user: User;
}) {
  const {mutate: createProfileMutation, isPending: isMutationPending} =
    useCreateProfile({userId: String(user.id)});

  const {data: citiesData, isPending: isCitiesDataPending} =
    useQuery(cityListQuery());

  const [formData, setFormData] = useState<{
    city: City | null;
    bio: string;
    birthDate: string;
  }>({
    city: null,
    bio: "",
    birthDate: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.city || !formData.birthDate || !formData.bio) {
      return;
    }
    createProfileMutation(
      {
        bio: formData.bio,
        city: formData.city,
        birthDate: formData.birthDate,
      },
      {
        onSuccess() {
          notifySuccess("Profil sikeresen elmentve!");
          onCloseAction();
        },
        onError(e) {
          console.log(e);
          notifyError("Hiba a profile létrehozáskor. Próbálkozzon később!");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* 1. CONTAINER
         bg-white -> bg-surface
      */}
      <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* 2. HEADER
          text-slate-900 -> text-text-main
          text-slate-500 -> text-text-muted
        */}
        <div className="bg-primary/5 p-8 text-center border-b border-primary/10">
          <h2 className="text-2xl font-bold text-text-main mb-2">
            Üdvözlünk a közösségben! 👋
          </h2>
          <p className="text-text-muted text-sm">
            Hogy a vásárlók és eladók jobban megismerhessenek, kérjük töltsd ki
            a profilodat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* CITY SELECTOR */}
          <div className="space-y-1.5">
            {/* label: text-slate-700 -> text-text-main */}
            <label className="text-sm font-bold text-text-main ml-1">
              Lakhely
            </label>

            <CityDropdown
              value={formData.city}
              onChange={selectedCity =>
                setFormData({...formData, city: selectedCity})
              }
              citiesData={citiesData}
              isLoading={isCitiesDataPending}
              placeholder="Pl. Budapest"
            />
          </div>

          {/* BIO INPUT */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-text-main ml-1">
              Bemutatkozás (Bio)
            </label>
            {/* INPUTS:
               bg-slate-50 -> bg-bg-hover
               border-slate-200 -> border-border
               focus:bg-white -> focus:bg-surface
            */}
            <textarea
              rows={3}
              placeholder="Írj pár szót magadról vagy a boltodról..."
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="
                w-full px-4 py-3 rounded-xl font-medium resize-none transition-all outline-none
                bg-bg-hover border border-border text-text-main placeholder-text-muted
                focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10
              "
            />
          </div>

          {/* DATE OF BIRTH INPUT */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-text-main ml-1">
              Születési dátum
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={e =>
                setFormData({...formData, birthDate: e.target.value})
              }
              // Added 'dark:[color-scheme:dark]' so the calendar icon turns white in dark mode
              className="
                w-full px-4 py-3 rounded-xl font-medium transition-all outline-none dark:[color-scheme:dark]
                bg-bg-hover border border-border text-text-main placeholder-text-muted
                focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10
              "
            />
            <p className="text-[11px] text-text-muted ml-1">
              A születési dátumot nem jelenítjük meg nyilvánosan, csak a kor
              ellenőrzéséhez szükséges.
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isMutationPending}
              // Button now uses semantic hover and disabled states
              className="
                flex-[2] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                bg-primary text-white shadow-lg shadow-primary/20
                hover:bg-primary-hover
                disabled:bg-bg-disabled disabled:text-text-muted disabled:shadow-none disabled:cursor-not-allowed
              ">
              {isMutationPending ? "Mentés..." : "Profil mentése"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
