package com.dominik.crafthub.message.dto;

import com.dominik.crafthub.user.dto.UserDto;
import java.time.OffsetDateTime;

public record MessageDto(Long id, String textContent, UserDto sender, OffsetDateTime createdAt) {}
