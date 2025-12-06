import React from "react";
import Header from "@/app/components/global/Header";
import ListingsPage from "@/app/components/listing/ListingsPage";
import ProfileOnboardingModal from "@/app/components/profile/ProfileOnboardingModal";
import getCurrentUser from "@/app/utils/getCurrentUser";

export default async function Home() {
  const user = await getCurrentUser();
  // const shouldShowOnboarding = user && profile && !profile.city;
  const shouldShowOnboarding = true;
  return (
    <div className="min-h-screen bg-[#F8F9FE] font-sans text-slate-800">
      <Header />
      <ListingsPage />
      {user && (
        <ProfileOnboardingModal
          isOpen={shouldShowOnboarding}
          // onCloseAction={}
          user={user}
        />
      )}
    </div>
  );
}
