package com.dominik.crafthub.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

public record ProfileCreateRequest(
    @NotBlank(message = "City cannot be blank!") String city,
    String bio,
    @Past(message = "Birthdate must be in the past") LocalDate birthDate) {}
