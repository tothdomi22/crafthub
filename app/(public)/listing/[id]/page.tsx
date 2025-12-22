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
  const user = await getCurrentUser();

  if (!id || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-text-main font-sans pb-20">
      <SubHeader user={user} />
      <ListingDetails listingId={id} user={user} />
    </div>
  );
}
