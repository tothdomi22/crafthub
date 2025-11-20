package com.dominik.crafthub.user.controller;

import com.dominik.crafthub.jwt.dto.JwtResponse;
import com.dominik.crafthub.jwt.service.JwtService;
import com.dominik.crafthub.user.dto.UserDto;
import com.dominik.crafthub.user.dto.UserLoginRequest;
import com.dominik.crafthub.user.dto.UserRegisterRequest;
import com.dominik.crafthub.user.exceptions.UserAlreadyExistsException;
import com.dominik.crafthub.user.repository.UserRepository;
import com.dominik.crafthub.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {
  private final UserService userService;
  private final AuthenticationManager authenticationManager;
  private final UserRepository userRepository;
  private final JwtService jwtService;

  @PostMapping
  public ResponseEntity<UserDto> register(@RequestBody @Valid UserRegisterRequest request) {
    var userDto = userService.registerUser(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
  }

  @PostMapping("/login")
  public ResponseEntity<JwtResponse> login(
      @RequestBody @Valid UserLoginRequest request, HttpServletResponse response) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email(), request.password()));
    var user = userRepository.findByEmail(request.email()).orElseThrow();
    var accessToken = jwtService.generateAccessToken(user);
    return ResponseEntity.status(HttpStatus.OK).body(new JwtResponse(accessToken.toString()));
  }

  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> handleUserAlreadyExists() {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("message:", "User with this email already exists"));
  }
}
