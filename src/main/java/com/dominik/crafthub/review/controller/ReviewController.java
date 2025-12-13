package com.dominik.crafthub.review.controller;

import com.dominik.crafthub.listing.exception.ListingNotFoundException;
import com.dominik.crafthub.purchaserequest.exception.PurchaseRequestNotFoundException;
import com.dominik.crafthub.review.dto.ReviewCreateRequest;
import com.dominik.crafthub.review.exception.CantReviewNotAcceptedPurchaseRequestsException;
import com.dominik.crafthub.review.exception.CantReviewYourOwnListingException;
import com.dominik.crafthub.review.exception.NotPartOfThisPurchaseRequestException;
import com.dominik.crafthub.review.exception.ReviewAlreadyExistsException;
import com.dominik.crafthub.review.service.ReviewService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/review")
@AllArgsConstructor
public class ReviewController {
  private ReviewService reviewService;

  @PostMapping("/{purchaseRequestId}")
  public ResponseEntity<?> createReview(
      @PathVariable Long purchaseRequestId, @Valid @RequestBody ReviewCreateRequest request) {
    var reviewDto = reviewService.createReview(purchaseRequestId, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(reviewDto);
  }

  @GetMapping("/list/{userId}")
  public ResponseEntity<?> getUserReviews(@PathVariable Long userId) {
    var reviews = reviewService.listReviewsByUser(userId);
    return ResponseEntity.status(HttpStatus.OK).body(reviews);
  }

  @ExceptionHandler(ReviewAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> reviewAlreadyExists() {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("message", "Review already exists for that listing"));
  }

  @ExceptionHandler(ListingNotFoundException.class)
  public ResponseEntity<Map<String, String>> listingNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Listing not found"));
  }

  @ExceptionHandler(CantReviewYourOwnListingException.class)
  public ResponseEntity<Map<String, String>> cantReviewOwnListing() {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("message", "Can't review your own listing"));
  }

  @ExceptionHandler(PurchaseRequestNotFoundException.class)
  public ResponseEntity<Map<String, String>> purchaseRequestNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message", "Purchase request not found"));
  }

  @ExceptionHandler(CantReviewNotAcceptedPurchaseRequestsException.class)
  public ResponseEntity<Map<String, String>> cantReviewNotAcceptedRequests() {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("message", "Cant create a review for a purchase request that's not accepted"));
  }

  @ExceptionHandler(NotPartOfThisPurchaseRequestException.class)
  public ResponseEntity<Map<String, String>> notPartOfPurchaseRequest() {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(Map.of("message", "You are not part of this purchase request"));
  }
}
