package com.dominik.crafthub.profile.mapper;

import com.dominik.crafthub.city.entity.CityEntity;
import com.dominik.crafthub.city.mapper.CityMapper;
import com.dominik.crafthub.profile.dto.ProfileCreateRequest;
import com.dominik.crafthub.profile.dto.ProfileDto;
import com.dominik.crafthub.profile.dto.ProfilePageDto;
import com.dominik.crafthub.profile.dto.ProfileUpdateRequest;
import com.dominik.crafthub.profile.entity.ProfileEntity;
import com.dominik.crafthub.user.entity.UserEntity;
import com.dominik.crafthub.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {UserMapper.class, CityMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProfileMapper {
  @Mapping(target = "city", source = "cityEntity")
  @Mapping(source = "userEntity", target = "user")
  ProfileDto toDto(ProfileEntity profile);

  @Mapping(source = "profile.userEntity", target = "user")
  @Mapping(source = "reviewAverage", target = "review")
  @Mapping(source = "reviewCount", target = "reviewCount")
  @Mapping(source = "profile.cityEntity", target = "city")
  ProfilePageDto toProfilePageDto(ProfileEntity profile, Double reviewAverage, Integer reviewCount);

  @Mapping(target = "cityEntity", source = "cityEntity")
  @Mapping(target = "id", ignore = true)
  ProfileEntity toEntity(
      ProfileCreateRequest request, UserEntity userEntity, CityEntity cityEntity);

  @Mapping(source = "userId", target = "userEntity.id")
  ProfileEntity toNewProfileEntity(Long userId);

  void update(ProfileUpdateRequest request, @MappingTarget ProfileEntity profileEntity);

  @Mapping(target = "userEntity", source = "user")
  @Mapping(target = "cityEntity", source = "city")
  @Mapping(target = "id", ignore = true)
  void firstCreate(
      ProfileCreateRequest request,
      CityEntity city,
      UserEntity user,
      @MappingTarget ProfileEntity profileEntity);
}
