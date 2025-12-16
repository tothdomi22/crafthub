package com.dominik.crafthub.listing.dto;

import com.dominik.crafthub.city.dto.CityDto;
import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import java.time.OffsetDateTime;

public record ListingNoCategoriesNoUserDto(
    Long id,
    String name,
    Integer price,
    boolean canShip,
    CityDto city,
    String description,
    OffsetDateTime createdAt,
    ListingStatusEnum status) {}
