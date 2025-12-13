package com.dominik.crafthub.user.dto;

import com.dominik.crafthub.user.entity.UserRole;
import java.time.OffsetDateTime;

public record UserDto(Long id, String name, String email, UserRole role, OffsetDateTime createdAt) {}
