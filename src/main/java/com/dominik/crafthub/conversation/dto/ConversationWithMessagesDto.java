package com.dominik.crafthub.conversation.dto;

import com.dominik.crafthub.message.dto.MessageDto;
import java.util.List;

public record ConversationWithMessagesDto(Long id, List<MessageDto> messages) {}
