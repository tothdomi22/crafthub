package com.dominik.crafthub.favorite.entity;

import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.user.entity.UserEntity;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "favorite")
public class FavoriteEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id")
  private UserEntity userEntity;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "listing_id")
  private ListingEntity listingEntity;

  @Column(name = "created_at")
  private OffsetDateTime createdAt;
}
