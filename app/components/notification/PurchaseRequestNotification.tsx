import React from "react";
import {PurchaseRequestStatusEnum} from "@/app/types/purchaseRequest";
import CheckSVG from "/public/svgs/check.svg";
import {PurchaseRequestNotificationType} from "@/app/types/notification";

export default function PurchaseRequestNotification({
  notif,
  isPatchMutationPending,
  handlePurchaseSelection,
}: {
  notif: PurchaseRequestNotificationType;
  isPatchMutationPending: boolean;
  handlePurchaseSelection: (
    e: React.MouseEvent,
    status: PurchaseRequestStatusEnum,
    id: string,
  ) => void;
}) {
  return (
    <div className="flex gap-4">
      {/* Placeholder Image - Ideally get from API */}
      <div className="w-12 h-12 bg-secondary rounded-lg flex-shrink-0 overflow-hidden border border-border">
        <img
          src={"/images/placeholder.jpg"}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <p className="text-sm text-text-muted leading-snug mb-2">
          <span className="font-bold text-text-main">
            {notif.data.requesterName}
          </span>{" "}
          jelezte, hogy megvásárolta a(z){" "}
          <span className="font-bold text-text-main">
            {notif.data.listingTitle}
          </span>{" "}
          termékedet.
        </p>

        <div className="flex gap-2">
          <button
            onClick={e =>
              handlePurchaseSelection(
                e,
                PurchaseRequestStatusEnum.ACCEPT,
                String(notif.data.requestId),
              )
            }
            disabled={isPatchMutationPending}
            className="flex-1 bg-primary hover:bg-primary-hover text-surface text-xs font-bold py-2 rounded-lg shadow-sm flex items-center justify-center gap-1 transition-all">
            <CheckSVG className="w-3.5 h-3.5" /> Elfogadás
          </button>
          <button
            onClick={e =>
              handlePurchaseSelection(
                e,
                PurchaseRequestStatusEnum.DECLINE,
                String(notif.data.requestId),
              )
            }
            disabled={isPatchMutationPending}
            className="flex-1 bg-surface border border-border hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 hover:border-red-200 dark:hover:border-red-800 text-text-muted text-xs font-bold py-2 rounded-lg transition-all">
            Elutasítás
          </button>
        </div>
      </div>
    </div>
  );
}
