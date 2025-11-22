package com.dominik.crafthub.listing.dto;

import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import com.dominik.crafthub.subcategory.dto.SubCategoryDto;
import com.dominik.crafthub.user.dto.UserDto;

public record ListingDto(
    Long id,
    String name,
    Integer price,
    boolean canShip,
    String city,
    ListingStatusEnum status,
    SubCategoryDto subCategory,
    UserDto user) {}
