package com.dominik.crafthub.conversation.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.conversation.dto.ConversationCreateRequest;
import com.dominik.crafthub.conversation.dto.ConversationDto;
import com.dominik.crafthub.conversation.dto.ConversationListDto;
import com.dominik.crafthub.conversation.dto.ConversationWithMessagesDto;
import com.dominik.crafthub.conversation.entity.ConversationEntity;
import com.dominik.crafthub.conversation.exception.ConversationAlreadyExistsException;
import com.dominik.crafthub.conversation.exception.ConversationNotFoundException;
import com.dominik.crafthub.conversation.exception.NotPartOfThisConversationException;
import com.dominik.crafthub.conversation.exception.YourConversationException;
import com.dominik.crafthub.conversation.mapper.ConversationMapper;
import com.dominik.crafthub.conversation.repository.ConversationRepository;
import com.dominik.crafthub.listing.mapper.ListingMapper;
import com.dominik.crafthub.listing.repository.ListingRepository;
import com.dominik.crafthub.listing.service.ListingService;
import com.dominik.crafthub.message.mapper.MessageMapper;
import com.dominik.crafthub.message.repository.MessageRepository;
import com.dominik.crafthub.user.mapper.UserMapper;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ConversationService {

  private final ListingService listingService;
  private final AuthService authService;
  private final ConversationRepository conversationRepository;
  private final ConversationMapper conversationMapper;
  private final MessageMapper messageMapper;
  private final MessageRepository messageRepository;
  private final ListingRepository listingRepository;
  private final ListingMapper listingMapper;
  private final UserMapper userMapper;

  public ConversationDto createConversation(ConversationCreateRequest request) {
    var listing = listingService.findListingById(request.listingId());
    var userOne = authService.getCurrentUser();
    var conversationExists =
        conversationRepository.existsByUserEntity1_IdAndListingEntity_Id(
            userOne.getId(), listing.getId());
    if (conversationExists) {
      throw new ConversationAlreadyExistsException();
    }
    if (listing.getUserEntity().getId().equals(userOne.getId())) {
      throw new YourConversationException();
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

  public List<ConversationListDto> getAllConversationsofUser() {
    var user = authService.getCurrentUser();
    var conversations =
        conversationRepository.findAllByUserEntity1_IdOrUserEntity2_Id(
            user.getId(), user.getId(), Sort.by(Sort.Direction.DESC, "updatedAt"));
    return conversations.stream().map(conversationMapper::toListDto).toList();
  }

  public ConversationWithMessagesDto getConversationWithMessages(Long id) {
    var user = authService.getCurrentUser();
    var conversation = getConversationById(id);
    if (!conversation.getUserEntity1().getId().equals(user.getId())
        && !conversation.getUserEntity2().getId().equals(user.getId())) {
      throw new NotPartOfThisConversationException();
    }
    var listing = listingRepository.findById(conversation.getListingEntity().getId()).orElseThrow();
    var listingDto = listingMapper.toNoCategoriesDto(listing);
    var recipient =
        conversation.getUserEntity1().getId().equals(user.getId())
            ? conversation.getUserEntity2()
            : conversation.getUserEntity1();
    var recipientDto = userMapper.toDto(recipient);

    var messages =
        messageRepository.findAllByConversationEntity_Id(
            id, Sort.by(Sort.Direction.ASC, "createdAt"));
    return new ConversationWithMessagesDto(
        conversation.getId(),
        messages.stream().map(messageMapper::toDto).toList(),
        listingDto,
        recipientDto);
  }

  public ConversationEntity getConversationById(Long id) {
    var conversation = conversationRepository.findById(id).orElse(null);
    if (conversation == null) {
      throw new ConversationNotFoundException();
    }
    return conversation;
  }
}
