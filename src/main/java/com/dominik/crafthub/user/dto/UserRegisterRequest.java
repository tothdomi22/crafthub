package com.dominik.crafthub.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRegisterRequest(
    @NotBlank(message = "Must provide a name!") String name,
    @NotBlank(message = "Must provide an email!") @Email(message = "Must be a valid email!")
        String email,
    @NotBlank(message = "Must provide a password!") String password) {}
