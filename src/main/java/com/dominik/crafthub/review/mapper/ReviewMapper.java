package com.dominik.crafthub.review.mapper;

import com.dominik.crafthub.review.dto.ReviewCreateRequest;
import com.dominik.crafthub.review.dto.ReviewDto;
import com.dominik.crafthub.review.entity.ReviewEntity;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReviewMapper {
  ReviewEntity toEntity(ReviewCreateRequest request);

  ReviewDto toDto(ReviewEntity reviewEntity);
}
