package com.dominik.crafthub.maincategory.service;

import com.dominik.crafthub.maincategory.dto.MainCategoryCreateRequest;
import com.dominik.crafthub.maincategory.dto.MainCategoryDto;
import com.dominik.crafthub.maincategory.dto.MainCategoryUpdateRequest;
import com.dominik.crafthub.maincategory.entity.MainCategoryEntity;
import com.dominik.crafthub.maincategory.exceptions.MainCategoryAlreadyExistsException;
import com.dominik.crafthub.maincategory.exceptions.MainCategoryNotFoundException;
import com.dominik.crafthub.maincategory.mapper.MainCategoryMapper;
import com.dominik.crafthub.maincategory.repository.MainCategoryRepository;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class MainCategoryService {
  private MainCategoryMapper mainCategoryMapper;
  private MainCategoryRepository mainCategoryRepository;

  public MainCategoryDto createMainCategory(MainCategoryCreateRequest request) {
    String normalizedUniqueName = request.uniqueName().toLowerCase().replace(" ", "_");
    var mainCategoryExists = mainCategoryRepository.existsByUniqueName(normalizedUniqueName);
    if (mainCategoryExists) {
      throw new MainCategoryAlreadyExistsException();
    }
    var mainCategory = mainCategoryMapper.toEntity(request);
    mainCategory.setUniqueName(normalizedUniqueName);
    mainCategoryRepository.save(mainCategory);
    return mainCategoryMapper.toDto(mainCategory);
  }

  public MainCategoryDto getMainCategory(Integer id) {
    var mainCategory = findMainCategoryById(id);
    return mainCategoryMapper.toDto(mainCategory);
  }

  public List<MainCategoryDto> listMainCategories() {
    var mainCategories = mainCategoryRepository.findAll();
    return mainCategories.stream().map(mainCategoryMapper::toDto).toList();
  }

  public MainCategoryDto updateMainCategory(Integer id, MainCategoryUpdateRequest request) {
    var mainCategory = findMainCategoryById(id);
    mainCategoryMapper.update(request, mainCategory);
    mainCategoryRepository.save(mainCategory);
    return mainCategoryMapper.toDto(mainCategory);
  }

  public void deleteMainCategory(Integer id) {
    var mainCategory = findMainCategoryById(id);
    mainCategoryRepository.delete(mainCategory);
  }

  private MainCategoryEntity findMainCategoryById(Integer id) {
    var mainCategory = mainCategoryRepository.findById(id).orElse(null);
    if (mainCategory == null) {
      throw new MainCategoryNotFoundException();
    }
    return mainCategory;
  }
}
