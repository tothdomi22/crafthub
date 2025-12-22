import React from "react";
import Link from "next/link";

export default function BrandLogo({
  variant = "full",
}: {
  variant?: "full" | "mobile-short";
}) {
  return (
    <Link href="/" className="flex items-baseline gap-1 group select-none">
      {/* LOGIC:
         If variant is 'mobile-short', hide 'made' and 'by' on small screens (hidden sm:block).
         If variant is 'full', always show them.
      */}
      <span
        className={`font-bold text-text-main tracking-tight group-hover:text-primary transition-colors duration-300 ${variant === "mobile-short" ? "hidden sm:block text-xl" : "text-2xl"}`}>
        made
      </span>

      <span
        className={`font-serif italic text-text-muted font-medium ${variant === "mobile-short" ? "hidden sm:block text-xl" : "text-2xl"}`}>
        by
      </span>

      {/* 'me' is always visible */}
      <div className="relative">
        <span
          className={`font-extrabold text-primary tracking-tight ${variant === "mobile-short" ? "text-xl sm:text-2xl" : "text-2xl"}`}>
          me
        </span>
        <span className="absolute -right-1.5 bottom-1.5 w-1.5 h-1.5 bg-danger-solid rounded-full animate-pulse"></span>
      </div>
    </Link>
  );
}
