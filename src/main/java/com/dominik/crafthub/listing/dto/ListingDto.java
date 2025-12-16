package com.dominik.crafthub.listing.dto;

import com.dominik.crafthub.city.dto.CityDto;
import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import com.dominik.crafthub.subcategory.dto.SubCategoryDto;
import com.dominik.crafthub.user.dto.UserDto;
import java.time.OffsetDateTime;

public record ListingDto(
    Long id,
    String name,
    Integer price,
    boolean canShip,
    CityDto city,
    String description,
    OffsetDateTime createdAt,
    ListingStatusEnum status,
    SubCategoryDto subCategory,
    UserDto user) {}
