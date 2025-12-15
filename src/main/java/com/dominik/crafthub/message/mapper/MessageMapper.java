package com.dominik.crafthub.message.mapper;

import com.dominik.crafthub.conversation.entity.ConversationEntity;
import com.dominik.crafthub.message.dto.MessageDto;
import com.dominik.crafthub.message.entity.MessageEntity;
import com.dominik.crafthub.user.dto.UserDto;
import com.dominik.crafthub.user.entity.UserEntity;
import java.time.OffsetDateTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
    componentModel = "spring",
    uses = {UserDto.class})
public interface MessageMapper {
  @Mapping(target = "sender", source = "sender")
  MessageDto toDto(MessageEntity messageEntity);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", source = "createdAt")
  MessageEntity toEntity(
      String textContent,
      OffsetDateTime createdAt,
      ConversationEntity conversationEntity,
      UserEntity sender);
}
