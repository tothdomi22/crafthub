package com.dominik.crafthub.user.mapper;

import com.dominik.crafthub.user.dto.UserDto;
import com.dominik.crafthub.user.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    UserDto toDto(UserEntity user);
}
