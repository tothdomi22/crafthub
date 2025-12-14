package com.dominik.crafthub.user.entity;

import com.dominik.crafthub.conversation.entity.ConversationEntity;
import com.dominik.crafthub.favorite.entity.FavoriteEntity;
import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.message.entity.MessageEntity;
import com.dominik.crafthub.messageread.entity.MessageReadEntity;
import com.dominik.crafthub.profile.entity.ProfileEntity;
import com.dominik.crafthub.review.entity.ReviewEntity;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "\"user\"")
public class UserEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "name")
  private String name;

  @Column(name = "email")
  private String email;

  @Column(name = "password")
  private String password;

  @Column(name = "role")
  @Enumerated(EnumType.STRING)
  private UserRole role;

  @Column(name = "is_deleted")
  private Boolean isDeleted;

  @Column(name = "created_at")
  private OffsetDateTime createdAt;

  @Column(name = "deleted_at")
  private OffsetDateTime deletedAt;

  @OneToMany(mappedBy = "userEntity1")
  private Set<ConversationEntity> conversationsOne = new LinkedHashSet<>();

  @OneToMany(mappedBy = "userEntity2")
  private Set<ConversationEntity> conversationsTwo = new LinkedHashSet<>();

  @OneToMany(mappedBy = "userEntity")
  private Set<ListingEntity> listingEntities = new LinkedHashSet<>();

  @OneToMany(mappedBy = "sender")
  private Set<MessageEntity> messageEntities = new LinkedHashSet<>();

  @OneToOne(mappedBy = "userEntity")
  private ProfileEntity profiles;

  @OneToMany(mappedBy = "reviewerUserEntity")
  private Set<ReviewEntity> reviews = new LinkedHashSet<>();

  @OneToMany(mappedBy = "userEntity")
  private Set<FavoriteEntity> favoriteEntities = new LinkedHashSet<>();

  @OneToMany(mappedBy = "userEntity")
  private Set<MessageReadEntity> messageReadEntities = new LinkedHashSet<>();
}
