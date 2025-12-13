package com.dominik.crafthub.subcategory.dto;

import com.dominik.crafthub.maincategory.dto.MainCategoryDto;

public record SubCategoryDto(
    Integer id,
    String description,
    String uniqueName,
    String displayName,
    MainCategoryDto mainCategory) {}
