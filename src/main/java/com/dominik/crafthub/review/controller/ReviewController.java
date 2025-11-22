package com.dominik.crafthub.review.controller;

import com.dominik.crafthub.review.dto.ReviewCreateRequest;
import com.dominik.crafthub.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/review")
@AllArgsConstructor
public class ReviewController {
  private ReviewService reviewService;

  @PostMapping("/{listingId}")
  public ResponseEntity<?> createReview(
      @PathVariable Long listingId, @Valid @RequestBody ReviewCreateRequest request) {
    var reviewDto = reviewService.createReview(listingId, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(reviewDto);
  }
}
