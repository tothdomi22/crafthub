package com.dominik.crafthub.purchaserequest.controller;

import com.dominik.crafthub.listing.exception.ListingNotFoundException;
import com.dominik.crafthub.purchaserequest.exception.CantPurchaseArchivedListingException;
import com.dominik.crafthub.purchaserequest.exception.ListingIsPurchasedException;
import com.dominik.crafthub.purchaserequest.exception.YourPurchaseIsPendingException;
import com.dominik.crafthub.purchaserequest.service.PurchaseRequestService;
import com.dominik.crafthub.review.exception.CantReviewYourOwnListingException;
import com.dominik.crafthub.user.exceptions.UserNotFoundException;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/purchase-request")
public class PurchaseRequestController {
  private final PurchaseRequestService purchaseRequestService;

  @PostMapping("/{listingId}")
  public ResponseEntity<?> createPurchaseRequest(@PathVariable long listingId) {
    var purchaseRequestDto = purchaseRequestService.createRequest(listingId);
    return ResponseEntity.status(HttpStatus.CREATED).body(purchaseRequestDto);
  }

  @ExceptionHandler(YourPurchaseIsPendingException.class)
  public ResponseEntity<Map<String, String>> purchaseIsPending() {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("message", "Your purchase request is pending"));
  }

  @ExceptionHandler(CantPurchaseArchivedListingException.class)
  public ResponseEntity<Map<String, String>> cantPurchaseArchived() {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("message", "You cannot create a purchase request to an archived listing"));
  }

  @ExceptionHandler(CantReviewYourOwnListingException.class)
  public ResponseEntity<Map<String, String>> cantPurchaseOwn() {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("message", "You cannot create a purchase request to your own listing"));
  }

  @ExceptionHandler(ListingIsPurchasedException.class)
  public ResponseEntity<Map<String, String>> listingIsPurchased() {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("message", "That listing have been purchased already"));
  }

  @ExceptionHandler(ListingNotFoundException.class)
  public ResponseEntity<Map<String, String>> listingNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message", "Listing is not found"));
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<Map<String, String>> userNotFoud() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message", "User not found"));
  }
}
