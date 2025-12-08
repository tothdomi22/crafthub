package com.dominik.crafthub.purchaserequest.dto;

import com.dominik.crafthub.listing.dto.ListingDto;
import com.dominik.crafthub.listing.dto.ListingReviewDto;
import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestStatusEnum;
import com.dominik.crafthub.user.dto.UserDto;

import java.time.OffsetDateTime;

public record PurchaseRequestDto(
    Long id,
    OffsetDateTime createdAt,
    PurchaseRequestStatusEnum status,
    ListingReviewDto listing,
    UserDto user) {}
