import KeyBoardArrowDownSVG from "*.svg";
import React from "react";

export default function CategoryDropdown() {
  return (
    <div className="relative">
      <select className="w-full px-4 py-3 bg-[#F8F9FE] border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer">
        {mainCategoriesData &&
          mainCategoriesData.map(mainCategory => (
            <option key={mainCategory.uniqueName} value={mainCategory.id}>
              {mainCategory.displayName}
            </option>
          ))}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
        <KeyBoardArrowDownSVG />
      </div>
    </div>
  );
}
