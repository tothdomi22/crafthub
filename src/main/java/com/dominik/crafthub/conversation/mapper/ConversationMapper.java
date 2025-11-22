package com.dominik.crafthub.conversation.mapper;

import com.dominik.crafthub.conversation.dto.ConversationDto;
import com.dominik.crafthub.conversation.entity.ConversationEntity;
import com.dominik.crafthub.listing.dto.ListingDto;
import com.dominik.crafthub.user.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {UserDto.class, ListingDto.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ConversationMapper {
  @Mapping(source = "userEntity1", target = "userOne")
  @Mapping(source = "userEntity2", target = "userTwo")
  @Mapping(source = "listingEntity", target = "listing")
  ConversationDto toDto(ConversationEntity conversationEntity);
}
