package com.dominik.crafthub.notification.dto;

import com.dominik.crafthub.notification.entity.NotificationPayload;
import com.dominik.crafthub.notification.entity.NotificationTypeEnum;
import java.time.OffsetDateTime;

public record NotificationDto(
    Long id,
    Boolean isRead,
    OffsetDateTime createdAt,
    NotificationTypeEnum type,
    NotificationPayload data) {}
