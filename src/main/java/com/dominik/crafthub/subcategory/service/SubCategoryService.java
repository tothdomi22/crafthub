package com.dominik.crafthub.subcategory.service;

import com.dominik.crafthub.maincategory.entity.MainCategoryEntity;
import com.dominik.crafthub.maincategory.exceptions.MainCategoryNotFoundException;
import com.dominik.crafthub.maincategory.repository.MainCategoryRepository;
import com.dominik.crafthub.subcategory.dto.SubCategoryCreateRequest;
import com.dominik.crafthub.subcategory.dto.SubCategoryDto;
import com.dominik.crafthub.subcategory.dto.SubCategoryUpdateRequest;
import com.dominik.crafthub.subcategory.entity.SubCategoryEntity;
import com.dominik.crafthub.subcategory.exception.SubCategoryAlreadyExistsException;
import com.dominik.crafthub.subcategory.exception.SubCategoryNotFoundException;
import com.dominik.crafthub.subcategory.mapper.SubCategoryMapper;
import com.dominik.crafthub.subcategory.repository.SubCategoryRepository;
import java.util.List;
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

  public SubCategoryDto createSubCategory(SubCategoryCreateRequest request) {
    var uniqueName = normalizeUniqueName(request.uniqueName());
    checkIfUniqueNameExists(uniqueName);
    var mainCategory = findMainCategoryById(request.mainCategoryId());
    var subCategory = subCategoryMapper.toEntity(request);

    subCategory.setUniqueName(uniqueName);
    subCategory.setMainCategoryEntity(mainCategory);
    subCategoryRepository.save(subCategory);
    return subCategoryMapper.toDto(subCategory);
  }

  public SubCategoryDto getSubCategory(Integer id) {
    var subCategory = findSubCategoryById(id);
    return subCategoryMapper.toDto(subCategory);
  }

  public List<SubCategoryDto> listMainCategories() {
    var subCategories = subCategoryRepository.findAll();
    return subCategories.stream().map(subCategoryMapper::toDto).toList();
  }

  public SubCategoryDto updateSubCategory(Integer id, SubCategoryUpdateRequest request) {
    var subCategory = findSubCategoryById(id);
    System.out.println(request.mainCategoryId());
    if (request.mainCategoryId() != null) {
      System.out.println("finding maincategory");
      var mainCategory = findMainCategoryById(request.mainCategoryId());
      System.out.println(mainCategory);
      subCategory.setMainCategoryEntity(mainCategory);
    }
    if (request.uniqueName() != null) {
      var uniqueName = normalizeUniqueName(request.uniqueName());
      checkIfUniqueNameExists(uniqueName);
    }
    subCategoryMapper.update(request, subCategory);
    subCategoryRepository.save(subCategory);
    return subCategoryMapper.toDto(subCategory);
  }

  public void deleteSubCategory(Integer id) {
    var subCategory = findSubCategoryById(id);
    subCategoryRepository.delete(subCategory);
  }

  private SubCategoryEntity findSubCategoryById(Integer id) {
    var subCategory = subCategoryRepository.findById(id).orElse(null);
    if (subCategory == null) {
      throw new SubCategoryNotFoundException();
    }
    return subCategory;
  }

  private MainCategoryEntity findMainCategoryById(Integer id) {
    var mainCategory = mainCategoryRepository.findById(id).orElse(null);
    if (mainCategory == null) {
      throw new MainCategoryNotFoundException();
    }
    return mainCategory;
  }

  private void checkIfUniqueNameExists(String normalizedUniqueName) {
    var subCategoryExists = subCategoryRepository.existsByUniqueName(normalizedUniqueName);
    if (subCategoryExists) {
      throw new SubCategoryAlreadyExistsException();
    }
  }
}
