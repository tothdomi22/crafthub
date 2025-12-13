import React from "react";
import getCurrentUser from "@/app/utils/getCurrentUser";
import SubHeader from "@/app/components/global/SubHeader";
import Favorites from "@/app/components/favorite/Favorites";

export default async function FavoritesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      <SubHeader user={user} />
      <Favorites />
    </div>
  );
}
