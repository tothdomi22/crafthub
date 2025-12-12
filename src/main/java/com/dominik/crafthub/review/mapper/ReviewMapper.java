package com.dominik.crafthub.review.mapper;

import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.listing.mapper.ListingMapper;
import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestEntity;
import com.dominik.crafthub.review.dto.ReviewCreateRequest;
import com.dominik.crafthub.review.dto.ReviewDto;
import com.dominik.crafthub.review.entity.ReviewEntity;
import com.dominik.crafthub.review.entity.ReviewTypeEnum;
import com.dominik.crafthub.user.dto.UserDto;
import com.dominik.crafthub.user.entity.UserEntity;
import java.time.OffsetDateTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {ListingMapper.class, UserDto.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReviewMapper {

  @Mapping(target = "reviewerUserEntity", source = "reviewerEntity")
  @Mapping(target = "purchaseRequestEntity", source = "purchaseRequestEntity")
  @Mapping(target = "createdAt", source = "createdAt")
  @Mapping(target = "reviewType", source = "reviewType")
  @Mapping(target = "id", ignore = true)
  ReviewEntity toEntity(
      ReviewCreateRequest request,
      UserEntity reviewerEntity,
      ListingEntity listingEntity,
      OffsetDateTime createdAt,
      ReviewTypeEnum reviewType,
      PurchaseRequestEntity purchaseRequestEntity);

  ReviewDto toDto(ReviewEntity reviewEntity);

//  @Mapping(source = "reviewerUserEntity", target = "reviewerUser")
//  ReviewListingResponse toListingResponse(ReviewEntity reviewEntity);
}
