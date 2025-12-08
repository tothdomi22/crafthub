package com.dominik.crafthub.listing.mapper;

import com.dominik.crafthub.listing.dto.*;
import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.subcategory.mapper.SubCategoryMapper;
import com.dominik.crafthub.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {SubCategoryMapper.class, UserMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ListingMapper {
  @Mapping(source = "subCategoryId", target = "subCategoryEntity.id")
  @Mapping(source = "canShip", target = "shippable")
  ListingEntity toEntity(ListingCreateRequest request);

  @Mapping(source = "subCategoryEntity", target = "subCategory")
  @Mapping(target = "canShip", source = "shippable")
  @Mapping(source = "userEntity", target = "user")
  ListingDto toDto(ListingEntity listingEntity);

  @Mapping(target = "subCategoryEntity.id", source = "subCategoryId")
  @Mapping(source = "canShip", target = "shippable")
  void update(ListingUpdateRequest request, @MappingTarget ListingEntity listingEntity);

  @Mapping(target = "canShip", source = "shippable")
  ListingNoCategoriesDto toNoCategoriesDto(ListingEntity listing);

  @Mapping(source = "listingEntity.subCategoryEntity", target = "subCategory")
  @Mapping(source = "listingEntity.shippable", target = "canShip")
  @Mapping(source = "listingEntity.userEntity", target = "user")
  ListingSingleViewDto toSingleViewDto(ListingEntity listingEntity, Long conversationId);
}
