package com.dominik.crafthub.review.repository;

import com.dominik.crafthub.review.entity.ReviewEntity;
import com.dominik.crafthub.review.entity.ReviewTypeEnum;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
  //    FIXME: get listingid through purchaserequest
  //  List<ReviewEntity> findAllByListingEntity_UserEntity_Id(Long listingEntityUserEntityId);

  Boolean existsByPurchaseRequestEntity_IdAndReviewType(
      Long purchaseRequestEntityId, ReviewTypeEnum reviewType);
}
