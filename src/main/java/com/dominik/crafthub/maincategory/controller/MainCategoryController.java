package com.dominik.crafthub.maincategory.controller;

import com.dominik.crafthub.maincategory.dto.MainCategoryCreateRequest;
import com.dominik.crafthub.maincategory.dto.MainCategoryDto;
import com.dominik.crafthub.maincategory.dto.MainCategoryUpdateRequest;
import com.dominik.crafthub.maincategory.exceptions.MainCategoryAlreadyExistsException;
import com.dominik.crafthub.maincategory.exceptions.MainCategoryNotFoundException;
import com.dominik.crafthub.maincategory.service.MainCategoryService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/admin/main-category")
public class MainCategoryController {
  private final MainCategoryService mainCategoryService;

  @PostMapping
  public ResponseEntity<?> createMainCategory(
      @Valid @RequestBody MainCategoryCreateRequest request) {
    var mainCategoryDto = mainCategoryService.createMainCategory(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(mainCategoryDto);
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getMainCategory(@PathVariable Integer id) {
    var mainCategoryDto = mainCategoryService.getMainCategory(id);
    return ResponseEntity.status(HttpStatus.OK).body(mainCategoryDto);
  }

  @GetMapping("/list")
  public ResponseEntity<?> listMainCategories() {
    List<MainCategoryDto> mainCategoryDtoList = mainCategoryService.listMainCategories();
    return ResponseEntity.status(HttpStatus.OK).body(mainCategoryDtoList);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateMainCategory(
      @PathVariable Integer id, @Valid @RequestBody MainCategoryUpdateRequest request) {
    var mainCategoryDto = mainCategoryService.updateMainCategory(id, request);
    return ResponseEntity.status(HttpStatus.OK).body(mainCategoryDto);
  }

  @ExceptionHandler(MainCategoryAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> mainCategoryAlreadyExists() {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("message:", "Main category already exists"));
  }

  @ExceptionHandler(MainCategoryNotFoundException.class)
  public ResponseEntity<Map<String, String>> mainCategoryNotFound() {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("message:", "Main category not found"));
  }
}
