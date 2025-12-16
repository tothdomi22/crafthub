package com.dominik.crafthub.profile.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

public record ProfileCreateRequest(
    @NotNull(message = "City cannot be blank!") Short cityId,
    String bio,
    @Past(message = "Birthdate must be in the past") LocalDate birthDate) {}
