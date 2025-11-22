package com.dominik.crafthub.listing.controller;

import com.dominik.crafthub.listing.dto.ListingCreateRequest;
import com.dominik.crafthub.listing.dto.ListingDto;
import com.dominik.crafthub.listing.dto.ListingUpdateRequest;
import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.subcategory.mapper.SubCategoryMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = { SubCategoryMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ListingMapper {
  @Mapping(source = "subCategoryId", target = "subCategoryEntity.id")
  @Mapping(source = "canShip", target = "shippable")
  ListingEntity toEntity(ListingCreateRequest request);

  @Mapping(source = "subCategoryEntity", target = "subCategory")
  @Mapping(target = "canShip", source = "shippable")
  ListingDto toDto(ListingEntity listingEntity);

  @Mapping(target = "subCategoryEntity.id", source = "subCategoryId")
  @Mapping(source = "canShip", target = "shippable")
  void update(ListingUpdateRequest request, @MappingTarget ListingEntity listingEntity);
}
