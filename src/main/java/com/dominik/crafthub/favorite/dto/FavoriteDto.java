package com.dominik.crafthub.favorite.dto;

import com.dominik.crafthub.listing.dto.ListingNoCategoriesNoUserDto;
import com.dominik.crafthub.user.dto.UserDto;
import java.time.OffsetDateTime;

public record FavoriteDto(
    Long id, UserDto user, ListingNoCategoriesNoUserDto listing, OffsetDateTime createdAt) {}
