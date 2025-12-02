import React from "react";
import ArrowBackSVG from "/public/svgs/arrow-back.svg";
import ShareSVG from "/public/svgs/share.svg";
import {useRouter} from "next/navigation";

export default function SubHeader() {
  // TODO: make it use toast
  const copyURL = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        alert("Failed to copy URL");
      });
  };
  const router = useRouter();
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-slate-50">
          <ArrowBackSVG />
          <span className="hidden sm:inline font-semibold text-sm">Vissza</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-serif font-bold text-lg">A</span>
          </div>
          <span className="font-serif font-bold text-xl text-slate-900 hidden sm:block">
            ArtisanSpace
          </span>
        </div>

        <button
          onClick={copyURL}
          className="text-slate-400 hover:text-primary p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <ShareSVG />
        </button>
      </div>
    </nav>
  );
}
