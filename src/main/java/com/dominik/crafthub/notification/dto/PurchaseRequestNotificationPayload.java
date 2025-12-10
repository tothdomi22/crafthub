package com.dominik.crafthub.notification.dto;

import com.dominik.crafthub.notification.entity.NotificationPayload;

public record PurchaseRequestNotificationPayload(
    Long requestId, // So the seller can click "Accept" or "Decline"
    Long listingId, // To link back to the item
    String listingTitle, // Store the title snapshot so you don't need a DB join to show it
    Long requesterId, // Who is asking?
    String requesterName // "Alice"
    ) implements NotificationPayload {}
