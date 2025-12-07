package com.dominik.crafthub.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserPasswordChangeRequest(
    @NotBlank(message = "Old password cannot be blank") String oldPassword,
    @NotBlank(message = "New password cannot be blank")
        @Size(min = 6, max = 30, message = "Password must be between 6 and 30 characters")
        String newPassword,
    @NotBlank(message = "New password confirmation cannot be blank")
        @Size(min = 6, max = 30, message = "Password must be between 6 and 30 characters")
        String newPasswordConfirmation) {}
