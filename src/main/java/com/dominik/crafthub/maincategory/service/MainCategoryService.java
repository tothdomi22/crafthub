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

  private static String normalizeUniqueName(String uniqueName) {
    return uniqueName.toLowerCase().replace(" ", "_");
  }

  public MainCategoryDto createMainCategory(MainCategoryCreateRequest request) {
    var uniqueName = normalizeUniqueName(request.uniqueName());
    checkIfUniqueNameExists(uniqueName);
    var mainCategory = mainCategoryMapper.toEntity(request);
    mainCategory.setUniqueName(uniqueName);
    mainCategoryRepository.save(mainCategory);
    return mainCategoryMapper.toDto(mainCategory);
  }

  private void checkIfUniqueNameExists(String normalizedUniqueName) {
    var mainCategoryExists = mainCategoryRepository.existsByUniqueName(normalizedUniqueName);
    if (mainCategoryExists) {
      throw new MainCategoryAlreadyExistsException();
    }
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
    var uniqueName = normalizeUniqueName(request.uniqueName());
    checkIfUniqueNameExists(uniqueName);
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
