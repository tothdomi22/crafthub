package com.dominik.crafthub.review.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.listing.service.ListingService;
import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestStatusEnum;
import com.dominik.crafthub.purchaserequest.exception.PurchaseRequestNotFoundException;
import com.dominik.crafthub.purchaserequest.repository.PurchaseRequestRepostitory;
import com.dominik.crafthub.review.dto.ReviewCreateRequest;
import com.dominik.crafthub.review.dto.ReviewDto;
import com.dominik.crafthub.review.entity.ReviewTypeEnum;
import com.dominik.crafthub.review.exception.CantReviewNotAcceptedPurchaseRequestsException;
import com.dominik.crafthub.review.exception.NotPartOfThisPurchaseRequestException;
import com.dominik.crafthub.review.exception.ReviewAlreadyExistsException;
import com.dominik.crafthub.review.mapper.ReviewMapper;
import com.dominik.crafthub.review.repository.ReviewRepository;
import java.time.OffsetDateTime;
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
    return reviewMapper.toDto(review);
  }

  //  public List<ReviewListingResponse> listReviewsByUser(Long userId) {
  //    var reviews = reviewRepository.findAllByListingEntity_UserEntity_Id(userId);
  //    return reviews.stream().map(reviewMapper::toListingResponse).toList();
  //  }
}
