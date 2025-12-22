import React, {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import MoonSVG from "/public/svgs/moon.svg";

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const {setTheme, resolvedTheme} = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const isDarkMode = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${isDarkMode ? "bg-primary" : "bg-slate-200"}`}>
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center ${isDarkMode ? "translate-x-6" : "translate-x-0"}`}>
        {isDarkMode ? (
          <MoonSVG className="w-3 h-3 text-primary" />
        ) : (
          <div className="w-3 h-3 bg-slate-300 rounded-full" />
        )}
      </div>
    </button>
  );
}
