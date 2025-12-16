package com.dominik.crafthub.listing.dto;

import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record ListingUpdateRequest(
    String name,
    @Min(value = 0, message = "Price cannot be negative") Integer price,
    Boolean canShip,
    Short cityId,
    ListingStatusEnum status,
    @Size(min = 10, max = 5000, message = "Description must be between 10 and 5000 characters")
        String description,
    Integer subCategoryId) {}
