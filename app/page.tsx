import React from "react";
import Header from "@/app/components/global/Header";
import ListingsPage from "@/app/components/listing/ListingsPage";
import getCurrentUser from "@/app/utils/getCurrentUser";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background font-sans text-slate-800">
      <Header />
      <ListingsPage user={user} />
    </div>
  );
}
