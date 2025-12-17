package com.dominik.crafthub.conversation.mapper;

import com.dominik.crafthub.city.mapper.CityMapper;
import com.dominik.crafthub.conversation.dto.*;
import com.dominik.crafthub.conversation.entity.ConversationEntity;
import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.listing.mapper.ListingMapper;
import com.dominik.crafthub.message.entity.MessageEntity;
import com.dominik.crafthub.message.mapper.MessageMapper;
import com.dominik.crafthub.user.entity.UserEntity;
import com.dominik.crafthub.user.mapper.UserMapper;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {UserMapper.class, ListingMapper.class, MessageMapper.class, CityMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ConversationMapper {
  @Mapping(source = "userEntity1", target = "userOne")
  @Mapping(source = "userEntity2", target = "userTwo")
  @Mapping(source = "listingEntity", target = "listing")
  ConversationDto toDto(ConversationEntity conversationEntity);

  @Mapping(target = "id", source = "id")
  ConversationWithMessagesDto toConversationWithMessagesDto(
      Long id, List<MessageEntity> messages, ListingEntity listing, UserEntity recipient);

  ConversationsWithLastMessageDtosList toConversationsWithLastMessageDtoList(
      List<ConversationWithLastMessageDto> conversations, Integer unread);
}
