package com.dominik.crafthub.purchaserequest.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import com.dominik.crafthub.listing.exception.ListingNotFoundException;
import com.dominik.crafthub.listing.repository.ListingRepository;
import com.dominik.crafthub.purchaserequest.dto.PurchaseRequestDto;
import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestStatusEnum;
import com.dominik.crafthub.purchaserequest.exception.CantPurchaseArchivedListingException;
import com.dominik.crafthub.purchaserequest.exception.CantPurchaseYourOwnListingException;
import com.dominik.crafthub.purchaserequest.exception.ListingIsPurchasedException;
import com.dominik.crafthub.purchaserequest.exception.YourPurchaseIsPendingException;
import com.dominik.crafthub.purchaserequest.mapper.PurchaseRequestMapper;
import com.dominik.crafthub.purchaserequest.repository.PurchaseRequestRepostitory;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PurchaseRequestService {
  private final ListingRepository listingRepository;
  private final AuthService authService;
  private final PurchaseRequestRepostitory purchaseRequestRepostitory;
  private final PurchaseRequestMapper purchaseRequestMapper;

  public PurchaseRequestDto createRequest(long listingId) {
    var user = authService.getCurrentUser();
    var listing = listingRepository.findById(listingId).orElse(null);
    if (listing == null) {
      throw new ListingNotFoundException();
    }
    if (user.getId().equals(listing.getUserEntity().getId())) {
      throw new CantPurchaseYourOwnListingException();
    }
    if (listing.getStatus().equals(ListingStatusEnum.ARCHIVED)) {
      throw new CantPurchaseArchivedListingException();
    }
    var approvedRequestExists =
        purchaseRequestRepostitory.existsByListing_IdAndStatus(
            listingId, PurchaseRequestStatusEnum.ACCEPTED);
    if (approvedRequestExists) {
      throw new ListingIsPurchasedException();
    }
    var pendingRequestExists =
        purchaseRequestRepostitory.existsByListing_IdAndRequesterUser_IdAndStatus(
            listingId, user.getId(), PurchaseRequestStatusEnum.PENDING);
    if (pendingRequestExists) {
      throw new YourPurchaseIsPendingException();
    }
    //    TODO: Add cooldown after decline
    var purchaseRequestEntity =
        purchaseRequestMapper.toEntity(
            listing, user, PurchaseRequestStatusEnum.PENDING, OffsetDateTime.now());
    purchaseRequestRepostitory.save(purchaseRequestEntity);
    purchaseRequestEntity.setRequesterUser(user);
    purchaseRequestEntity.setListing(listing);
    return purchaseRequestMapper.toDto(purchaseRequestEntity);
  }
}
