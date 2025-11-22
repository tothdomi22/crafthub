package com.dominik.crafthub.review.dto;

import com.dominik.crafthub.listing.dto.ListingReviewDto;
import com.dominik.crafthub.user.dto.UserDto;
import java.time.OffsetDateTime;

public record ReviewListingResponse(
    Long id,
    Short stars,
    String reviewText,
    OffsetDateTime createdAt,
    UserDto reviewerUser,
    ListingReviewDto listing) {}
