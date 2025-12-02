package com.dominik.crafthub.profile.mapper;

import com.dominik.crafthub.profile.dto.ProfileCreateRequest;
import com.dominik.crafthub.profile.dto.ProfileDto;
import com.dominik.crafthub.profile.dto.ProfilePageDto;
import com.dominik.crafthub.profile.dto.ProfileUpdateRequest;
import com.dominik.crafthub.profile.entity.ProfileEntity;
import com.dominik.crafthub.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {UserMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProfileMapper {
  @Mapping(source = "userEntity", target = "user")
  ProfileDto toDto(ProfileEntity profile);

  @Mapping(source = "profile.userEntity", target = "user")
  @Mapping(source = "reviewAverage", target = "review")
  @Mapping(source = "reviewCount", target = "reviewCount")
  ProfilePageDto toProfilePageDto(ProfileEntity profile, Double reviewAverage, Integer reviewCount);

  ProfileEntity toEntity(ProfileCreateRequest request);

  void update(ProfileUpdateRequest request, @MappingTarget ProfileEntity profileEntity);
}
