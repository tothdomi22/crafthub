package com.dominik.crafthub.listing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ListingCreateRequest(
    @NotBlank(message = "You must provide a name") String name,
    @NotNull(message = "You must provide a price") Integer price,
    @NotNull(message = "You must device if you can ship or not") Boolean canShip,
    @NotBlank(message = "You must provide a city") String city,
    @NotBlank(message = "You must provide a description") String description,
    @NotNull(message = "You must provide a subcategory") Integer subCategoryId) {}
