"use client";

import React, {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import StarSVG from "/public/svgs/star.svg";
import {notifyError, notifySuccess} from "@/app/utils/toastHelper";

import useCreateReview from "@/app/hooks/review/useCreateReview";
import {ReviewCreationRequest} from "@/app/types/review";
import {ReviewRequestNotificationType} from "@/app/types/notification";

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  notif: ReviewRequestNotificationType;
}

export default function CreateReviewModal({
  isOpen,
  onClose,
  notif,
}: CreateReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [mounted, setMounted] = useState(false);

  const {mutate: createReview, isPending: isCreatReviewPending} =
    useCreateReview();

  // 1. Handle hydration to avoid "document is not defined" errors
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async () => {
    if (rating === 0 || !reviewText.trim()) {
      notifyError("Kérjük, töltsd ki az adatokat!");
      return;
    }
    const data: ReviewCreationRequest = {reviewText: reviewText, stars: rating};
    createReview(
      {purchaseRequestId: String(notif.data.purchaseRequestId), data: data},
      {
        onSuccess: () => {
          notifySuccess("Köszönjük az értékelést!");
        },
        onError: () => {
          notifyError("Hiba történt az értékelés mentésekor.");
        },
      },
    );
    onClose();
  };

  // 2. Prevent rendering on server or before mount
  if (!isOpen || !mounted) return null;

  // 3. The Modal Content
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 text-text-main font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={!isCreatReviewPending ? onClose : undefined}></div>

      {/* Modal Box */}
      <div className="relative bg-surface rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-background p-6 text-center border-b border-border">
          <h2 className="text-xl font-bold text-text-main">Értékelés írása</h2>
          <p className="text-sm text-text-muted mt-1">
            Hogyan zajlott az adásvétel vele:{" "}
            <span className="font-bold text-text-main">
              {notif.data.recipientName}
            </span>
            ?
          </p>
          <div className="text-xs font-medium text-primary mt-1 bg-primary/5 inline-block px-2 py-1 rounded">
            Termék: {notif.data.listingTitle}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none">
                  <StarSVG
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-text-muted text-text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="h-4 text-sm font-bold text-text-muted">
              {hoverRating === 1 && "Nagyon rossz"}
              {hoverRating === 2 && "Rossz"}
              {hoverRating === 3 && "Közepes"}
              {hoverRating === 4 && "Jó"}
              {hoverRating === 5 && "Kiváló!"}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Írd le a tapasztalataidat..."
              rows={4}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-text-main placeholder-slate-400 resize-none"></textarea>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isCreatReviewPending}
              className="flex-1 py-3 rounded-xl font-bold text-text-muted hover:bg-background transition-colors disabled:opacity-50">
              Mégse
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCreatReviewPending || rating === 0 || !reviewText}
              className="flex-[2] bg-primary hover:bg-primary-hover text-surface py-3 rounded-xl shadow-lg shadow-primary/20 font-bold transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isCreatReviewPending ? (
                <div className="w-5 h-5 border-2 border-surface/30 border-t-surface rounded-full animate-spin"></div>
              ) : (
                "Értékelés küldése"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 4. Use createPortal to render outside the Header
  return createPortal(modalContent, document.body);
}
