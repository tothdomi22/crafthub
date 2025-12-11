package com.dominik.crafthub.notification.dto;

import com.dominik.crafthub.notification.entity.NotificationPayload;

public record ListingExpiredPayload(Long listingId, String renewLink)
    implements NotificationPayload {}
