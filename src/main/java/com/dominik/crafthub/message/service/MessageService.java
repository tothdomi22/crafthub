package com.dominik.crafthub.message.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.conversation.exception.NotPartOfThisConversationException;
import com.dominik.crafthub.conversation.repository.ConversationRepository;
import com.dominik.crafthub.conversation.service.ConversationService;
import com.dominik.crafthub.message.dto.MessageCreateRequest;
import com.dominik.crafthub.message.dto.MessageDto;
import com.dominik.crafthub.message.mapper.MessageMapper;
import com.dominik.crafthub.message.repository.MessageRepository;
import com.dominik.crafthub.messageread.mapper.MessageReadMapper;
import com.dominik.crafthub.messageread.repository.MessageReadRepository;
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
  private final MessageReadMapper messageReadMapper;
  private final MessageReadRepository messageReadRepository;

  public MessageDto createMessage(MessageCreateRequest request) {
    var conversation = conversationService.getConversationById(request.conversationId());
    var user = authService.getCurrentUser();
    if (!conversation.getUserEntity1().getId().equals(user.getId())
        && !conversation.getUserEntity2().getId().equals(user.getId())) {
      throw new NotPartOfThisConversationException();
    }
    var recipient =
        conversation.getUserEntity1().equals(user) ? conversation.getUserEntity2() : user;
    var messageEntity =
        messageMapper.toEntity(request.textContent(), OffsetDateTime.now(), conversation, user);
    var messageReadEntity = messageReadMapper.toEntity(messageEntity, recipient);
    conversation.setUpdatedAt(OffsetDateTime.now());
    conversationRepository.save(conversation);
    messageRepository.save(messageEntity);
    messageReadRepository.save(messageReadEntity);
    return messageMapper.toDto(messageEntity);
  }
}
