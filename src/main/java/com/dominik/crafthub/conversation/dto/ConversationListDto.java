package com.dominik.crafthub.conversation.dto;

import com.dominik.crafthub.listing.dto.ListingReviewDto;
import com.dominik.crafthub.user.dto.UserDto;
import java.time.OffsetDateTime;

public record ConversationListDto(
        String id,
        UserDto userOne,
        UserDto userTwo,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        ListingReviewDto listing) {}
