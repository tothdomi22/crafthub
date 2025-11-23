package com.dominik.crafthub.auth.controller;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.user.dto.UserDto;
import com.dominik.crafthub.user.dto.UserLoginRequest;
import com.dominik.crafthub.user.dto.UserRegisterRequest;
import com.dominik.crafthub.user.exceptions.UserAlreadyExistsException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

  private final AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<UserDto> register(@RequestBody @Valid UserRegisterRequest request) {
    var userDto = authService.registerUser(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(
      @RequestBody @Valid UserLoginRequest request, HttpServletResponse response) {
    var cookie = authService.loginUser(request);
    return ResponseEntity.status(HttpStatus.OK)
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(Map.of("message:", "Login success"));
  }

  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> handleUserAlreadyExists() {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("message:", "User with this email already exists"));
  }
}
