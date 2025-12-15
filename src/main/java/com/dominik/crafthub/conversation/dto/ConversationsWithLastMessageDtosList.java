package com.dominik.crafthub.conversation.dto;

import java.util.List;

public record ConversationsWithLastMessageDtosList(
    List<ConversationWithLastMessageDto> conversations, Integer unread) {}
