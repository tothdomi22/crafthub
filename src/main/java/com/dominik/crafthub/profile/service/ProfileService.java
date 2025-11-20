package com.dominik.crafthub.profile.service;

import com.dominik.crafthub.profile.dto.ProfileCreateRequest;
import com.dominik.crafthub.profile.dto.ProfileDto;
import com.dominik.crafthub.profile.exception.ProfileAlreadyExistsException;
import com.dominik.crafthub.profile.mapper.ProfileMapper;
import com.dominik.crafthub.profile.repository.ProfileRepository;
import com.dominik.crafthub.user.exceptions.UserNotFoundException;
import com.dominik.crafthub.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProfileService {
  private UserRepository userRepository;
  private ProfileRepository profileRepository;
  private ProfileMapper profileMapper;

  public ProfileDto createProfile(ProfileCreateRequest request) {
    var authenticaion = SecurityContextHolder.getContext().getAuthentication();
    if (!(authenticaion.getPrincipal() instanceof Long userId)) {
      throw new UserNotFoundException();
    }
    var user = userRepository.findById(userId).orElse(null);
    if (user == null) {
      throw new UserNotFoundException();
    }
    var profileExists = profileRepository.existsByUserEntity_Id(userId);
    if (profileExists) {
      throw new ProfileAlreadyExistsException();
    }
    var profile = profileMapper.toEntity(request);
    profile.setUserEntity(user);
    profileRepository.save(profile);
    return profileMapper.toDto(profile);
  }
}
