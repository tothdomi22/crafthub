package com.dominik.crafthub.listing.mapper;

import com.dominik.crafthub.city.entity.CityEntity;
import com.dominik.crafthub.city.mapper.CityMapper;
import com.dominik.crafthub.listing.dto.*;
import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import com.dominik.crafthub.subcategory.entity.SubCategoryEntity;
import com.dominik.crafthub.subcategory.mapper.SubCategoryMapper;
import com.dominik.crafthub.user.entity.UserEntity;
import com.dominik.crafthub.user.mapper.UserMapper;
import java.time.OffsetDateTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {SubCategoryMapper.class, UserMapper.class, CityMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ListingMapper {
  @Mapping(source = "request.subCategoryId", target = "subCategoryEntity.id")
  @Mapping(source = "request.canShip", target = "shippable")
  @Mapping(target = "createdAt", source = "createdAt")
  @Mapping(target = "name", source = "request.name")
  @Mapping(target = "description", source = "request.description")
  @Mapping(target = "userEntity", source = "userEntity")
  @Mapping(target = "id", ignore = true)
  ListingEntity toEntity(
      ListingCreateRequest request,
      CityEntity cityEntity,
      UserEntity userEntity,
      SubCategoryEntity subCategoryEntity,
      ListingStatusEnum status,
      OffsetDateTime createdAt);

  @Mapping(source = "subCategoryEntity", target = "subCategory")
  @Mapping(target = "canShip", source = "shippable")
  @Mapping(source = "userEntity", target = "user")
  @Mapping(source = "cityEntity", target = "city")
  ListingDto toDto(ListingEntity listingEntity);

  @Mapping(target = "subCategoryEntity.id", source = "subCategoryId")
  @Mapping(source = "canShip", target = "shippable")
  void update(ListingUpdateRequest request, @MappingTarget ListingEntity listingEntity);

  @Mapping(target = "canShip", source = "shippable")
  ListingNoCategoriesNoUserDto toNoCategoriesNoUserDto(ListingEntity listing);

  @Mapping(target = "user", source = "listing.userEntity")
  @Mapping(target = "canShip", source = "shippable")
  ListingNoCategoriesDto toNoCategoriesDto(ListingEntity listing);

  @Mapping(source = "listingEntity.subCategoryEntity", target = "subCategory")
  @Mapping(source = "listingEntity.shippable", target = "canShip")
  @Mapping(source = "listingEntity.userEntity", target = "user")
  ListingSingleViewDto toSingleViewDto(
      ListingEntity listingEntity,
      Long conversationId,
      Boolean pendingRequestExists,
      Boolean isLiked);
}
