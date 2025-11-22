package com.dominik.crafthub.subcategory.mapper;

import com.dominik.crafthub.maincategory.mapper.MainCategoryMapper;
import com.dominik.crafthub.subcategory.dto.SubCategoryCreateRequest;
import com.dominik.crafthub.subcategory.dto.SubCategoryDto;
import com.dominik.crafthub.subcategory.dto.SubCategoryUpdateRequest;
import com.dominik.crafthub.subcategory.entity.SubCategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    uses = {MainCategoryMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface SubCategoryMapper {
  @Mapping(source = "mainCategoryId", target = "mainCategoryEntity.id")
  SubCategoryEntity toEntity(SubCategoryCreateRequest request);

  @Mapping(source = "mainCategoryEntity", target = "mainCategory")
  SubCategoryDto toDto(SubCategoryEntity subCategoryEntity);

  @Mapping(source = "mainCategoryId", target = "mainCategoryEntity.id")
  void update(SubCategoryUpdateRequest request, @MappingTarget SubCategoryEntity subCategoryEntity);
}
