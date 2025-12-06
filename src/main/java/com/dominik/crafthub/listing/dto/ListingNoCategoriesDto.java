package com.dominik.crafthub.listing.dto;

import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import java.time.OffsetDateTime;

public record ListingNoCategoriesDto(
    Long id,
    String name,
    Integer price,
    boolean canShip,
    String city,
    String description,
    OffsetDateTime createdAt,
    ListingStatusEnum status) {}
