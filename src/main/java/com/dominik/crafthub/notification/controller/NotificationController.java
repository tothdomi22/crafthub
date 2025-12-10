package com.dominik.crafthub.notification.controller;

import com.dominik.crafthub.notification.service.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/notification")
public class NotificationController {
  private final NotificationService notificationService;

  @GetMapping("/list")
  public ResponseEntity<?> listNotifications() {
    var notificationDtoList = notificationService.listUserNotifications();
    return ResponseEntity.status(HttpStatus.OK).body(notificationDtoList);
  }
}
