"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import EditSVG from "/public/svgs/edit.svg";
import UserSVG from "/public/svgs/user.svg";
import LockSVG from "/public/svgs/lock.svg";
import MoonSVG from "/public/svgs/moon.svg";
import TrashSVG from "/public/svgs/bin.svg";
import CameraSVG from "/public/svgs/add-photo.svg";
import {useRouter} from "next/navigation";
import {notifyError, notifySuccess} from "@/app/utils/toastHelper";
import {useQuery} from "@tanstack/react-query";
import {
  ProfileAndUserUpdateProps,
  ProfileUpdateRequest,
} from "@/app/types/profile";
import {ChangePasswordRequest, User, UserUpdateRequest} from "@/app/types/user";
import useUpdateUser from "@/app/hooks/user/useUpdateUser";
import useUpdateProfile from "@/app/hooks/profile/useUpdateProfile";
import useChangePassword from "@/app/hooks/auth/useChangePassword";
import DeleteAccountModal from "@/app/components/settings/DeleteAccountModal";
import useDeleteUser from "@/app/hooks/user/useDeleteUser";
import {profileUserQuery} from "@/app/queries/profile.queries";
import CityDropdown from "@/app/components/city/CityDropdown";
import {cityListQuery} from "@/app/queries/city.queries";
import DarkModeToggle from "@/app/components/global/ToggleDarkMode";

export default function Settings({user}: {user: User}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileAndUserUpdateProps>({
    name: "",
    email: "",
    bio: "",
    city: null,
    birthDate: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const {data: profileData} = useQuery(profileUserQuery(user.id));
  const {data: citiesData, isPending: isCitiesDataPending} =
    useQuery(cityListQuery());

  const {mutateAsync: userUpdateMutation} = useUpdateUser();
  const {mutateAsync: profileUpdateMutation} = useUpdateProfile({
    userId: String(user.id),
  });
  const {mutate: changePasswordMutation} = useChangePassword();
  const {mutate: deleteUserMutation, isPending: isDeleteUserMutationPending} =
    useDeleteUser();

  useEffect(() => {
    if (profileData) {
      setProfile({
        name: profileData.user.name,
        email: profileData.user.email,
        bio: profileData.bio || "",
        city: profileData.city || null,
        birthDate: profileData.birthDate || "",
      });
    }
  }, [profileData]);

  // --- Handlers ---

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!profileData) {
      return;
    }

    const hasProfileChanged =
      profile.bio !== profileData.bio ||
      profile.birthDate !== profileData.birthDate ||
      profile.city !== profileData.city;

    try {
      if (profileData.user.name !== profile.name) {
        const data: UserUpdateRequest = {name: profile.name};
        await userUpdateMutation({
          data: data,
          id: String(user.id),
        });
      }
      if (hasProfileChanged) {
        const profileUpdateData: ProfileUpdateRequest = {
          city: profile.city ?? undefined,
          bio: profile.bio,
          birthDate: profile.birthDate,
        };
        await profileUpdateMutation(profileUpdateData);
      }
      notifySuccess("Profil sikeresen frissítve!");
    } catch (e) {
      console.error(e);
      notifyError("Hiba a profile frissítése közben!");
    }
    setIsLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !passwords.new.trim() ||
      !passwords.confirm.trim() ||
      !passwords.current.trim()
    ) {
      notifyError("Kérlek adj meg értékeket a jelszavaknak!");
      return;
    }

    if (passwords.new.length < 6 || passwords.new.length > 30) {
      notifyError("A jelszónak 6 és 30 karakter között kell lenni!");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      notifyError("Az új jelszavak nem egyeznek.");
      return;
    }
    const data: ChangePasswordRequest = {
      oldPassword: passwords.current,
      newPassword: passwords.new,
      newPasswordConfirmation: passwords.confirm,
    };
    changePasswordMutation(
      {data},
      {
        onSuccess() {
          notifySuccess("Jelszó sikeresen megváltoztatva.");
        },
        onError() {
          notifyError("Hiba történt a jelszó megváltoztatása közben!");
        },
      },
    );
    setPasswords({current: "", new: "", confirm: ""});
  };

  const handleDeleteAccount = async () => {
    deleteUserMutation(undefined, {
      onSuccess() {
        setIsDeleteModalOpen(false);
        router.push("/");
      },
      onError() {
        notifyError("Hiba történt a törlés során.");
      },
    });
  };

  // Styles
  const labelClass =
    "block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 ml-1";
  const inputClass =
    "w-full px-4 py-3 bg-background border border-border rounded-xl focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-text-main font-medium placeholder-text-muted";
  const sectionClass =
    "bg-surface p-6 sm:p-8 rounded-3xl shadow-sm border border-border mb-8";

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-secondary rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-secondary rounded"></div>
        </div>
      </div>
    );
  }
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-text-main mb-2">Beállítások</h1>
      <p className="text-text-muted mb-8">
        Kezeld a profilodat és a biztonsági beállításaidat.
      </p>

      {/* 1. PROFILE SETTINGS */}
      <section className={sectionClass}>
        <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
          <div className="p-2 bg-secondary text-primary rounded-full">
            <UserSVG className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-text-main">Profil adatok</h2>
        </div>

        <form onSubmit={handleUpdateProfile}>
          {/* Avatar Upload */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-surface shadow-sm overflow-hidden relative">
                {/* Replace with actual User Image */}
                <Image
                  src="/images/placeholder.jpg"
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <CameraSVG className="w-8 h-8 text-surface" />
                </div>
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 p-1.5 bg-primary text-surface rounded-full border-2 border-surface shadow-sm hover:scale-110 transition-transform">
                <EditSVG className="w-3 h-3" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-text-main">Profilkép módosítása</h3>
              <p className="text-xs text-text-muted mt-1 max-w-xs">
                Megengedett formátumok: JPG, PNG. Maximum méret: 2MB.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className={labelClass}>Teljes név</label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={labelClass}>Születési dátum</label>
              <input
                type="date"
                value={profile.birthDate}
                onChange={e =>
                  setProfile({...profile, birthDate: e.target.value})
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Lakhely (Város)</label>
              <CityDropdown
                value={profile.city}
                onChange={selectedCity =>
                  setProfile({...profile, city: selectedCity})
                }
                citiesData={citiesData}
                isLoading={isCitiesDataPending}
                placeholder="Pl. Budapest"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className={labelClass}>Email cím</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className={`${inputClass} bg-background text-text-muted cursor-not-allowed`}
            />
            <p className="text-[11px] text-text-muted mt-1.5 ml-1">
              Az email cím megváltoztatásához vedd fel a kapcsolatot az
              ügyfélszolgálattal.
            </p>
          </div>

          <div className="mb-8">
            <label className={labelClass}>Bemutatkozás (Bio)</label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={e => setProfile({...profile, bio: e.target.value})}
              className={`${inputClass} resize-none`}></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary-hover text-surface px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-70 flex items-center gap-2">
              {isLoading ? "Mentés..." : "Változtatások mentése"}
            </button>
          </div>
        </form>
      </section>

      {/* 2. PREFERENCES (Dark Mode) */}
      <section className={sectionClass}>
        <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
          <div className="p-2 bg-indigo-50 text-primary rounded-full">
            <MoonSVG className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-text-main">Megjelenés</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-text-main">Sötét mód</h3>
            <p className="text-sm text-text-muted mt-1">
              Kíméld a szemed gyenge fényviszonyok mellett.
            </p>
          </div>

          {/* Custom Toggle Switch */}
          <DarkModeToggle />
        </div>
      </section>

      {/* 3. SECURITY (Password) */}
      <section className={sectionClass}>
        <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
          <div className="p-2 bg-indigo-50 text-primary rounded-full">
            <LockSVG className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-text-main">Biztonság</h2>
        </div>

        <form onSubmit={handleChangePassword}>
          <div className="mb-6">
            <label className={labelClass}>Jelenlegi jelszó</label>
            <input
              type="password"
              value={passwords.current}
              onChange={e =>
                setPasswords({...passwords, current: e.target.value})
              }
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className={labelClass}>Új jelszó</label>
              <input
                type="password"
                value={passwords.new}
                onChange={e =>
                  setPasswords({...passwords, new: e.target.value})
                }
                className={inputClass}
                placeholder="Minimum 8 karakter"
              />
            </div>
            <div>
              <label className={labelClass}>Új jelszó megerősítése</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={e =>
                  setPasswords({...passwords, confirm: e.target.value})
                }
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-surface border border-border text-slate-700 hover:text-primary hover:border-primary px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-[0.98]">
              Jelszó módosítása
            </button>
          </div>
        </form>
      </section>

      {/* 4. DANGER ZONE */}
      <section className="bg-red-50 dark:bg-red-950 p-6 sm:p-8 rounded-3xl border border-red-100 dark:border-red-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-surface text-red-500 rounded-full shadow-sm">
            <TrashSVG className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-red-900">Veszélyzóna</h2>
        </div>

        <p className="text-red-700/80 mb-6 text-sm leading-relaxed">
          A fiókod törlése végleges és nem visszavonható. Minden hirdetésed,
          üzeneted és értékelésed elvész.
        </p>

        <div className="flex justify-end">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-surface text-red-600 border border-red-200 hover:bg-red-600 hover:text-surface hover:border-red-600 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-[0.98]">
            Fiók végleges törlése
          </button>
        </div>
      </section>
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleteUserMutationPending}
      />
    </main>
  );
}
