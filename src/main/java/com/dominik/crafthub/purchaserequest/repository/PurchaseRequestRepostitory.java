package com.dominik.crafthub.purchaserequest.repository;

import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestEntity;
import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRequestRepostitory extends JpaRepository<PurchaseRequestEntity, Long> {
  Boolean existsByListing_IdAndStatus(Long listingId, PurchaseRequestStatusEnum status);

  Boolean existsByListing_IdAndRequesterUser_IdAndStatus(
      Long listingId, Long requesterUserId, PurchaseRequestStatusEnum status);
}
