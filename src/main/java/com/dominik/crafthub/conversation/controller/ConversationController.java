package com.dominik.crafthub.conversation.controller;

import com.dominik.crafthub.conversation.dto.ConversationCreateRequest;
import com.dominik.crafthub.conversation.exception.ConversationAlreadyExistsException;
import com.dominik.crafthub.conversation.service.ConversationService;
import com.dominik.crafthub.listing.exception.ListingNotFoundException;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/conversation")
public class ConversationController {
  private final ConversationService conversationService;

  @PostMapping
  public ResponseEntity<?> createConversation(
      @Valid @RequestBody ConversationCreateRequest request) {
    var conversationDto = conversationService.createConversation(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(conversationDto);
  }

  @ExceptionHandler(ListingNotFoundException.class)
  public ResponseEntity<Map<String, String>> listingNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message:", "Listing not found"));
  }

  @ExceptionHandler(ConversationAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> conversationExists() {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("message:", "Conversation already exists"));
  }
}
