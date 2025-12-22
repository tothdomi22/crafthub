import React from "react";
import SubHeader from "@/app/components/global/SubHeader";
import UserProfile from "@/app/components/user/UserProfile";
import getCurrentUser from "@/app/utils/getCurrentUser";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const user = await getCurrentUser();

  if (!id || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-text-main pb-20">
      {/* --- UNIFIED HEADER --- */}
      <SubHeader user={user} />
      <UserProfile id={id} />
    </div>
  );
}
