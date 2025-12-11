package com.dominik.crafthub.purchaserequest.repository;

import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestEntity;
import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestStatusEnum;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PurchaseRequestRepostitory extends JpaRepository<PurchaseRequestEntity, Long> {
  Boolean existsByListing_IdAndStatus(Long listingId, PurchaseRequestStatusEnum status);

  Boolean existsByListing_IdAndRequesterUser_IdAndStatus(
      Long listingId, Long requesterUserId, PurchaseRequestStatusEnum status);

  Boolean existsByRequesterUser_IdAndListing_IdAndStatus(
      Long requesterUserId, Long listingId, PurchaseRequestStatusEnum status);

  @Transactional
  @Modifying
  @Query(
      value =
          """
        UPDATE purchase_request
        SET status = CASE
                    WHEN id = :acceptedId THEN :accepted
                    ELSE :declined
                END
        WHERE listing_id = :listingId
        """,
      nativeQuery = true)
  void acceptOneDeclineOthers(
      @Param("acceptedId") Long acceptedId,
      @Param("listingId") Long listingId,
      @Param("accepted") String accepted,
      @Param("declined") String declined);
}
