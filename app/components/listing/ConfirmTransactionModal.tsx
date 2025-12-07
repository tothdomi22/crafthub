"use client";

import React from "react";
import ShoppingBagSVG from "/public/svgs/shopping-bag.svg"; // Make sure you have this icon

interface ConfirmTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  productName: string;
  sellerName: string;
}

export default function ConfirmTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  productName,
  sellerName,
}: ConfirmTransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={!isLoading ? onClose : undefined}></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-emerald-50 p-6 flex flex-col items-center justify-center border-b border-emerald-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-emerald-500">
            <ShoppingBagSVG className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-emerald-900">
            Vásárlás jelzése
          </h2>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-slate-600 text-center mb-6 leading-relaxed text-sm">
            Ezzel jelzed <strong>{sellerName}</strong> felé, hogy megvásároltad
            a(z) <br />
            <span className="font-bold text-slate-900">
              &#34;{productName}&#34;
            </span>{" "}
            terméket.
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-xs text-slate-500">
            <p>ℹ️ Ha az eladó elfogadja a kérést:</p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>A hirdetés státusza &#34;Eladva&#34; lesz.</li>
              <li>Mindketten értékelhetitek egymást.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all disabled:opacity-50">
              Mégse
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl shadow-lg shadow-emerald-600/20 font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Megerősítés"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
