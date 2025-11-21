package com.dominik.crafthub.maincategory.mapper;

import com.dominik.crafthub.maincategory.dto.MainCategoryDto;
import com.dominik.crafthub.maincategory.entity.MainCategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface MainCategoryMapper {
  MainCategoryDto toDto(MainCategoryEntity mainCategoryEntity);
}
