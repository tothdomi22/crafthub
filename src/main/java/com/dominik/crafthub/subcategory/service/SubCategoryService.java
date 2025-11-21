package com.dominik.crafthub.subcategory.service;

import com.dominik.crafthub.maincategory.exceptions.MainCategoryNotFoundException;
import com.dominik.crafthub.maincategory.repository.MainCategoryRepository;
import com.dominik.crafthub.subcategory.SubCategoryAlreadyExistsException;
import com.dominik.crafthub.subcategory.dto.SubCategoryCreateRequest;
import com.dominik.crafthub.subcategory.dto.SubCategoryDto;
import com.dominik.crafthub.subcategory.mapper.SubCategoryMapper;
import com.dominik.crafthub.subcategory.repository.SubCategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SubCategoryService {

  private final MainCategoryRepository mainCategoryRepository;
  private final SubCategoryRepository subCategoryRepository;
  private final SubCategoryMapper subCategoryMapper;

  private static String normalizeUniqueName(String uniqueName) {
    return uniqueName.toLowerCase().replace(" ", "_");
  }

  private void checkIfUniqueNameExists(String normalizedUniqueName) {
    var subCategoryExists = subCategoryRepository.existsByUniqueName(normalizedUniqueName);
    if (subCategoryExists) {
      throw new SubCategoryAlreadyExistsException();
    }
  }

  public SubCategoryDto createSubCategory(SubCategoryCreateRequest request) {
    var uniqueName = normalizeUniqueName(request.uniqueName());
    checkIfUniqueNameExists(uniqueName);
    var mainCategory = mainCategoryRepository.findById(request.mainCategoryId()).orElse(null);
    if (mainCategory == null) {
      throw new MainCategoryNotFoundException();
    }
    var subCategory = subCategoryMapper.toEntity(request);
    subCategory.setUniqueName(uniqueName);
    subCategoryRepository.save(subCategory);
    return subCategoryMapper.toDto(subCategory);
  }
}
