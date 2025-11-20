package com.dominik.crafthub.user.service;

import com.dominik.crafthub.user.dto.UserDto;
import com.dominik.crafthub.user.dto.UserRegisterRequest;
import com.dominik.crafthub.user.entity.UserRole;
import com.dominik.crafthub.user.exceptions.UserAlreadyExistsException;
import com.dominik.crafthub.user.mapper.UserMapper;
import com.dominik.crafthub.user.repository.UserRepository;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
  private final PasswordEncoder passwordEncoder;
  private UserRepository userRepository;
  private UserMapper userMapper;

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
}
