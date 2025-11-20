package com.dominik.crafthub.user.controller;

import com.dominik.crafthub.jwt.config.JwtConfig;
import com.dominik.crafthub.jwt.dto.JwtResponse;
import com.dominik.crafthub.jwt.service.JwtService;
import com.dominik.crafthub.user.dto.UserDto;
import com.dominik.crafthub.user.dto.UserLoginRequest;
import com.dominik.crafthub.user.dto.UserRegisterRequest;
import com.dominik.crafthub.user.exceptions.UserAlreadyExistsException;
import com.dominik.crafthub.user.mapper.UserMapper;
import com.dominik.crafthub.user.repository.UserRepository;
import com.dominik.crafthub.user.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
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
    var cookie = new Cookie("accessToken", accessToken.toString());
    cookie.setMaxAge(jwtConfig.getAccessTokenExpiration());
    cookie.setSecure(true);
    cookie.setHttpOnly(true);
    response.addCookie(cookie);
    return ResponseEntity.status(HttpStatus.OK).build();
  }

  @GetMapping("/me")
  public ResponseEntity<?> me() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    var userId = (Long) authentication.getPrincipal();
    var user = userRepository.findById(userId).orElse(null);
    if (user == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    var userDto = userMapper.toDto(user);
    return ResponseEntity.status(HttpStatus.OK).body(userDto);
  }

  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> handleUserAlreadyExists() {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("message:", "User with this email already exists"));
  }
}
