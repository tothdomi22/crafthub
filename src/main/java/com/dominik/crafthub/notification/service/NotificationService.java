package com.dominik.crafthub.notification.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.notification.dto.NotificationDto;
import com.dominik.crafthub.notification.entity.NotificationPayload;
import com.dominik.crafthub.notification.entity.NotificationTypeEnum;
import com.dominik.crafthub.notification.mapper.NotificationMapper;
import com.dominik.crafthub.notification.repository.NotificationRepository;
import com.dominik.crafthub.user.entity.UserEntity;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class NotificationService {
  private final AuthService authService;
  private final NotificationRepository notificationRepository;
  private final NotificationMapper notificationMapper;

  public List<NotificationDto> listUserNotifications() {
    var user = authService.getCurrentUser();
    var notifications =
        notificationRepository.findAllByUser_Id(
            user.getId(), Sort.by(Sort.Direction.DESC, "createdAt"));
    return notifications.stream().map(notificationMapper::toDo).toList();
  }

  public void createNotification(
      UserEntity user, NotificationTypeEnum type, NotificationPayload data) {
    var notification = notificationMapper.toEntity(OffsetDateTime.now(), type, data, false, user);
    notificationRepository.save(notification);
  }
}
