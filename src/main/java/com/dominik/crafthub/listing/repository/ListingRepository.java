package com.dominik.crafthub.listing.repository;

import com.dominik.crafthub.listing.dto.ListingsWithLikesDto;
import com.dominik.crafthub.listing.entity.ListingEntity;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ListingRepository extends JpaRepository<ListingEntity, Long> {
  List<ListingEntity> findAllByUserEntityId(Long userEntityId);

  @EntityGraph(
      attributePaths = {
        "subCategoryEntity",
        "userEntity",
        "subCategoryEntity.mainCategoryEntity",
        "userEntity.profiles"
      })
  @Query("SELECT l FROM ListingEntity l")
  List<ListingEntity> findAllListings();

  @Query(
      """
        SELECT new com.dominik.crafthub.listing.dto.ListingsWithLikesDto(
        l.id,
        l.name,
        l.price,
        l.shippable,
        l.city,
        l.description,
        l.createdAt,
        l.status,
        new com.dominik.crafthub.subcategory.dto.SubCategoryDto(
                sc.id,
                sc.description,
                sc.uniqueName,
                sc.displayName,
                new com.dominik.crafthub.maincategory.dto.MainCategoryDto(
                    mc.id,
                    mc.description,
                    mc.uniqueName,
                    mc.displayName
                )
            ),
            new com.dominik.crafthub.user.dto.UserDto(
                u.id,
                u.name,
                u.email,
                u.role,
                u.createdAt),
        CASE WHEN f.id IS NOT NULL THEN true ELSE false END
        )
        FROM ListingEntity l
        LEFT JOIN l.subCategoryEntity sc
        LEFT JOIN sc.mainCategoryEntity mc
        LEFT JOIN l.userEntity u
        LEFT JOIN FavoriteEntity f
            ON f.listingEntity.id = l.id AND f.userEntity.id = :userId
        """)
  List<ListingsWithLikesDto> findAllListingsWithIsLiked(@Param("userId") Long userId);
}
