package com.dominik.crafthub.review.mapper;

import com.dominik.crafthub.listing.controller.ListingMapper;
import com.dominik.crafthub.review.dto.ReviewCreateRequest;
import com.dominik.crafthub.review.dto.ReviewDto;
import com.dominik.crafthub.review.dto.ReviewListingResponse;
import com.dominik.crafthub.review.entity.ReviewEntity;
import com.dominik.crafthub.user.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {ListingMapper.class, UserDto.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReviewMapper {
  ReviewEntity toEntity(ReviewCreateRequest request);

  ReviewDto toDto(ReviewEntity reviewEntity);

  @Mapping(source = "reviewerUserEntity", target = "reviewerUser")
  @Mapping(source = "listingEntity", target = "listing")
  ReviewListingResponse toListingResponse(ReviewEntity reviewEntity);
}
