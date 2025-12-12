package com.dominik.crafthub.review.dto;

import com.dominik.crafthub.listing.dto.ListingNoCategoriesNoUserDto;
import com.dominik.crafthub.review.entity.ReviewTypeEnum;
import com.dominik.crafthub.user.dto.UserDto;
import java.time.OffsetDateTime;

public record ReviewListingResponse(
    Long id,
    Short stars,
    String reviewText,
    OffsetDateTime createdAt,
    UserDto reviewerUser,
    ListingNoCategoriesNoUserDto listing,
    ReviewTypeEnum reviewType) {}
