package com.dominik.crafthub.notification.entity;

import com.dominik.crafthub.user.entity.UserEntity;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "notification")
public class NotificationEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "is_read")
  private Boolean isRead = false;

  @Column(name = "created_at")
  private OffsetDateTime createdAt;

  @Enumerated(EnumType.STRING)
  @Column(name = "type")
  private NotificationTypeEnum type;

  @Column(name = "data", columnDefinition = "jsonb")
  @JdbcTypeCode(SqlTypes.JSON)
  private NotificationPayload data;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private UserEntity user;
}
