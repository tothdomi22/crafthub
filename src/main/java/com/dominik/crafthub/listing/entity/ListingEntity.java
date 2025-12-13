package com.dominik.crafthub.listing.entity;

import com.dominik.crafthub.conversation.entity.ConversationEntity;
import com.dominik.crafthub.favorite.entity.FavoriteEntity;
import com.dominik.crafthub.subcategory.entity.SubCategoryEntity;
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
@Table(name = "listing")
public class ListingEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "name")
  private String name;

  @Column(name = "price")
  private Integer price;

  @Column(name = "shippable")
  private Boolean shippable = false;

  @Column(name = "city")
  private String city;

  @Column(name = "created_at")
  private OffsetDateTime createdAt;

  @Column(name = "description")
  private String description;

  @Column(name = "status")
  @Enumerated(EnumType.STRING)
  private ListingStatusEnum status;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private UserEntity userEntity;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "sub_category_id")
  private SubCategoryEntity subCategoryEntity;

  @OneToMany(mappedBy = "listingEntity")
  private Set<ConversationEntity> conversationEntities = new LinkedHashSet<>();

  @OneToMany(mappedBy = "listingEntity")
  private Set<FavoriteEntity> favoriteEntities = new LinkedHashSet<>();
}
