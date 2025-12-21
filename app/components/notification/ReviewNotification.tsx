import React from "react";
import StarSVG from "/public/svgs/star.svg";
import {
  Notification,
  ReviewRequestNotificationType,
} from "@/app/types/notification";

export default function ReviewNotification({
  notif,
  openReviewModal,
}: {
  notif: ReviewRequestNotificationType;
  openReviewModal: (e: React.MouseEvent, notif: Notification) => void;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-300/40 text-yellow-500 rounded-lg flex-shrink-0 flex items-center justify-center border border-yellow-200 dark:border-yellow-200/30">
        <StarSVG className="w-6 h-6 fill-current" />
      </div>

      <div className="flex-1">
        <p className="text-sm text-text-muted leading-snug mb-2">
          Sikeres adásvétel! Kérlek értékeld a(z){" "}
          <span className="font-bold text-text-main">
            {notif.data.recipientName}
          </span>{" "}
          felhasználóval kötött tranzakciót a{" "}
          <span className="font-bold text-text-main">
            {notif.data.listingTitle}
          </span>{" "}
          termék kapcsán.
        </p>

        <button
          onClick={e => openReviewModal(e, notif)}
          className="w-full bg-primary hover:bg-primary-hover text-surface text-xs font-bold py-2 rounded-lg shadow-sm transition-all">
          Értékelés írása
        </button>
      </div>
    </div>
  );
}
