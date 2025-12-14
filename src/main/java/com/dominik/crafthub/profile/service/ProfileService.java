package com.dominik.crafthub.profile.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.profile.dto.ProfileCreateRequest;
import com.dominik.crafthub.profile.dto.ProfileDto;
import com.dominik.crafthub.profile.dto.ProfilePageDto;
import com.dominik.crafthub.profile.dto.ProfileUpdateRequest;
import com.dominik.crafthub.profile.exception.ProfileAlreadyExistsException;
import com.dominik.crafthub.profile.exception.ProfileNotFoundException;
import com.dominik.crafthub.profile.mapper.ProfileMapper;
import com.dominik.crafthub.profile.repository.ProfileRepository;
import com.dominik.crafthub.review.entity.ReviewEntity;
import com.dominik.crafthub.review.repository.ReviewRepository;
import com.dominik.crafthub.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProfileService {
  private final AuthService authService;
  private final ReviewRepository reviewRepository;
  private final UserRepository userRepository;
  private ProfileRepository profileRepository;
  private ProfileMapper profileMapper;

  public ProfileDto createProfile(ProfileCreateRequest request) {
    var user = authService.getCurrentUser();
    var profileExists = profileRepository.existsByUserEntity_Id(user.getId());
    if (profileExists) {
      throw new ProfileAlreadyExistsException();
    }
    var profile = profileMapper.toEntity(request);
    profile.setUserEntity(user);
    profileRepository.save(profile);
    return profileMapper.toDto(profile);
  }

  public ProfileDto updateProfile(ProfileUpdateRequest request) {
    var user = authService.getCurrentUser();
    var profile = profileRepository.findProfileByUserId(user.getId()).orElse(null);
    if (profile == null) {
      throw new ProfileNotFoundException();
    }
    profileMapper.update(request, profile);
    profileRepository.save(profile);
    return profileMapper.toDto(profile);
  }

  public ProfilePageDto getProfile(Long id) {
    var profile = profileRepository.findProfileByUserId(id).orElse(null);
    if (profile == null) {
      throw new ProfileNotFoundException();
    }
    var reviews = reviewRepository.findAllReviewsOfUser(id);
    var reviewCount = reviews.size();
    var reviewAverage = reviews.stream().mapToInt(ReviewEntity::getStars).average().orElse(0);
    return profileMapper.toProfilePageDto(profile, reviewAverage, reviewCount);
  }
}
