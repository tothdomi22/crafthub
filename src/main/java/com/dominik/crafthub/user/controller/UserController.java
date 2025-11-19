package com.dominik.crafthub.user.controller;

import com.dominik.crafthub.user.dto.UserDto;
import com.dominik.crafthub.user.dto.UserRegisterRequest;
import com.dominik.crafthub.user.exceptions.UserAlreadyExistsException;
import com.dominik.crafthub.user.service.UserService;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {
  private final UserService userService;

  @PostMapping
  public ResponseEntity<UserDto> register(@RequestBody UserRegisterRequest request) {
    var userDto = userService.registerUser(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
  }

  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> handleUserAlreadyExists() {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("message:", "User with this email already exists"));
  }
}
