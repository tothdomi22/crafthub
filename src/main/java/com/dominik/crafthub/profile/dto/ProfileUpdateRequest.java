package com.dominik.crafthub.profile.dto;

import jakarta.validation.constraints.Past;
import java.time.LocalDate;

public record ProfileUpdateRequest(
    String city,
    String bio,
    @Past(message = "Birthdate must be in the past") LocalDate birthDate) {}
