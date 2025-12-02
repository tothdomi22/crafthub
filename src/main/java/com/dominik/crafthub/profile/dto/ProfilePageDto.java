package com.dominik.crafthub.profile.dto;

import com.dominik.crafthub.user.dto.UserDto;
import java.time.LocalDate;

public record ProfilePageDto(
    Long id,
    String city,
    String bio,
    LocalDate birthDate,
    UserDto user,
    Double review,
    Integer reviewCount) {}
