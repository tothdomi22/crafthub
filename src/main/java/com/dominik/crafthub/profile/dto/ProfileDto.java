package com.dominik.crafthub.profile.dto;

import com.dominik.crafthub.city.dto.CityDto;
import com.dominik.crafthub.user.dto.UserDto;
import java.time.LocalDate;

public record ProfileDto(Long id, CityDto city, String bio, LocalDate birthDate, UserDto user) {}
