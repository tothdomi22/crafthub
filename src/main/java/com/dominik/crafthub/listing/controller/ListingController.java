package com.dominik.crafthub.listing.controller;

import com.dominik.crafthub.listing.dto.ListingCreateRequest;
import com.dominik.crafthub.listing.service.ListingService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/listing")
public class ListingController {
  private ListingService listingService;

  @PostMapping
  public ResponseEntity<?> createListing(@Valid @RequestBody ListingCreateRequest request) {
    var listingDto = listingService.createListing(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(listingDto);
  }

  @GetMapping("/list")
  public ResponseEntity<?> listListings() {
    var listings = listingService.listListings();
    return ResponseEntity.status(HttpStatus.OK).body(listings);
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getListing(@PathVariable Long id) {
    var listing = listingService.getListing(id);
    return ResponseEntity.status(HttpStatus.OK).body(listing);
  }
}
