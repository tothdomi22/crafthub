package com.dominik.crafthub.favorite.repository;

import com.dominik.crafthub.favorite.entity.FavoriteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {
  Boolean existsByListingEntity_IdAndUserEntity_Id(Long listingEntityId, Long userEntityId);
}
