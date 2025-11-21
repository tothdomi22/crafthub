package com.dominik.crafthub.maincategory.dto;

import jakarta.validation.constraints.NotBlank;

public record MainCategoryCreateRequest(
    @NotBlank(message = "Name cannot be blank!") String name,
    @NotBlank(message = "Description cannot be blank") String description) {}
