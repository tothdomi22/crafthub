import React from "react";
import SubHeader from "@/app/components/global/SubHeader";
import ListingDetails from "@/app/components/listing/ListingDetails";
import getCurrentUser from "@/app/utils/getCurrentUser";

export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const userId = await getCurrentUser();

  if (!id || !userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] text-slate-800 font-sans pb-20">
      <SubHeader />
      <ListingDetails listingId={id} userId={userId} />
    </div>
  );
}
