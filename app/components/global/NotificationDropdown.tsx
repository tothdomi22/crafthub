"use client";

import React, {useEffect, useRef, useState} from "react";
import BellSVG from "/public/svgs/bell.svg";
import {
  Notification,
  NotificationTypeEnum,
  NotificationWithUnreadMessage,
  ReviewRequestNotificationType,
} from "@/app/types/notification";
import {
  PurchaseRequestPatchRequest,
  PurchaseRequestStatusEnum,
} from "@/app/types/purchaseRequest";
import CreateReviewModal from "@/app/components/notification/CreateReviewModal";
import ReviewNotification from "@/app/components/notification/ReviewNotification";
import PurchaseRequestNotification from "@/app/components/notification/PurchaseRequestNotification";
import usePatchPurchaseRequest from "@/app/hooks/purchase-request/usePatchPurchaseRequest";

export default function NotificationDropdown({
  notificationsData,
}: {
  notificationsData: NotificationWithUnreadMessage | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewModalData, setReviewModalData] =
    useState<ReviewRequestNotificationType | null>(null);

  const {
    mutate: patchPurchaseRequestMutation,
    isPending: isPatchMutationPending,
  } = usePatchPurchaseRequest();

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

  const unreadCount =
    notificationsData?.notifications.filter(n => !n.isRead).length || 0;

  const handlePurchaseSelection = (
    e: React.MouseEvent,
    status: PurchaseRequestStatusEnum,
    id: string,
  ) => {
    e.stopPropagation();
    const data: PurchaseRequestPatchRequest = {status: status};
    patchPurchaseRequestMutation({purchaseRequestId: id, data: data});
  };

  const openReviewModal = (e: React.MouseEvent, notif: Notification) => {
    e.stopPropagation();
    if (notif.type == NotificationTypeEnum.REVIEW_REQUEST) {
      setReviewModalData(notif);
      setIsReviewModalOpen(true);
    }
    setIsOpen(false); // Close dropdown
  };

  if (!notificationsData) {
    return (
      <button className="relative p-2.5 rounded-xl text-text-muted hover:text-primary hover:bg-background transition-all">
        <BellSVG className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* --- TRIGGER BUTTON --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all ${
          isOpen
            ? "bg-background text-primary"
            : "text-text-muted hover:text-primary hover:bg-bg-hover"
        }`}>
        <BellSVG className="w-6 h-6" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface ring-1 ring-surface"></span>
        )}
      </button>

      {/* --- DROPDOWN MENU --- */}
      {isOpen && (
        <>
          {/* Mobile Backdrop: Darkens screen and handles clicks outside */}
          <div className="  sm:hidden" onClick={() => setIsOpen(false)} />

          <div
            className={`
            bg-surface rounded-2xl shadow-xl border border-border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200
            
            /* MOBILE STYLES: Fixed positioning centered on screen */
            fixed left-4 right-4 top-[72px] w-auto max-h-[75vh] origin-top
            
            /* DESKTOP STYLES: Absolute positioning anchored to button */
            sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:left-auto sm:w-96 sm:max-h-[500px] sm:origin-top-right
          `}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-background/50">
              <h3 className="font-bold text-text-main">Értesítések</h3>
              {unreadCount > 0 && (
                <button className="text-xs font-bold text-primary hover:underline">
                  Összes olvasott
                </button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto sm:max-h-[400px]">
              {notificationsData.notifications.length === 0 ? (
                <div className="p-8 text-center text-text-muted text-sm">
                  Nincs új értesítésed.
                </div>
              ) : (
                notificationsData.notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-border hover:bg-bg-hover transition-colors relative ${!notif.isRead ? "bg-surface/30" : ""}`}>
                    {/* Unread Indicator */}
                    {!notif.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    )}
                    {notif.type === NotificationTypeEnum.PURCHASE_REQUEST && (
                      <PurchaseRequestNotification
                        notif={notif}
                        isPatchMutationPending={isPatchMutationPending}
                        handlePurchaseSelection={handlePurchaseSelection}
                        key={notif.id}
                      />
                    )}
                    {notif.type === NotificationTypeEnum.REVIEW_REQUEST && (
                      <ReviewNotification
                        notif={notif}
                        openReviewModal={openReviewModal}
                        key={notif.id}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
      {reviewModalData && (
        <CreateReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setReviewModalData(null)}
          notif={reviewModalData}
        />
      )}
    </div>
  );
}
