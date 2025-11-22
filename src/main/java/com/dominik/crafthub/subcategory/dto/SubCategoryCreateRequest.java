package com.dominik.crafthub.subcategory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubCategoryCreateRequest(
    @NotBlank(message = "Description cannot be blank") String description,
    @NotBlank(message = "Unique name cannot be blank") String uniqueName,
    @NotBlank(message = "Display name cannot be blank") String displayName,
    @NotNull(message = "Main category id cannot be null") Integer mainCategoryId) {}
