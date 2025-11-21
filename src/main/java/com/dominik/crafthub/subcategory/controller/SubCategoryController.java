package com.dominik.crafthub.subcategory.controller;

import com.dominik.crafthub.maincategory.exceptions.MainCategoryNotFoundException;
import com.dominik.crafthub.subcategory.SubCategoryAlreadyExistsException;
import com.dominik.crafthub.subcategory.dto.SubCategoryCreateRequest;
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
}
