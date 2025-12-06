import React from "react";
import SubHeader from "@/app/components/global/SubHeader";
import getCurrentUser from "@/app/utils/getCurrentUser";
import MyListings from "@/app/components/listing/MyListings"; // Assuming you have this from previous steps

export default async function MyListingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-[#F8F9FE] font-sans text-slate-800 pb-20">
      <SubHeader user={user} />
      <MyListings />
    </div>
  );
}
