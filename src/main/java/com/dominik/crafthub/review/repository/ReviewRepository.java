package com.dominik.crafthub.review.repository;

import com.dominik.crafthub.review.entity.ReviewEntity;
import com.dominik.crafthub.review.entity.ReviewTypeEnum;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
  Boolean existsByPurchaseRequestEntity_IdAndReviewType(
      Long purchaseRequestEntityId, ReviewTypeEnum reviewType);

  List<ReviewEntity> findAllByPurchaseRequestEntity_Listing_UserEntity_Id(
      Long purchaseRequestEntityListingUserEntityId);

  //  @Transient
  @Query(
      value =
          """
            SELECT r.*
            FROM review r
            JOIN purchase_request pr ON r.purchase_request_id = pr.id
            JOIN listing l on pr.listing_id = l.id
            WHERE (r.review_type = 'OWNER' and pr.requester_user_id = :userId)
                        OR (r.review_type = 'PURCHASER' AND l.user_id = :userId)
            """,
      nativeQuery = true)
  List<ReviewEntity> findAllReviewsOfUser(@Param("userId") Long userId);
}
