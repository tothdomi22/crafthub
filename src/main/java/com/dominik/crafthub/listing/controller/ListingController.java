package com.dominik.crafthub.listing.controller;

import com.dominik.crafthub.listing.dto.ListingCreateRequest;
import com.dominik.crafthub.listing.dto.ListingUpdateRequest;
import com.dominik.crafthub.listing.exception.ListingNotFoundException;
import com.dominik.crafthub.listing.exception.NotTheOwnerOfListingException;
import com.dominik.crafthub.listing.service.ListingService;
import com.dominik.crafthub.subcategory.exception.SubCategoryNotFoundException;
import jakarta.validation.Valid;
import java.util.Map;
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

  @PutMapping("/{id}")
  public ResponseEntity<?> updateListing(
      @PathVariable Long id, @Valid @RequestBody ListingUpdateRequest request) {
    var listingDto = listingService.updateListing(id, request);
    return ResponseEntity.status(HttpStatus.OK).body(listingDto);
  }

  @ExceptionHandler(SubCategoryNotFoundException.class)
  public ResponseEntity<Map<String, String>> subCategoryNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message:", "Sub category not found"));
  }

  @ExceptionHandler(NotTheOwnerOfListingException.class)
  public ResponseEntity<Map<String, String>> notTheOwnerOfListing() {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body(Map.of("message:", "You are not the owner of the listing"));
  }

  @ExceptionHandler(ListingNotFoundException.class)
  public ResponseEntity<Map<String, String>> listingNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message:", "Listing not found"));
  }
}
