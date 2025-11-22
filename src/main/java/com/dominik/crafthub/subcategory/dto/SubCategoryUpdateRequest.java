package com.dominik.crafthub.subcategory.dto;


public record SubCategoryUpdateRequest(
    String description,
     String uniqueName,
     String displayName,
     Integer mainCategoryId) {}
