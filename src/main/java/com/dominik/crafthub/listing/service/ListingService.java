package com.dominik.crafthub.listing.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.conversation.repository.ConversationRepository;
import com.dominik.crafthub.listing.controller.ListingMapper;
import com.dominik.crafthub.listing.dto.ListingCreateRequest;
import com.dominik.crafthub.listing.dto.ListingDto;
import com.dominik.crafthub.listing.dto.ListingSingleViewDto;
import com.dominik.crafthub.listing.dto.ListingUpdateRequest;
import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import com.dominik.crafthub.listing.exception.ListingNotFoundException;
import com.dominik.crafthub.listing.exception.NotTheOwnerOfListingException;
import com.dominik.crafthub.listing.repository.ListingRepository;
import com.dominik.crafthub.subcategory.service.SubCategoryService;
import com.dominik.crafthub.user.service.UserService;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ListingService {
  private final AuthService authService;
  private final ListingMapper listingMapper;
  private final SubCategoryService subCategoryService;
  private final ListingRepository listingRepository;
  private final UserService userService;
  private final ConversationRepository conversationRepository;

  public ListingDto createListing(ListingCreateRequest request) {
    var user = authService.getCurrentUser();
    var subCategory = subCategoryService.findSubCategoryById(request.subCategoryId());
    var listing = listingMapper.toEntity(request);
    listing.setUserEntity(user);
    listing.setSubCategoryEntity(subCategory);
    listing.setStatus(ListingStatusEnum.ACTIVE);
    listing.setCreatedAt(OffsetDateTime.now());
    listingRepository.save(listing);
    return listingMapper.toDto(listing);
  }

  public List<ListingDto> listListings(Long id) {
    if (id != null) {
      return listingRepository.findAllByUserEntityId(id).stream()
          .map(listingMapper::toDto)
          .toList();
    } else {
      return listingRepository.findAll().stream().map(listingMapper::toDto).toList();
    }
  }

  public ListingSingleViewDto getListing(Long id) {
    var user = authService.getCurrentUser();
    var listing = findListingById(id);
    var conversation =
        conversationRepository
            .findByListingEntity_IdAndUserEntity1_IdAndUserEntity2_Id(
                listing.getId(), user.getId(), listing.getUserEntity().getId())
            .orElse(null);
    Long conversationId = (conversation != null) ? conversation.getId() : null;
    return listingMapper.toSingleViewDto(listing, conversationId);
  }

  public ListingDto updateListing(Long id, ListingUpdateRequest request) {
    var user = authService.getCurrentUser();
    var listing = findListingById(id);
    if (!listing.getUserEntity().getId().equals(user.getId())) {
      throw new NotTheOwnerOfListingException();
    }
    if (request.subCategoryId() != null) {
      var subCategory = subCategoryService.findSubCategoryById(request.subCategoryId());
      listing.setSubCategoryEntity(subCategory);
    }
    listingMapper.update(request, listing);
    listingRepository.save(listing);
    return listingMapper.toDto(listing);
  }

  public ListingEntity findListingById(Long id) {
    var listing = listingRepository.findById(id).orElse(null);
    if (listing == null) {
      throw new ListingNotFoundException();
    }
    return listing;
  }
}
