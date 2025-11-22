package com.dominik.crafthub.message.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.conversation.exception.NotPartOfThisConversationException;
import com.dominik.crafthub.conversation.repository.ConversationRepository;
import com.dominik.crafthub.conversation.service.ConversationService;
import com.dominik.crafthub.message.dto.MessageCreateRequest;
import com.dominik.crafthub.message.dto.MessageDto;
import com.dominik.crafthub.message.entity.MessageEntity;
import com.dominik.crafthub.message.mapper.MessageMapper;
import com.dominik.crafthub.message.repository.MessageRepository;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class MessageService {
  private final ConversationService conversationService;
  private final AuthService authService;
  private final MessageRepository messageRepository;
  private final MessageMapper messageMapper;
  private final ConversationRepository conversationRepository;

  public MessageDto createMessage(MessageCreateRequest request) {
    var conversation = conversationService.getConversationById(request.conversationId());
    var user = authService.getCurrentUser();
    var message = new MessageEntity();
    if (!conversation.getUserEntity1().getId().equals(user.getId())
        && !conversation.getUserEntity2().getId().equals(user.getId())) {
      throw new NotPartOfThisConversationException();
    }
    message.setTextContent(request.textContent());
    message.setSender(user);
    message.setCreatedAt(OffsetDateTime.now());
    message.setConversationEntity(conversation);
    conversation.setUpdatedAt(OffsetDateTime.now());
    conversationRepository.save(conversation);
    messageRepository.save(message);
    return messageMapper.toDto(message);
  }
}
