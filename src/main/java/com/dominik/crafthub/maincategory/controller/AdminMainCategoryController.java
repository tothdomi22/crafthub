package com.dominik.crafthub.maincategory.controller;

import com.dominik.crafthub.maincategory.dto.MainCategoryCreateRequest;
import com.dominik.crafthub.maincategory.dto.MainCategoryUpdateRequest;
import com.dominik.crafthub.maincategory.exceptions.MainCategoryAlreadyExistsException;
import com.dominik.crafthub.maincategory.exceptions.MainCategoryNotFoundException;
import com.dominik.crafthub.maincategory.service.MainCategoryService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/admin/main-category")
public class AdminMainCategoryController {
  private final MainCategoryService mainCategoryService;

  @PostMapping
  public ResponseEntity<?> createMainCategory(
      @Valid @RequestBody MainCategoryCreateRequest request) {
    var mainCategoryDto = mainCategoryService.createMainCategory(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(mainCategoryDto);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateMainCategory(
      @PathVariable Integer id, @Valid @RequestBody MainCategoryUpdateRequest request) {
    var mainCategoryDto = mainCategoryService.updateMainCategory(id, request);
    return ResponseEntity.status(HttpStatus.OK).body(mainCategoryDto);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteMainCategory(@PathVariable Integer id) {
    mainCategoryService.deleteMainCategory(id);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  @ExceptionHandler(MainCategoryAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> mainCategoryAlreadyExists() {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("message:", "Main category already exists"));
  }

  @ExceptionHandler(MainCategoryNotFoundException.class)
  public ResponseEntity<Map<String, String>> mainCategoryNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message:", "Main category not found"));
  }
}
