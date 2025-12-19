package com.dominik.crafthub.search.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.listing.dto.ListingsWithLikesDto;
import com.dominik.crafthub.listing.repository.ListingRepository;
import com.dominik.crafthub.search.dto.SearchListingRequestDto;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SearchService {

  private final ListingRepository listingRepository;
  private final AuthService authService;

  public Page<ListingsWithLikesDto> searchListings(SearchListingRequestDto request, int size) {
    var user = authService.getCurrentUser();
    Long userId = (user != null) ? user.getId() : null;
    Pageable pageable =
        PageRequest.of(request.page(), size, Sort.by(Sort.Direction.DESC, "createdAt"));
    return listingRepository.searchListing(userId, request.query(), pageable);
  }
}
