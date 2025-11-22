package com.dominik.crafthub.conversation.entity;

import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.message.entity.MessageEntity;
import com.dominik.crafthub.user.entity.UserEntity;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "conversation")
public class ConversationEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "created_at")
  private OffsetDateTime createdAt;

  @Column(name = "updated_at")
  private OffsetDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user1_id")
  private UserEntity userEntity1;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user2_id")
  private UserEntity userEntity2;

  @JoinColumn(name = "listing_id")
  @ManyToOne(fetch = FetchType.LAZY)
  private ListingEntity listingEntity;

  @OneToMany(mappedBy = "conversationEntity")
  private Set<MessageEntity> messageEntities = new LinkedHashSet<>();
}
