package com.dominik.crafthub.notification.dto;

import java.util.List;

public record NotificationsWIthMessageUnread(
    List<NotificationDto> notifications, Boolean unreadMessage) {}
