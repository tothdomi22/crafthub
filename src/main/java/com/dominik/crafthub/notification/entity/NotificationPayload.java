package com.dominik.crafthub.notification.entity;

import com.dominik.crafthub.notification.dto.ListingExpiredPayload;
import com.dominik.crafthub.notification.dto.PurchaseRequestNotificationPayload;
import com.dominik.crafthub.notification.dto.ReviewNotificationPayload;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
  @JsonSubTypes.Type(value = PurchaseRequestNotificationPayload.class, name = "purchase_request"),
  @JsonSubTypes.Type(value = ListingExpiredPayload.class, name = "listing_expired"),
  @JsonSubTypes.Type(value = ReviewNotificationPayload.class, name = "review_request")
})
public interface NotificationPayload {}
