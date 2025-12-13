interface BaseNotification {
  id: number;
  isRead: boolean;
  createdAt: string;
}

export enum NotificationTypeEnum {
  PURCHASE_REQUEST = "PURCHASE_REQUEST",
  LISING_EXPIRY = "LISTING_EXPIRY",
  REVIEW_REQUEST = "REVIEW_REQUEST",
}

interface PurchaseRequestNotification extends BaseNotification {
  type: NotificationTypeEnum.PURCHASE_REQUEST;
  data: PurchaseRequestData;
}

interface CommentNotification extends BaseNotification {
  type: NotificationTypeEnum.LISING_EXPIRY;
  data: ListingExpiryData;
}

interface ReviewRequestNotification extends BaseNotification {
  type: NotificationTypeEnum.REVIEW_REQUEST;
  data: ReviewRequestData;
}

interface PurchaseRequestData {
  requestId: number;
  listingId: number;
  listingTitle: string;
  requesterId: number;
  requesterName: string;
}

interface ReviewRequestData {
  listingTitle: string;
  recipientName: string;
  purchaseRequestId: number;
}

interface ListingExpiryData {
  listingId: number;
  listingTitle: string;
}

export type Notification =
  | PurchaseRequestNotification
  | CommentNotification
  | ReviewRequestNotification;
