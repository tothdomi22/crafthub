package com.dominik.crafthub.maincategory.service;

import com.dominik.crafthub.maincategory.dto.MainCategoryCreateRequest;
import com.dominik.crafthub.maincategory.dto.MainCategoryDto;
import com.dominik.crafthub.maincategory.exceptions.MainCategoryAlreadyExistsException;
import com.dominik.crafthub.maincategory.mapper.MainCategoryMapper;
import com.dominik.crafthub.maincategory.repository.MainCategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class MainCategoryService {
  private MainCategoryMapper mainCategoryMapper;
  private MainCategoryRepository mainCategoryRepository;

    public MainCategoryDto createMainCategory(MainCategoryCreateRequest request) {
    var mainCategoryExists = mainCategoryRepository.existsByName(request.name().toLowerCase());
    if (mainCategoryExists) {
      throw new MainCategoryAlreadyExistsException();
    }
    var mainCategory = mainCategoryMapper.toEntity(request);
    mainCategory.setName(request.name().toLowerCase());
    mainCategoryRepository.save(mainCategory);
    return mainCategoryMapper.toDto(mainCategory);
  }
}
