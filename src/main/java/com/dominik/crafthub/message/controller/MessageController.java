package com.dominik.crafthub.message.controller;

import com.dominik.crafthub.conversation.exception.ConversationNotFoundException;
import com.dominik.crafthub.conversation.exception.NotPartOfThisConversationException;
import com.dominik.crafthub.message.dto.MessageCreateRequest;
import com.dominik.crafthub.message.service.MessageService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/message")
@AllArgsConstructor
public class MessageController {
  private final MessageService messageService;

  @PostMapping
  public ResponseEntity<?> createMessage(@Valid @RequestBody MessageCreateRequest request) {
    var messageDto = messageService.createMessage(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(messageDto);
  }

  @ExceptionHandler(ConversationNotFoundException.class)
  public ResponseEntity<Map<String, String>> conversationExists() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message:", "Conversation not found"));
  }

  @ExceptionHandler(NotPartOfThisConversationException.class)
  public ResponseEntity<Map<String, String>> notPartOfConversation() {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body(Map.of("message:", "You are not part of this conversation"));
  }
}
