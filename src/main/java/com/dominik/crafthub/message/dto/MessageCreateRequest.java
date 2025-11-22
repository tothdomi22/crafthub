package com.dominik.crafthub.message.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MessageCreateRequest(
    @NotBlank(message = "You must provide a message") String textContent,
    @NotNull(message = "You must provide a converstion ID") Long conversationId) {}
