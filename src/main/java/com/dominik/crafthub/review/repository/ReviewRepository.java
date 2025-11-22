package com.dominik.crafthub.review.repository;

import com.dominik.crafthub.review.entity.ReviewEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
  Boolean existsByListingEntity_Id(Long listingEntityId);

  List<ReviewEntity> findAllByListingEntity_UserEntity_Id(Long listingEntityUserEntityId);
}
