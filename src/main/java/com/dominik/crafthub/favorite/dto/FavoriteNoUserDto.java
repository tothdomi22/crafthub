package com.dominik.crafthub.favorite.dto;

import com.dominik.crafthub.listing.dto.ListingNoCategoriesNoUserDto;
import java.time.OffsetDateTime;

public record FavoriteNoUserDto(
    Long id, ListingNoCategoriesNoUserDto listing, OffsetDateTime createdAt) {}
