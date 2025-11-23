package com.dominik.crafthub.auth.service;

import com.dominik.crafthub.jwt.config.JwtConfig;
import com.dominik.crafthub.jwt.service.JwtService;
import com.dominik.crafthub.user.dto.UserDto;
import com.dominik.crafthub.user.dto.UserLoginRequest;
import com.dominik.crafthub.user.dto.UserRegisterRequest;
import com.dominik.crafthub.user.entity.UserEntity;
import com.dominik.crafthub.user.entity.UserRole;
import com.dominik.crafthub.user.exceptions.UserAlreadyExistsException;
import com.dominik.crafthub.user.exceptions.UserNotFoundException;
import com.dominik.crafthub.user.mapper.UserMapper;
import com.dominik.crafthub.user.repository.UserRepository;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
  private final JwtConfig jwtConfig;
  private UserRepository userRepository;
  private UserMapper userMapper;
  private PasswordEncoder passwordEncoder;
  private AuthenticationManager authenticationManager;
  private JwtService jwtService;

  public UserDto registerUser(UserRegisterRequest request) {
    var userExists = userRepository.existsByEmail(request.email());
    if (userExists) {
      throw new UserAlreadyExistsException();
    }
    var user = userMapper.toEntity(request);
    user.setRole(UserRole.USER);
    user.setIsDeleted(false);
    user.setCreatedAt(OffsetDateTime.now());
    user.setPassword(passwordEncoder.encode(request.password()));
    var userEntity = userRepository.save(user);
    return userMapper.toDto(userEntity);
  }

  public ResponseCookie loginUser(UserLoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email(), request.password()));
    var user = userRepository.findByEmail(request.email()).orElseThrow();
    var accessToken = jwtService.generateAccessToken(user);
    return ResponseCookie.from("accessToken", accessToken.toString())
        .httpOnly(true)
        .secure(false) // set true for prod
        .path("/")
        .maxAge(jwtConfig.getAccessTokenExpiration())
        .sameSite("Lax")
        .build();
  }

  public UserEntity getCurrentUser() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    var userId = (Long) authentication.getPrincipal();
    var user = userRepository.findById(userId).orElse(null);
    if (user == null || user.getIsDeleted()) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
