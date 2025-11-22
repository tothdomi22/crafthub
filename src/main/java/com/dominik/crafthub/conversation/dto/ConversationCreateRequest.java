package com.dominik.crafthub.conversation.dto;

import jakarta.validation.constraints.NotNull;

public record ConversationCreateRequest(
    @NotNull(message = "Listing id cannot be null") Long listingId) {}
