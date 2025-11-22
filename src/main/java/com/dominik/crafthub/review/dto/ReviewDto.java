package com.dominik.crafthub.review.dto;

import java.time.OffsetDateTime;

public record ReviewDto(Short stars, String reviewText, OffsetDateTime createdAt) {}
