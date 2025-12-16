package com.dominik.crafthub.city.service;

import com.dominik.crafthub.city.dto.CityDto;
import com.dominik.crafthub.city.mapper.CityMapper;
import com.dominik.crafthub.city.repository.CityRepository;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CityService {
  private final CityRepository cityRepository;
  private final CityMapper cityMapper;

  public List<CityDto> getCities() {
    var cities = cityRepository.findAll();
    return cities.stream().map(cityMapper::toDto).toList();
  }
}
