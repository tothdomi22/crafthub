import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "full" | "mobile-short";
  colorMode?: "default" | "white"; // New prop
}

export default function BrandLogo({
  variant = "full",
  colorMode = "default",
}: BrandLogoProps) {
  const textColor = colorMode === "white" ? "text-white" : "text-text-main";
  const mutedColor =
    colorMode === "white" ? "text-white/80" : "text-text-muted";

  return (
    <Link href="/" className="flex items-baseline gap-1 group select-none">
      <span
        className={`font-bold tracking-tight transition-colors duration-300 ${textColor} ${variant === "mobile-short" ? "hidden sm:block text-xl" : "text-2xl"}`}>
        made
      </span>

      <span
        className={`font-serif italic font-medium ${mutedColor} ${variant === "mobile-short" ? "hidden sm:block text-xl" : "text-2xl"}`}>
        by
      </span>

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
