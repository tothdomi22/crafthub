package com.dominik.crafthub.review.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.listing.service.ListingService;
import com.dominik.crafthub.review.dto.ReviewCreateRequest;
import com.dominik.crafthub.review.dto.ReviewDto;
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

  public ReviewDto createReview(Long listingId, ReviewCreateRequest request) {
    var user = authService.getCurrentUser();
    var listing = listingService.findListingById(listingId);
    var review = reviewMapper.toEntity(request);
    review.setReviewerUserEntity(user);
    review.setListingEntity(listing);
    review.setCreatedAt(OffsetDateTime.now());
    System.out.println(request.stars());
    System.out.println(review.getStars());
    reviewRepository.save(review);
    return reviewMapper.toDto(review);
  }
}
