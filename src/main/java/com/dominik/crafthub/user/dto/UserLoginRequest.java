package com.dominik.crafthub.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserLoginRequest(
    @Email(message = "Email format is not correct!") @NotBlank(message = "Email is required!")
        String email,
    @NotBlank(message = "Password is required!") String password) {}
