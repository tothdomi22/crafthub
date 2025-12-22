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
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={!isLoading ? onClose : undefined}></div>

      {/* Modal Content */}
      <div className="relative bg-surface rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-danger-bg p-6 flex flex-col items-center justify-center border-b border-danger-border">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center shadow-sm mb-4">
            <TrashSVG className="w-8 h-8 text-danger-solid" />
          </div>
          <h2 className="text-xl font-bold text-danger-text">Fiók törlése</h2>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-text-muted text-center mb-6 leading-relaxed text-sm">
            Biztosan törölni szeretnéd a fiókodat? <br />
            <strong>Ez a művelet végleges és nem visszavonható.</strong> Minden
            hirdetésed, üzeneted és mentett adatod azonnal elvész.
          </p>

          {/* Safety Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              A megerősítéshez írd be:{" "}
              <span className="text-danger-solid select-all">
                &#34;{REQUIRED_TEXT}&#34;
              </span>
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={e => setConfirmationText(e.target.value)}
              placeholder={REQUIRED_TEXT}
              disabled={isLoading}
              className="
                w-full text-center font-bold tracking-widest px-4 py-3
                bg-bg-hover border border-border rounded-xl
                focus:bg-surface focus:border-danger-solid focus:ring-4 focus:ring-danger-solid/10
                transition-all outline-none
                placeholder-text-muted/50 text-text-main
              "
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="
                flex-1 py-3 rounded-xl font-bold text-text-muted
                hover:bg-bg-hover border border-transparent hover:border-border
                transition-all disabled:opacity-50
              ">
              Mégse
            </button>

            <button
              onClick={onConfirm}
              disabled={!isConfirmed || isLoading}
              className="
                flex-1 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                bg-danger-solid shadow-danger-solid/20 hover:opacity-90
                disabled:bg-bg-disabled disabled:text-text-muted disabled:shadow-none disabled:cursor-not-allowed
              ">
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
