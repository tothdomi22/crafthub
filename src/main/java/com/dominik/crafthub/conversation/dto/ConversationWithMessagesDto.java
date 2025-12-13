package com.dominik.crafthub.conversation.dto;

import com.dominik.crafthub.listing.dto.ListingNoCategoriesNoUserDto;
import com.dominik.crafthub.message.dto.MessageDto;
import com.dominik.crafthub.user.dto.UserDto;
import java.util.List;

public record ConversationWithMessagesDto(
    Long id, List<MessageDto> messages, ListingNoCategoriesNoUserDto listing, UserDto recipient) {}
