package com.dominik.crafthub.user.dto;

import jakarta.validation.constraints.Email;

public record UserUpdateRequest(
    String name, @Email(message = "Must be a valid email") String email) {}
