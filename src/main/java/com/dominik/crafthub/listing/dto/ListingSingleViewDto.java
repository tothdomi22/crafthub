package com.dominik.crafthub.listing.dto;

import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import com.dominik.crafthub.subcategory.dto.SubCategoryDto;
import com.dominik.crafthub.user.dto.UserDto;
import java.time.OffsetDateTime;

public record ListingSingleViewDto(
    Long id,
    String name,
    Integer price,
    boolean canShip,
    String city,
    String description,
    OffsetDateTime createdAt,
    ListingStatusEnum status,
    SubCategoryDto subCategory,
    UserDto user,
    Long conversationId) {}
