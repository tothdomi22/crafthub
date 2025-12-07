package com.dominik.crafthub.user.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.profile.repository.ProfileRepository;
import com.dominik.crafthub.user.dto.UserDto;
import com.dominik.crafthub.user.dto.UserUpdateRequest;
import com.dominik.crafthub.user.exceptions.UserAlreadyExistsException;
import com.dominik.crafthub.user.mapper.UserMapper;
import com.dominik.crafthub.user.repository.UserRepository;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
  private final ProfileRepository profileRepository;
  private final AuthService authService;
  private UserRepository userRepository;
  private UserMapper userMapper;

  public UserDto getMe() {
    var user = authService.getCurrentUser();
    return userMapper.toDto(user);
  }

  public UserDto updateUser(UserUpdateRequest request) {
    var user = authService.getCurrentUser();
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

  public ResponseCookie deleteUser() {
    var user = authService.getCurrentUser();
    var profile = profileRepository.findByUserEntity_Id(user.getId()).orElse(null);
    if (profile != null) {
      profile.setBio(null);
      profile.setBirthDate(LocalDate.of(1900, 1, 1));
      profile.setCity("city_hidden");
      profileRepository.save(profile);
    }
    var email = UUID.randomUUID() + "@deleted.com";
    var name = UUID.randomUUID().toString();
    user.setIsDeleted(true);
    user.setEmail(email);
    user.setName(name);
    user.setDeletedAt(OffsetDateTime.now());
    userRepository.save(user);
    return authService.deleteResponseCookie();
  }
}
