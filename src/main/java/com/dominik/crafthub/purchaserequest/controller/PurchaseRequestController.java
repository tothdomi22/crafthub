package com.dominik.crafthub.purchaserequest.controller;

import com.dominik.crafthub.listing.exception.ListingNotFoundException;
import com.dominik.crafthub.purchaserequest.dto.PurchaseRequestDecideRequest;
import com.dominik.crafthub.purchaserequest.exception.*;
import com.dominik.crafthub.purchaserequest.service.PurchaseRequestService;
import com.dominik.crafthub.review.exception.CantReviewYourOwnListingException;
import com.dominik.crafthub.user.exceptions.UserNotFoundException;
import jakarta.validation.Valid;
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

  @PatchMapping("/{purchaseRequestId}")
  public ResponseEntity<?> decidePurchaseRequestStatus(
      @PathVariable long purchaseRequestId,
      @RequestBody @Valid PurchaseRequestDecideRequest request) {
    var purchaseRequestDto = purchaseRequestService.decideRequest(purchaseRequestId, request);
    return ResponseEntity.status(HttpStatus.OK).body(purchaseRequestDto);
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
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
  }

  @ExceptionHandler(PurchaseRequestNotFoundException.class)
  public ResponseEntity<Map<String, String>> purchaseRequestNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message", "Purchase request not found"));
  }

  @ExceptionHandler(CantAcceptNotPendingPurchaseRequestException.class)
  public ResponseEntity<Map<String, String>> notPendingRequest() {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("message", "Can't accept a purchase request thats not pending"));
  }

  @ExceptionHandler(NotTheOwnerOfPurchaseRequestException.class)
  public ResponseEntity<Map<String, String>> notTheOwner() {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("message", "You are not the owner of the purchase request"));
  }
}
