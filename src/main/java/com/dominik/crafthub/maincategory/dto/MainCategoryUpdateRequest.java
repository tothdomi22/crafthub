package com.dominik.crafthub.maincategory.dto;

public record MainCategoryUpdateRequest(
    String description, String uniqueName, String displayName) {}
