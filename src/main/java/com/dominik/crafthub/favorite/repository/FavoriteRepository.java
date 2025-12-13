package com.dominik.crafthub.favorite.repository;

import com.dominik.crafthub.favorite.entity.FavoriteEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {
  Boolean existsByListingEntity_IdAndUserEntity_Id(Long listingEntityId, Long userEntityId);

  Optional<FavoriteEntity> findByListingEntity_IdAndUserEntity_Id(
      Long listingEntityId, Long userEntityId);

  @EntityGraph(attributePaths = {"listingEntity"})
  List<FavoriteEntity> findAllByUserEntityId(Long userEntityId);
}
