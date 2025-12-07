"use client";

import React, {useState} from "react";
import TrashSVG from "/public/svgs/bin.svg";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteAccountModalProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const REQUIRED_TEXT = "TÖRLÉS";

  if (!isOpen) return null;

  const isConfirmed = confirmationText === REQUIRED_TEXT;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={!isLoading ? onClose : undefined}></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header (Red Warning) */}
        <div className="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <TrashSVG className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-red-900">Fiók törlése</h2>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-slate-600 text-center mb-6 leading-relaxed text-sm">
            Biztosan törölni szeretnéd a fiókodat? <br />
            <strong>Ez a művelet végleges és nem visszavonható.</strong> Minden
            hirdetésed, üzeneted és mentett adatod azonnal elvész.
          </p>

          {/* Safety Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              A megerősítéshez írd be:{" "}
              <span className="text-red-600 select-all">
                &#34;{REQUIRED_TEXT}&#34;
              </span>
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={e => setConfirmationText(e.target.value)}
              placeholder={REQUIRED_TEXT}
              disabled={isLoading}
              className="w-full text-center font-bold tracking-widest px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none placeholder-slate-300 text-slate-900"
            />
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
              disabled={!isConfirmed || isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3 rounded-xl shadow-lg shadow-red-600/20 disabled:shadow-none font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Végleges törlés"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
