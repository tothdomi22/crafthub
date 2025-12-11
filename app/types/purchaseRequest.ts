export enum PurchaseRequestStatusEnum {
  ACCEPT = "ACCEPT",
  DECLINE = "DECLINE",
}

export interface PurchaseRequestPatchRequest {
  status: PurchaseRequestStatusEnum;
}
