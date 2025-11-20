package com.dominik.crafthub.profile.controller;

import com.dominik.crafthub.profile.dto.ProfileCreateRequest;
import com.dominik.crafthub.profile.exception.ProfileAlreadyExistsException;
import com.dominik.crafthub.profile.service.ProfileService;
import com.dominik.crafthub.user.exceptions.UserNotFoundException;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/profile")
public class ProfileController {
  private final ProfileService profileService;

  @PostMapping
  public ResponseEntity<?> createProfile(@Valid @RequestBody ProfileCreateRequest request) {
    var profileDto = profileService.createProfile(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(profileDto);
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<Map<String, String>> handleUserNotFound() {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message:", "User not found"));
  }

  @ExceptionHandler(ProfileAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> handleUserAlreadyExists() {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("message:", "User already has a profile"));
  }
}
