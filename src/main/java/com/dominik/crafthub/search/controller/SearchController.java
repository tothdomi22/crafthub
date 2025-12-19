package com.dominik.crafthub.search.controller;

import com.dominik.crafthub.search.dto.SearchListingRequestDto;
import com.dominik.crafthub.search.service.SearchService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/search")
public class SearchController {
  private final SearchService searchService;

  @GetMapping("/listing")
  ResponseEntity<?> searchListing(SearchListingRequestDto request) {
    var size = 12;
    var listings = searchService.searchListings(request, size);
    return ResponseEntity.status(HttpStatus.OK).body(listings);
  }
}
