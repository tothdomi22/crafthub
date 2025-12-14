package com.dominik.crafthub.listing.repository;

import com.dominik.crafthub.listing.dto.ListingSingleViewDto;
import com.dominik.crafthub.listing.dto.ListingsWithLikesDto;
import com.dominik.crafthub.listing.entity.ListingEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ListingRepository extends JpaRepository<ListingEntity, Long> {
  @EntityGraph(
      attributePaths = {
        "subCategoryEntity",
        "userEntity",
        "subCategoryEntity.mainCategoryEntity",
      })
  List<ListingEntity> findAllByUserEntityId(Long userEntityId);

  @Query(
      value =
          """
            SELECT l
            FROM ListingEntity l
            LEFT JOIN FETCH l.userEntity u
            LEFT JOIN FETCH l.subCategoryEntity sc
            LEFT JOIN FETCH sc.mainCategoryEntity mc
            WHERE l.id = :listingId
        """)
  Optional<ListingEntity> findListingById(@Param("listingId") Long listingId);

  @Query(
      value =
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
        WHERE l.status <> com.dominik.crafthub.listing.entity.ListingStatusEnum.ARCHIVED
        """,
      countQuery =
          """
        SELECT COUNT(l)
        FROM ListingEntity l
        WHERE l.status <> com.dominik.crafthub.listing.entity.ListingStatusEnum.ARCHIVED
        """)
  Page<ListingsWithLikesDto> findAllListingsWithIsLiked(
      @Param("userId") Long userId, Pageable pageable);

  @Query(
      value =
          """
        SELECT new com.dominik.crafthub.listing.dto.ListingSingleViewDto(
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
        CASE WHEN c.id IS NOT NULL THEN c.id ELSE null END,
        CASE WHEN f.id IS NOT NULL THEN true ELSE false END,
        CASE WHEN pr.id is NOT NULL THEN true ELSE false END
        )
        FROM ListingEntity l
        LEFT JOIN l.subCategoryEntity sc
        LEFT JOIN sc.mainCategoryEntity mc
        LEFT JOIN l.userEntity u
        LEFT JOIN FavoriteEntity f
            ON f.listingEntity.id = l.id AND f.userEntity.id = :userId
        LEFT JOIN ConversationEntity c
                ON c.listingEntity.id = :listingId AND c.userEntity1.id = :userId AND c.userEntity2.id = l.userEntity.id
        LEFT JOIN PurchaseRequestEntity pr
                ON pr.requesterUser.id = :userId AND pr.listing.id = :listingId AND pr.status = com.dominik.crafthub.purchaserequest.entity.PurchaseRequestStatusEnum.PENDING
        WHERE l.id = :listingId
        """)
  Optional<ListingSingleViewDto> findSingleViewListing(
      @Param("userId") Long userId, @Param("listingId") Long listingId);
}
