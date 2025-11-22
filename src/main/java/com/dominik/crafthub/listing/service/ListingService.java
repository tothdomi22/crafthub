package com.dominik.crafthub.listing.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.listing.controller.ListingMapper;
import com.dominik.crafthub.listing.dto.ListingCreateRequest;
import com.dominik.crafthub.listing.dto.ListingDto;
import com.dominik.crafthub.listing.dto.ListingUpdateRequest;
import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import com.dominik.crafthub.listing.exception.ListingNotFoundException;
import com.dominik.crafthub.listing.exception.NotTheOwnerOfListingException;
import com.dominik.crafthub.listing.repository.ListingRepository;
import com.dominik.crafthub.subcategory.service.SubCategoryService;
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

  public List<ListingDto> listListings() {
    var user = authService.getCurrentUser();
    var listings = listingRepository.findAllByUserEntityId(user.getId());
    return listings.stream().map(listingMapper::toDto).toList();
  }

  public ListingDto getListing(Long id) {
    var listing = findListingById(id);
    return listingMapper.toDto(listing);
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
