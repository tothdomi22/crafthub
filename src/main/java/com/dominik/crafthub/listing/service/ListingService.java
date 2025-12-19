package com.dominik.crafthub.listing.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.city.entity.CityEntity;
import com.dominik.crafthub.city.exception.CityNotFoundException;
import com.dominik.crafthub.city.repository.CityRepository;
import com.dominik.crafthub.listing.dto.*;
import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import com.dominik.crafthub.listing.exception.CantReviveArchiedListingException;
import com.dominik.crafthub.listing.exception.ListingNotFoundException;
import com.dominik.crafthub.listing.exception.NotTheOwnerOfListingException;
import com.dominik.crafthub.listing.mapper.ListingMapper;
import com.dominik.crafthub.listing.repository.ListingRepository;
import com.dominik.crafthub.subcategory.service.SubCategoryService;
import com.dominik.crafthub.user.exceptions.UserNotFoundException;
import com.dominik.crafthub.user.repository.UserRepository;
import com.dominik.crafthub.user.service.UserService;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ListingService {
  private final AuthService authService;
  private final ListingMapper listingMapper;
  private final SubCategoryService subCategoryService;
  private final ListingRepository listingRepository;
  private final CityRepository cityRepository;
  private final UserService userService;
  private final UserRepository userRepository;

  public ListingDto createListing(ListingCreateRequest request) {
    var user = authService.getCurrentUser();
    var subCategory = subCategoryService.findSubCategoryById(request.subCategoryId());
    var city = findCityById(request.cityId());
    var listing =
        listingMapper.toEntity(
            request, city, user, subCategory, ListingStatusEnum.ACTIVE, OffsetDateTime.now());
    listingRepository.save(listing);
    return listingMapper.toDto(listing);
  }

  public Page<ListingsWithLikesDto> listListings(
      Long id,
      int page,
      int size,
      List<Long> mainCategoryIds,
      List<Long> subCategoryIds,
      Double minPrice,
      Double maxPrice) {
    var user = authService.getCurrentUser();
    Long userId = (user != null) ? user.getId() : null;
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    if (id == null) {
      return listingRepository.findAllListingsWithIsLiked(
          userId, pageable, mainCategoryIds, subCategoryIds, minPrice, maxPrice);
    } else {
      var searchedUser = userRepository.findById(id).orElse(null);
      if (searchedUser == null) {
        throw new UserNotFoundException();
      }
      return listingRepository.findAllUseresListingsWithIsLiked(
          userId, searchedUser.getId(), pageable);
    }
  }

  public List<ListingDto> listMyListings() {
    var user = authService.getCurrentUser();
    return listingRepository.findAllByUserEntityId(user.getId()).stream()
        .map(listingMapper::toDto)
        .toList();
  }

  public ListingSingleViewDto getListing(Long id) {
    var user = authService.getCurrentUser();
    var listing = listingRepository.findSingleViewListing(user.getId(), id).orElse(null);
    if (listing == null) {
      throw new ListingNotFoundException();
    }
    return listing;
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
    if ((request.status() != null && !request.status().equals(ListingStatusEnum.ARCHIVED))
        && listing.getStatus().equals(ListingStatusEnum.ARCHIVED)) {
      throw new CantReviveArchiedListingException();
    }
    CityEntity city = new CityEntity();
    if (request.cityId() != null) {
      city = findCityById(request.cityId());
    }
    listingMapper.update(request, city, listing);
    System.out.println(listing.getCityEntity().getId());
    listingRepository.save(listing);
    return listingMapper.toDto(listing);
  }

  public ListingEntity findListingById(Long id) {
    var listing = listingRepository.findListingById(id).orElse(null);
    if (listing == null) {
      throw new ListingNotFoundException();
    }
    return listing;
  }

  public CityEntity findCityById(Short id) {
    var city = cityRepository.findById(id).orElse(null);
    if (city == null) {
      throw new CityNotFoundException();
    }
    return city;
  }
}
