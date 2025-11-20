package com.dominik.crafthub.user.service;

import com.dominik.crafthub.user.dto.UserDto;
import com.dominik.crafthub.user.dto.UserUpdateRequest;
import com.dominik.crafthub.user.exceptions.UserAlreadyExistsException;
import com.dominik.crafthub.user.exceptions.UserNotFoundException;
import com.dominik.crafthub.user.mapper.UserMapper;
import com.dominik.crafthub.user.repository.UserRepository;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
  private UserRepository userRepository;
  private UserMapper userMapper;

  public UserDto getMe() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    var userId = (Long) authentication.getPrincipal();
    var user = userRepository.findById(userId).orElse(null);
    if (user == null || user.getIsDeleted()) {
      throw new UserNotFoundException();
    }
    return userMapper.toDto(user);
  }

  public UserDto updateUser(UserUpdateRequest request) {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    var userId = (Long) authentication.getPrincipal();
    var user = userRepository.findById(userId).orElse(null);
    if (user == null || user.getIsDeleted()) {
      throw new UserNotFoundException();
    }
    if (request.email() != null) {
      var emailExist = userRepository.existsByEmail(request.email());
      if (emailExist) {
        throw new UserAlreadyExistsException();
      }
      user.setEmail(request.email());
    }
    if (request.name() != null) {
      user.setName(request.name());
    }
    userRepository.save(user);
    return userMapper.toDto(user);
  }

  public void deleteUser() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    var userId = (Long) authentication.getPrincipal();
    var user = userRepository.findById(userId).orElse(null);
    if (user == null) {
      throw new UserNotFoundException();
    }
    var email = UUID.randomUUID() + "@deleted.com";
    var name = UUID.randomUUID().toString();
    user.setIsDeleted(true);
    user.setEmail(email);
    user.setName(name);
    user.setDeletedAt(OffsetDateTime.now());
    userRepository.save(user);
  }
}
