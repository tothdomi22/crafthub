"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {notifyError, notifySuccess} from "@/app/utils/toastHelper";
import {User} from "@/app/types/user";

export default function ProfileOnboardingModal({
  isOpen,
  onCloseAction,
  user,
}: {
  isOpen: boolean;
  onCloseAction?: () => void;
  user: User;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Schema fields based on your diagram
  const [formData, setFormData] = useState({
    city: "",
    bio: "",
    date_of_birth: "",
  });

  // Mock Hook call - replace with your actual React Query mutation
  // const { mutateAsync: updateProfile } = useUpdateProfile();
  const updateProfile = async (data: string) => {
    console.log(data);
    console.log(user);
    /* mock implementation */ return true;
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.city || !formData.date_of_birth) {
      notifyError("A város és a születési dátum megadása kötelező.");
      setIsLoading(false);
      return;
    }

    try {
      await updateProfile("mock data");

      notifySuccess("Profil sikeresen frissítve!");
      router.refresh();
      // onCloseAction();
    } catch (error) {
      console.error(error);
      notifyError("Hiba történt a mentés során.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header with Image or Color */}
        <div className="bg-primary/5 p-8 text-center border-b border-primary/10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Üdvözlünk a közösségben! 👋
          </h2>
          <p className="text-slate-500 text-sm">
            Hogy a vásárlók és eladók jobban megismerhessenek, kérjük töltsd ki
            a profilodat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* CITY INPUT */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Város / Lakhely
            </label>
            <input
              type="text"
              placeholder="Pl. Budapest"
              value={formData.city}
              onChange={e => setFormData({...formData, city: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
            />
          </div>

          {/* BIO INPUT */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Bemutatkozás (Bio)
            </label>
            <textarea
              rows={3}
              placeholder="Írj pár szót magadról vagy a boltodról..."
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium resize-none"
            />
          </div>

          {/* DATE OF BIRTH INPUT */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Születési dátum
            </label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={e =>
                setFormData({...formData, date_of_birth: e.target.value})
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-slate-600"
            />
            <p className="text-[11px] text-slate-400 ml-1">
              A születési dátumot nem jelenítjük meg nyilvánosan, csak a kor
              ellenőrzéséhez szükséges.
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCloseAction} // Allow skipping if you want, or remove this button to force it
              className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">
              Később
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] bg-primary hover:bg-[#5b4cc4] text-white py-3.5 rounded-xl shadow-lg shadow-primary/20 font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              {isLoading ? "Mentés..." : "Profil létrehozása"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
