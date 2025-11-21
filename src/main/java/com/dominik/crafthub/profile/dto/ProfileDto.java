package com.dominik.crafthub.profile.dto;

import com.dominik.crafthub.user.dto.UserDto;
import java.time.LocalDate;

public record ProfileDto(String id, String city, String bio, LocalDate birthDate, UserDto user) {}
