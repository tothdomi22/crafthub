package com.dominik.crafthub.subcategory.controller;

import com.dominik.crafthub.maincategory.exceptions.MainCategoryNotFoundException;
import com.dominik.crafthub.subcategory.dto.SubCategoryCreateRequest;
import com.dominik.crafthub.subcategory.dto.SubCategoryUpdateRequest;
import com.dominik.crafthub.subcategory.exception.SubCategoryAlreadyExistsException;
import com.dominik.crafthub.subcategory.exception.SubCategoryNotFoundException;
import com.dominik.crafthub.subcategory.service.SubCategoryService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/admin/sub-category")
public class SubCategoryController {
  private final SubCategoryService subCategoryService;

  @PostMapping
  public ResponseEntity<?> createSubCategory(@Valid @RequestBody SubCategoryCreateRequest request) {
    var subCategoryDto = subCategoryService.createSubCategory(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(subCategoryDto);
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getSubCategory(@PathVariable Integer id) {
    var subCategoryDto = subCategoryService.getSubCategory(id);
    return ResponseEntity.status(HttpStatus.OK).body(subCategoryDto);
  }

  @GetMapping("/list")
  public ResponseEntity<?> listSubCategories() {
    var subCategories = subCategoryService.listMainCategories();
    return ResponseEntity.status(HttpStatus.OK).body(subCategories);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateSubCategory(
      @PathVariable Integer id, @RequestBody SubCategoryUpdateRequest request) {
    var subCategoryDto = subCategoryService.updateSubCategory(id, request);
    return ResponseEntity.status(HttpStatus.OK).body(subCategoryDto);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteSubCategory(@PathVariable Integer id) {
    subCategoryService.deleteSubCategory(id);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  @ExceptionHandler(SubCategoryAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> subCategoryAlreadyExists() {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("message:", "Subcategory already exists"));
  }

  @ExceptionHandler(MainCategoryNotFoundException.class)
  public ResponseEntity<Map<String, String>> mainCategoryNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message:", "Main category not found"));
  }

  @ExceptionHandler(SubCategoryNotFoundException.class)
  public ResponseEntity<Map<String, String>> subCategoryNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message:", "Sub category not found"));
  }
}
