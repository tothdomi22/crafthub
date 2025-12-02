package com.dominik.crafthub.conversation.mapper;

import com.dominik.crafthub.conversation.dto.ConversationDto;
import com.dominik.crafthub.conversation.dto.ConversationListDto;
import com.dominik.crafthub.conversation.entity.ConversationEntity;
import com.dominik.crafthub.listing.controller.ListingMapper;
import com.dominik.crafthub.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {UserMapper.class, ListingMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ConversationMapper {
  @Mapping(source = "userEntity1", target = "userOne")
  @Mapping(source = "userEntity2", target = "userTwo")
  @Mapping(source = "listingEntity", target = "listing")
  ConversationDto toDto(ConversationEntity conversationEntity);

  @Mapping(source = "userEntity1", target = "userOne")
  @Mapping(source = "userEntity2", target = "userTwo")
  ConversationListDto toListDto(ConversationEntity conversationEntity);
}
