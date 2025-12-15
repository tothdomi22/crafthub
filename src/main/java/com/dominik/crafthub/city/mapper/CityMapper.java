package com.dominik.crafthub.city.mapper;

import com.dominik.crafthub.city.dto.CityDto;
import com.dominik.crafthub.city.entity.CityEntity;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CityMapper {
  CityDto toDto(CityEntity cityEntity);
}
