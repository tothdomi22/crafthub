package com.dominik.crafthub.messageread.mapper;

import com.dominik.crafthub.message.entity.MessageEntity;
import com.dominik.crafthub.messageread.entity.MessageReadEntity;
import com.dominik.crafthub.user.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface MessageReadMapper {
  @Mapping(target = "id", ignore = true)
  MessageReadEntity toEntity(MessageEntity messageEntity, UserEntity userEntity);
}
