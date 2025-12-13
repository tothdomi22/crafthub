package com.dominik.crafthub.notification.repository;

import com.dominik.crafthub.notification.entity.NotificationEntity;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
  List<NotificationEntity> findAllByUser_Id(Long userId, Sort createdAt);

  List<NotificationEntity> findAllByUser_IdAndIsRead(Long userId, Boolean isRead, Sort createdAt);

  @Query(
      value =
          """
        SELECT * FROM notification n
        WHERE CAST(n.data ->> 'requestId' AS bigint) = :requestId
        """,
      nativeQuery = true)
  NotificationEntity findByRequestId(@Param("requestId") Long requestId);

  @Transactional
  @Modifying
  @Query(
      value =
          """
        UPDATE notification n
        SET is_read = TRUE
        WHERE CAST(n.data ->> 'listingId' AS bigint) = :listingId
        """,
      nativeQuery = true)
  void markAllReadByListingId(@Param("listingId") Long listingId);

  @Query(
      value =
          """
        SELECT * FROM notification n
        WHERE (CAST(n.data ->> 'purchaseRequestId' AS bigint) = :purchaseRequestId AND n.user_id = :userId)
        """,
      nativeQuery = true)
  NotificationEntity findByUserIdAndPurchaseRequestId(
      @Param("userId") Long userId, @Param("purchaseRequestId") Long purchaseRequestId);
}
