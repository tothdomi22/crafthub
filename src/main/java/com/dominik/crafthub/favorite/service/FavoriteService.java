package com.dominik.crafthub.favorite.service;

import com.dominik.crafthub.auth.service.AuthService;
import com.dominik.crafthub.favorite.dto.FavoriteDto;
import com.dominik.crafthub.favorite.exception.FavoriteExistsException;
import com.dominik.crafthub.favorite.exception.FavoriteNotFoundException;
import com.dominik.crafthub.favorite.mapper.FavoriteMapper;
import com.dominik.crafthub.favorite.repository.FavoriteRepository;
import com.dominik.crafthub.listing.exception.ListingNotFoundException;
import com.dominik.crafthub.listing.repository.ListingRepository;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class FavoriteService {
  private final AuthService authService;
  private final ListingRepository listingRepository;
  private final FavoriteRepository favoriteRepository;
  private final FavoriteMapper favoriteMapper;

  public FavoriteDto createFavorite(Long listingId) {
    var user = authService.getCurrentUser();
    var listing = listingRepository.findById(listingId).orElse(null);
    if (listing == null) {
      throw new ListingNotFoundException();
    }
    var favoriteExists =
        favoriteRepository.existsByListingEntity_IdAndUserEntity_Id(listingId, user.getId());
    if (favoriteExists) {
      throw new FavoriteExistsException();
    }
    var favoriteEntity = favoriteMapper.toEntity(user, listing, OffsetDateTime.now());
    favoriteRepository.save(favoriteEntity);
    return favoriteMapper.toDto(favoriteEntity);
  }

  public void deleteFavorite(Long listingId) {
    var user = authService.getCurrentUser();
    var listing = listingRepository.findById(listingId).orElse(null);
    if (listing == null) {
      throw new ListingNotFoundException();
    }
    var favoriteEntity =
        favoriteRepository
            .findByListingEntity_IdAndUserEntity_Id(listingId, user.getId())
            .orElse(null);
    if (favoriteEntity == null) {
      throw new FavoriteNotFoundException();
    }
    favoriteRepository.delete(favoriteEntity);
  }
}
