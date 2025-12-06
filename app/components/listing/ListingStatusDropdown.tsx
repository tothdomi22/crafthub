"use client";

import React, {useEffect, useRef, useState} from "react";
import {ListingStatusEnum} from "@/app/types/listing";
import KeyBoardArrowDownSVG from "/public/svgs/keyboard-arrow-down.svg";

interface ListingStatusDropdownProps {
  currentStatus: ListingStatusEnum;
  onStatusChange: (status: ListingStatusEnum) => void;
  isLoading?: boolean;
}

export default function ListingStatusDropdown({
  currentStatus,
  onStatusChange,
  isLoading = false,
}: ListingStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Configuration for each status
  const statusConfig = {
    [ListingStatusEnum.ACTIVE]: {
      label: "Aktív",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    [ListingStatusEnum.FROZEN]: {
      label: "Foglalt",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    [ListingStatusEnum.ARCHIVED]: {
      label: "Eladva",
      color: "text-slate-600",
      bg: "bg-slate-100",
      border: "border-slate-200",
      dot: "bg-slate-400",
    },
  };

  const currentConfig =
    statusConfig[currentStatus] || statusConfig[ListingStatusEnum.ACTIVE];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (status: ListingStatusEnum) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full sm:w-auto min-w-[220px]" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
          isOpen
            ? "ring-2 ring-primary/10 border-primary"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
        } bg-white`}>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Státusz:
          </span>

          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${currentConfig.dot}`}></span>
            <span className={`text-sm font-bold ${currentConfig.color}`}>
              {currentConfig.label}
            </span>
          </div>
        </div>

        <div
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <KeyBoardArrowDownSVG className="w-4 h-4" />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200 origin-top">
          <div className="p-1">
            {Object.values(ListingStatusEnum).map(status => {
              const config = statusConfig[status];
              const isActive = currentStatus === status;

              return (
                <button
                  key={status}
                  onClick={() => handleSelect(status)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                    isActive ? "bg-slate-50" : "hover:bg-slate-50"
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
                  <span
                    className={`text-sm font-medium ${isActive ? "text-slate-900 font-bold" : "text-slate-600"}`}>
                    {config.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-primary text-xs font-bold">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
