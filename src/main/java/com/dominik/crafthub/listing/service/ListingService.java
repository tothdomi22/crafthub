package com.dominik.crafthub.listing.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.listing.controller.ListingMapper;
import com.dominik.crafthub.listing.dto.ListingCreateRequest;
import com.dominik.crafthub.listing.dto.ListingDto;
import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import com.dominik.crafthub.listing.repository.ListingRepository;
import com.dominik.crafthub.subcategory.service.SubCategoryService;
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
    listingRepository.save(listing);
    return listingMapper.toDto(listing);
  }
}
