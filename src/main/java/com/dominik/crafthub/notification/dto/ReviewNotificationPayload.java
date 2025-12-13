package com.dominik.crafthub.notification.dto;

import com.dominik.crafthub.notification.entity.NotificationPayload;

public record ReviewNotificationPayload(
    Long PurchaseRequestId, String listingTitle, String recipientName)
    implements NotificationPayload {}
