package com.dominik.crafthub.profile.mapper;

import com.dominik.crafthub.profile.dto.ProfileCreateRequest;
import com.dominik.crafthub.profile.dto.ProfileDto;
import com.dominik.crafthub.profile.entity.ProfileEntity;
import com.dominik.crafthub.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {UserMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProfileMapper {
  @Mapping(source = "userEntity", target = "user")
  ProfileDto toDto(ProfileEntity profile);

  ProfileEntity toEntity(ProfileCreateRequest request);
}
