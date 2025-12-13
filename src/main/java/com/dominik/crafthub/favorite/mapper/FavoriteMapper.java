package com.dominik.crafthub.favorite.mapper;

import com.dominik.crafthub.favorite.dto.FavoriteDto;
import com.dominik.crafthub.favorite.entity.FavoriteEntity;
import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.listing.mapper.ListingMapper;
import com.dominik.crafthub.user.entity.UserEntity;
import com.dominik.crafthub.user.mapper.UserMapper;
import java.time.OffsetDateTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    uses = {UserMapper.class, ListingMapper.class})
public interface FavoriteMapper {
  @Mapping(target = "listingEntity", source = "listing")
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "userEntity", source = "user")
  @Mapping(target = "createdAt", source = "createdAt")
  FavoriteEntity toEntity(UserEntity user, ListingEntity listing, OffsetDateTime createdAt);

  @Mapping(target = "user", source = "userEntity")
  @Mapping(target = "listing", source = "listingEntity")
  FavoriteDto toDto(FavoriteEntity favorite);

  @Mapping(target = "user", source = "userEntity")
  @Mapping(target = "listing", source = "listingEntity")
  FavoriteDto toListDto(FavoriteEntity favorite);
}
