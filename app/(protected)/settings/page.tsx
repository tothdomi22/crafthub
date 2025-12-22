import React from "react";
import SubHeader from "@/app/components/global/SubHeader";
import getCurrentUser from "@/app/utils/getCurrentUser";
import Settings from "@/app/components/settings/Settings";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-background pb-20">
      <SubHeader user={user} />
      <Settings user={user} />
    </div>
  );
}
