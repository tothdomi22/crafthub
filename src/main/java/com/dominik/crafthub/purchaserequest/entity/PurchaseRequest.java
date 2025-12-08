package com.dominik.crafthub.purchaserequest.entity;

import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.user.entity.UserEntity;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "purchase_request")
public class PurchaseRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "created_at")
  private OffsetDateTime createdAt;

  @Enumerated(EnumType.STRING)
  @Column(name = "status")
  private PurchaseRequestStatusEnum status;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "listing_id")
  private ListingEntity listing;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "requester_user_id")
  private UserEntity requesterUser;
}
