package com.dominik.crafthub.conversation.dto;

import com.dominik.crafthub.listing.dto.ListingReviewDto;
import com.dominik.crafthub.user.dto.UserDto;
import java.time.OffsetDateTime;

public record ConversationDto(Long id, UserDto userOne, UserDto userTwo, ListingReviewDto listing, OffsetDateTime createdAt, OffsetDateTime updatedAt) {}
