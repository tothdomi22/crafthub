package com.dominik.crafthub.review.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.listing.service.ListingService;
import com.dominik.crafthub.notification.repository.NotificationRepository;
import com.dominik.crafthub.notification.service.NotificationService;
import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestStatusEnum;
import com.dominik.crafthub.purchaserequest.exception.PurchaseRequestNotFoundException;
import com.dominik.crafthub.purchaserequest.repository.PurchaseRequestRepostitory;
import com.dominik.crafthub.review.dto.ReviewCreateRequest;
import com.dominik.crafthub.review.dto.ReviewDto;
import com.dominik.crafthub.review.dto.ReviewListingResponse;
import com.dominik.crafthub.review.entity.ReviewTypeEnum;
import com.dominik.crafthub.review.exception.CantReviewNotAcceptedPurchaseRequestsException;
import com.dominik.crafthub.review.exception.NotPartOfThisPurchaseRequestException;
import com.dominik.crafthub.review.exception.ReviewAlreadyExistsException;
import com.dominik.crafthub.review.mapper.ReviewMapper;
import com.dominik.crafthub.review.repository.ReviewRepository;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ReviewService {
  private final AuthService authService;
  private final ListingService listingService;
  private final ReviewMapper reviewMapper;
  private final ReviewRepository reviewRepository;
  private final PurchaseRequestRepostitory purchaseRequestRepostitory;
  private final NotificationService notificationService;
  private final NotificationRepository notificationRepository;

  public ReviewDto createReview(Long purchaseRequestId, ReviewCreateRequest request) {
    var user = authService.getCurrentUser();
    var purchaseRequestEntity = purchaseRequestRepostitory.findById(purchaseRequestId).orElse(null);
    if (purchaseRequestEntity == null) {
      throw new PurchaseRequestNotFoundException();
    }
    if (!purchaseRequestEntity.getStatus().equals(PurchaseRequestStatusEnum.ACCEPTED)) {
      throw new CantReviewNotAcceptedPurchaseRequestsException();
    }
    if (!purchaseRequestEntity.getRequesterUser().getId().equals(user.getId())
        && !purchaseRequestEntity.getListing().getUserEntity().getId().equals(user.getId())) {
      throw new NotPartOfThisPurchaseRequestException();
    }
    var reviewType =
        purchaseRequestEntity.getRequesterUser().getId().equals(user.getId())
            ? ReviewTypeEnum.PURCHASER
            : ReviewTypeEnum.OWNER;
    var reviewExists =
        reviewRepository.existsByPurchaseRequestEntity_IdAndReviewType(
            purchaseRequestId, reviewType);
    if (reviewExists) {
      throw new ReviewAlreadyExistsException();
    }

    var listing = purchaseRequestEntity.getListing();
    var review =
        reviewMapper.toEntity(
            request, user, listing, OffsetDateTime.now(), reviewType, purchaseRequestEntity);
    reviewRepository.save(review);
    var notification =
        notificationRepository.findByUserIdAndPurchaseRequestId(user.getId(), purchaseRequestId);
    notificationService.markNotificationRead(notification.getId());
    return reviewMapper.toDto(review);
  }

  public List<ReviewListingResponse> listReviewsByUser(Long userId) {
    var reviews = reviewRepository.findAllReviewsOfUser(userId);
    return reviews.stream().map(reviewMapper::toListingResponse).toList();
  }
}
