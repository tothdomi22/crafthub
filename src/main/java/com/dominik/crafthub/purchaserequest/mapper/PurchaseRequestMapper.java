package com.dominik.crafthub.purchaserequest.mapper;

import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.listing.mapper.ListingMapper;
import com.dominik.crafthub.purchaserequest.dto.PurchaseRequestDto;
import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestEntity;
import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestStatusEnum;
import com.dominik.crafthub.user.entity.UserEntity;
import com.dominik.crafthub.user.mapper.UserMapper;
import java.time.OffsetDateTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {ListingMapper.class, UserMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PurchaseRequestMapper {
  @Mapping(target = "requesterUser.id", source = "user.id")
  @Mapping(target = "listing.id", source = "listing.id")
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "status", source = "status")
  @Mapping(target = "createdAt", source = "createdAt")
  PurchaseRequestEntity toEntity(
      ListingEntity listing,
      UserEntity user,
      PurchaseRequestStatusEnum status,
      OffsetDateTime createdAt);

  @Mapping(target = "user", source = "requesterUser")
  PurchaseRequestDto toDto(PurchaseRequestEntity purchaseRequest);
}
