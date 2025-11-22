package com.dominik.crafthub.listing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ListingCreateRequest(
    @NotBlank(message = "You must provide a name") String name,
    @NotNull(message = "You must provide a price")
        @Min(value = 0, message = "Price cannot be negative")
        Integer price,
    @NotNull(message = "You must device if you can ship or not") Boolean canShip,
    @NotBlank(message = "You must provide a city") String city,
    @NotBlank(message = "You must provide a description")
        @Size(min = 10, max = 5000, message = "Description must be between 10 and 5000 characters")
        String description,
    @NotNull(message = "You must provide a subcategory") Integer subCategoryId) {}
