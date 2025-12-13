package com.dominik.crafthub.purchaserequest.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.listing.entity.ListingStatusEnum;
import com.dominik.crafthub.listing.exception.ListingNotFoundException;
import com.dominik.crafthub.listing.repository.ListingRepository;
import com.dominik.crafthub.notification.dto.PurchaseRequestNotificationPayload;
import com.dominik.crafthub.notification.dto.ReviewNotificationPayload;
import com.dominik.crafthub.notification.entity.NotificationTypeEnum;
import com.dominik.crafthub.notification.repository.NotificationRepository;
import com.dominik.crafthub.notification.service.NotificationService;
import com.dominik.crafthub.purchaserequest.dto.PurchaseRequestDecideRequest;
import com.dominik.crafthub.purchaserequest.dto.PurchaseRequestDto;
import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestPatchStatusEnum;
import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestStatusEnum;
import com.dominik.crafthub.purchaserequest.exception.*;
import com.dominik.crafthub.purchaserequest.mapper.PurchaseRequestMapper;
import com.dominik.crafthub.purchaserequest.repository.PurchaseRequestRepostitory;
import java.beans.Transient;
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
  private final NotificationService notificationService;
  private final NotificationRepository notificationRepository;

  @Transient
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
    var payload =
        new PurchaseRequestNotificationPayload(
            purchaseRequestEntity.getId(),
            listing.getId(),
            listing.getName(),
            user.getId(),
            user.getName());
    notificationService.createNotification(
        listing.getUserEntity(), NotificationTypeEnum.PURCHASE_REQUEST, payload);
    return purchaseRequestMapper.toDto(purchaseRequestEntity);
  }

  public PurchaseRequestDto decideRequest(
      long purchaseRequestId, PurchaseRequestDecideRequest request) {
    var purchaseRequest = purchaseRequestRepostitory.findById(purchaseRequestId).orElse(null);
    if (purchaseRequest == null) {
      throw new PurchaseRequestNotFoundException();
    }
    if (!purchaseRequest.getStatus().equals(PurchaseRequestStatusEnum.PENDING)) {
      throw new CantAcceptNotPendingPurchaseRequestException();
    }
    var user = authService.getCurrentUser();
    if (!purchaseRequest.getListing().getUserEntity().getId().equals(user.getId())) {
      throw new NotTheRecipientOfPurchaseRequestException();
    }
    var listing = listingRepository.findById(purchaseRequest.getListing().getId()).orElseThrow();
    if (request.status().equals(PurchaseRequestPatchStatusEnum.ACCEPT)) {
      listing.setStatus(ListingStatusEnum.ARCHIVED);
      listingRepository.save(listing);
      purchaseRequestRepostitory.acceptOneDeclineOthers(
          purchaseRequestId,
          listing.getId(),
          PurchaseRequestStatusEnum.ACCEPTED.name(),
          PurchaseRequestStatusEnum.DECLINED.name());
      notificationRepository.markAllReadByListingId(listing.getId());
      purchaseRequestRepostitory.save(purchaseRequest);
      //      FIXME: this is ugly as shit, refactor later
      var payload =
          new ReviewNotificationPayload(
              purchaseRequestId, listing.getName(), purchaseRequest.getRequesterUser().getName());
      notificationService.createNotification(
          purchaseRequest.getListing().getUserEntity(),
          NotificationTypeEnum.REVIEW_REQUEST,
          payload);
      var payload2 =
          new ReviewNotificationPayload(
              purchaseRequestId, listing.getName(), purchaseRequest.getListing().getName());
      notificationService.createNotification(
          purchaseRequest.getRequesterUser(), NotificationTypeEnum.REVIEW_REQUEST, payload2);
    } else {
      purchaseRequest.setStatus(PurchaseRequestStatusEnum.DECLINED);
      purchaseRequestRepostitory.save(purchaseRequest);
    }

    var notification = notificationRepository.findByRequestId(purchaseRequestId);
    notificationService.markNotificationRead(notification.getId());
    return purchaseRequestMapper.toDto(purchaseRequest);
  }
}
