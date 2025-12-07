package com.dominik.crafthub.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRegisterRequest(
    @NotBlank(message = "Must provide a name!") String name,
    @NotBlank(message = "Must provide an email!") @Email(message = "Must be a valid email!")
        String email,
    @NotBlank(message = "Must provide a password!")
        @Size(min = 6, max = 30, message = "Password must be between 6 and 30 characters!")
        String password) {}
