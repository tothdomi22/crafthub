package com.dominik.crafthub.user.dto;

import java.time.OffsetDateTime;

public record UserDto(Long id, String name, String email, String role, OffsetDateTime createdAt) {}
