package com.dominik.crafthub.listing.controller;

import com.dominik.crafthub.listing.dto.ListingCreateRequest;
import com.dominik.crafthub.listing.dto.ListingDto;
import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.subcategory.mapper.SubCategoryMapper;
import com.dominik.crafthub.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {UserMapper.class, SubCategoryMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ListingMapper {
  @Mapping(source = "subCategoryId", target = "subCategoryEntity.id")
  @Mapping(source = "canShip", target = "shippable")
  ListingEntity toEntity(ListingCreateRequest request);

  @Mapping(source = "subCategoryEntity", target = "subCategory")
  @Mapping(source = "userEntity", target = "user")
  @Mapping(target = "canShip", source = "shippable")
  ListingDto toDto(ListingEntity listingEntity);
}
