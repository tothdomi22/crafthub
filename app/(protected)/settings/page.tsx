import React from "react";
import SubHeader from "@/app/components/global/SubHeader";
import getCurrentUser from "@/app/utils/getCurrentUser";
import Settings from "@/app/components/settings/Settings";
// import UserSVG from "/public/svgs/user.svg"; // Or a specific profile icon
// import LockSVG from "/public/svgs/lock.svg"; // You might need to add this
// import MoonSVG from "/public/svgs/moon.svg"; // You might need to add this

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      <SubHeader user={user} />
      <Settings />
    </div>
  );
}
