package com.dominik.crafthub.maincategory.dto;

import jakarta.validation.constraints.NotBlank;

public record MainCategoryCreateRequest(
    @NotBlank(message = "Description cannot be blank") String description,
    @NotBlank(message = "Unique name cannot be blank") String uniqueName,
    @NotBlank(message = "Display name cannot be blank") String displayName) {}
