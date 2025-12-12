package com.dominik.crafthub.review.repository;

import com.dominik.crafthub.review.entity.ReviewEntity;
import com.dominik.crafthub.review.entity.ReviewTypeEnum;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
  Boolean existsByPurchaseRequestEntity_IdAndReviewType(
      Long purchaseRequestEntityId, ReviewTypeEnum reviewType);

  List<ReviewEntity> findAllByPurchaseRequestEntity_Listing_UserEntity_Id(
      Long purchaseRequestEntityListingUserEntityId);
}
