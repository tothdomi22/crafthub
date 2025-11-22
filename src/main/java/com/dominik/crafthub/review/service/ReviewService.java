package com.dominik.crafthub.review.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.listing.service.ListingService;
import com.dominik.crafthub.review.dto.ReviewCreateRequest;
import com.dominik.crafthub.review.dto.ReviewDto;
import com.dominik.crafthub.review.dto.ReviewListingResponse;
import com.dominik.crafthub.review.exception.CantReviewYourOwnListingException;
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

  public ReviewDto createReview(Long listingId, ReviewCreateRequest request) {
    var user = authService.getCurrentUser();
    var reviewExists = reviewRepository.existsByListingEntity_Id(listingId);
    if (reviewExists) {
      throw new ReviewAlreadyExistsException();
    }
    var listing = listingService.findListingById(listingId);
    if (listing.getUserEntity().getId().equals(user.getId())) {
      throw new CantReviewYourOwnListingException();
    }
    var review = reviewMapper.toEntity(request);
    review.setReviewerUserEntity(user);
    review.setListingEntity(listing);
    review.setCreatedAt(OffsetDateTime.now());
    reviewRepository.save(review);
    return reviewMapper.toDto(review);
  }

  public List<ReviewListingResponse> listReviewsByUser(Long userId) {
    var reviews = reviewRepository.findAllByListingEntity_UserEntity_Id(userId);
    return reviews.stream().map(reviewMapper::toListingResponse).toList();
  }
}
