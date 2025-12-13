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
      <div className="w-12 h-12 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden border border-slate-100">
        <img
          src={"/images/placeholder.jpg"}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <p className="text-sm text-slate-600 leading-snug mb-2">
          <span className="font-bold text-slate-900">
            {notif.data.requesterName}
          </span>{" "}
          jelezte, hogy megvásárolta a(z){" "}
          <span className="font-bold text-slate-900">
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
            className="flex-1 bg-primary hover:bg-[#5b4cc4] text-white text-xs font-bold py-2 rounded-lg shadow-sm flex items-center justify-center gap-1 transition-all">
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
            className="flex-1 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 text-xs font-bold py-2 rounded-lg transition-all">
            Elutasítás
          </button>
        </div>
      </div>
    </div>
  );
}
