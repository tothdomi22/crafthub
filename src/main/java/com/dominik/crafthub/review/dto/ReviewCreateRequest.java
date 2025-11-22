package com.dominik.crafthub.review.dto;

import jakarta.validation.constraints.*;

public record ReviewCreateRequest(
    @Min(value = 1, message = "Stars must be between 1 and 5")
        @Max(value = 5, message = "Stars must be between 1 and 5")
        @NotNull(message = "You must provide stars")
        Short stars,
    @NotBlank(message = "You must provide a review")
        @Size(min = 5, max = 500, message = "Review must be between 5 and 500 characteres")
        String reviewText) {}
