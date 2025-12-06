import React from "react";
import Header from "@/app/components/global/Header";
import ListingsPage from "@/app/components/listing/ListingsPage";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FE] font-sans text-slate-800">
      <Header />
      <ListingsPage />
    </div>
  );
}
