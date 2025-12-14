package com.dominik.crafthub.messageread.entity;

import com.dominik.crafthub.message.entity.MessageEntity;
import com.dominik.crafthub.user.entity.UserEntity;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "message_read")
public class MessageReadEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "message_id")
  private MessageEntity messageEntity;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private UserEntity userEntity;

  @Column(name = "read_at")
  private OffsetDateTime readAt;
}
