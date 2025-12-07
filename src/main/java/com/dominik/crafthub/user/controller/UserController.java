package com.dominik.crafthub.user.controller;

import com.dominik.crafthub.jwt.config.JwtConfig;
import com.dominik.crafthub.jwt.service.JwtService;
import com.dominik.crafthub.user.dto.UserUpdateRequest;
import com.dominik.crafthub.user.exceptions.UserAlreadyExistsException;
import com.dominik.crafthub.user.exceptions.UserNotFoundException;
import com.dominik.crafthub.user.mapper.UserMapper;
import com.dominik.crafthub.user.repository.UserRepository;
import com.dominik.crafthub.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {
  private final UserService userService;
  private final AuthenticationManager authenticationManager;
  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final JwtConfig jwtConfig;
  private final UserMapper userMapper;

  @GetMapping("/me")
  public ResponseEntity<?> me() {
    var userDto = userService.getMe();
    return ResponseEntity.status(HttpStatus.OK).body(userDto);
  }

  @PutMapping
  public ResponseEntity<?> update(@Valid @RequestBody UserUpdateRequest request) {
    var userDto = userService.updateUser(request);
    return ResponseEntity.status(HttpStatus.OK).body(userDto);
  }

  @DeleteMapping
  public ResponseEntity<?> delete(HttpServletResponse response) {
    var cookie = userService.deleteUser();
    return ResponseEntity.status(HttpStatus.OK)
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(Map.of("message", "Account deleted successfully!"));
  }

  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> handleUserAlreadyExists() {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("message:", "User with this email already exists"));
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<Map<String, String>> handleUserNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message:", "User not found"));
  }
}
