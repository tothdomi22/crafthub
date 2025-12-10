package com.dominik.crafthub.notification.controller;

import com.dominik.crafthub.notification.exception.NotTheOwnerOfNotificationException;
import com.dominik.crafthub.notification.exception.NotificationNotFoundException;
import com.dominik.crafthub.notification.service.NotificationService;
import com.dominik.crafthub.user.exceptions.UserNotFoundException;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/notification")
public class NotificationController {
  private final NotificationService notificationService;

  @GetMapping("/list-all")
  public ResponseEntity<?> listAllNotifications() {
    var notificationDtoList = notificationService.listUserAllNotifications();
    return ResponseEntity.status(HttpStatus.OK).body(notificationDtoList);
  }

  @GetMapping("/list-unread")
  public ResponseEntity<?> listUnreadNotifications() {
    var notificationDtoList = notificationService.listUserUnreadNotifications();
    return ResponseEntity.status(HttpStatus.OK).body(notificationDtoList);
  }

  @PatchMapping("/mark-read/{id}")
  public ResponseEntity<?> markReadNotification(@PathVariable Long id) {
    notificationService.markNotificationRead(id);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<Map<String, String>> userNotFoud() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
  }

  @ExceptionHandler(NotTheOwnerOfNotificationException.class)
  public ResponseEntity<Map<String, String>> notTheOwner() {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(Map.of("message", "You are not the owner of the notification"));
  }

  @ExceptionHandler(NotificationNotFoundException.class)
  public ResponseEntity<Map<String, String>> notFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message", "Notification not found"));
  }
}
