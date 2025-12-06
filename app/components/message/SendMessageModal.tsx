import React, {useState} from "react";
import CloseSVG from "/public/svgs/close.svg";
import {Listing} from "@/app/types/listing";

export default function SendMessageModal({
  isOpen,
  onCloseAction,
  listing,
  sellerName,
  onSubmitAction,
  isSending = false,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  listing: Listing;
  sellerName: string;
  onSubmitAction: (message: string) => void;
  isSending?: boolean;
}) {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmitAction(message);
    }
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onCloseAction}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Üzenet küldése</h2>
          <button
            onClick={onCloseAction}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <CloseSVG className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {/* Context: Listing Summary Card */}
          <div className="flex gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="h-16 w-16 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-slate-200">
              <img
                src={"/images/placeholder.jpg"}
                alt={listing.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h3 className="font-bold text-slate-900 truncate text-sm mb-1">
                {listing.name}
              </h3>
              <p className="text-primary font-bold text-sm mb-1">
                {listing.price} Ft
              </p>
              <p className="text-xs text-slate-500 truncate">
                Címzett:{" "}
                <span className="font-medium text-slate-700">{sellerName}</span>
              </p>
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Üzenet szövege
            </label>
            <textarea
              autoFocus
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`Szia! Érdekelne a ${listing.name}, megvan még?`}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder-slate-400 text-slate-800 resize-none text-[15px] leading-relaxed"></textarea>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={onCloseAction}
              className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors">
              Mégse
            </button>
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className="flex-1 bg-primary hover:bg-[#5b4cc4] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed text-white py-3.5 rounded-xl shadow-lg shadow-primary/20 font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              {isSending ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="text-sm">Küldés</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
