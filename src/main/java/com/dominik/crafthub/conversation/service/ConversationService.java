package com.dominik.crafthub.conversation.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.conversation.dto.ConversationCreateRequest;
import com.dominik.crafthub.conversation.dto.ConversationDto;
import com.dominik.crafthub.conversation.entity.ConversationEntity;
import com.dominik.crafthub.conversation.exception.ConversationAlreadyExistsException;
import com.dominik.crafthub.conversation.mapper.ConversationMapper;
import com.dominik.crafthub.conversation.repository.ConversationRepository;
import com.dominik.crafthub.listing.service.ListingService;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ConversationService {

  private final ListingService listingService;
  private final AuthService authService;
  private final ConversationRepository conversationRepository;
  private final ConversationMapper conversationMapper;

  public ConversationDto createConversation(ConversationCreateRequest request) {
    var listing = listingService.findListingById(request.listingId());
    var userOne = authService.getCurrentUser();
    var conversationExists =
        conversationRepository.existsByUserEntity1_IdAndListingEntity_Id(
            userOne.getId(), listing.getId());
    if (conversationExists) {
      throw new ConversationAlreadyExistsException();
    }
    var conversation = new ConversationEntity();
    conversation.setListingEntity(listing);
    conversation.setCreatedAt(OffsetDateTime.now());
    conversation.setUpdatedAt(OffsetDateTime.now());
    conversation.setUserEntity1(userOne);
    conversation.setUserEntity2(listing.getUserEntity());
    conversationRepository.save(conversation);
    return conversationMapper.toDto(conversation);
  }
}
