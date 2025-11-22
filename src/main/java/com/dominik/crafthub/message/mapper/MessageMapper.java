package com.dominik.crafthub.message.mapper;

import com.dominik.crafthub.message.dto.MessageDto;
import com.dominik.crafthub.message.entity.MessageEntity;
import com.dominik.crafthub.user.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
    componentModel = "spring",
    uses = {UserDto.class})
public interface MessageMapper {
  @Mapping(target = "sender", source = "sender")
  MessageDto toDto(MessageEntity messageEntity);
}
