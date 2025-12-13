package com.dominik.crafthub.favorite.controller;

import com.dominik.crafthub.favorite.exception.FavoriteExistsException;
import com.dominik.crafthub.favorite.exception.FavoriteNotFoundException;
import com.dominik.crafthub.favorite.service.FavoriteService;
import com.dominik.crafthub.listing.exception.ListingNotFoundException;
import com.dominik.crafthub.user.exceptions.UserNotFoundException;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favorite")
@AllArgsConstructor
public class FavoriteController {
  private final FavoriteService favoriteService;

  @PostMapping("/{listingId}")
  public ResponseEntity<?> createFavorite(@PathVariable Long listingId) {
    var favoriteDto = favoriteService.createFavorite(listingId);
    return ResponseEntity.status(HttpStatus.CREATED).body(favoriteDto);
  }

  @DeleteMapping("/{listingId}")
  public ResponseEntity<?> deleteFavorite(@PathVariable Long listingId) {
    favoriteService.deleteFavorite(listingId);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  @ExceptionHandler(ListingNotFoundException.class)
  public ResponseEntity<Map<String, String>> listingNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Listing not found"));
  }

  @ExceptionHandler(FavoriteExistsException.class)
  public ResponseEntity<Map<String, String>> favoriteExists() {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("message", "Favorite record already exists"));
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<Map<String, String>> userNotFoud() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
  }

  @ExceptionHandler(FavoriteNotFoundException.class)
  public ResponseEntity<Map<String, String>> favoriteNotFoud() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message", "Favorite record not found"));
  }
}
