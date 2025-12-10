package com.dominik.crafthub.notification.repository;

import com.dominik.crafthub.notification.entity.NotificationEntity;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
  List<NotificationEntity> findAllByUser_Id(Long userId, Sort createdAt);

  List<NotificationEntity> findAllByUser_IdAndIsRead(Long userId, Boolean isRead, Sort createdAt);
}
