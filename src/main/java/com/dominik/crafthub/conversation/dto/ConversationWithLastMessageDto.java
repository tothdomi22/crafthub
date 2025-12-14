package com.dominik.crafthub.conversation.dto;

import com.dominik.crafthub.message.dto.MessageDto;

public record ConversationWithLastMessageDto(
    ConversationDto conversation, MessageDto lastMessage, Boolean isRead) {}
