package com.dominik.crafthub.maincategory.controller;

import com.dominik.crafthub.maincategory.dto.MainCategoryCreateRequest;
import com.dominik.crafthub.maincategory.exceptions.MainCategoryAlreadyExistsException;
import com.dominik.crafthub.maincategory.mapper.MainCategoryMapper;
import com.dominik.crafthub.maincategory.repository.MainCategoryRepository;
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
public class MainCategoryController {
  private final MainCategoryRepository mainCategoryRepository;
  private final MainCategoryMapper mainCategoryMapper;
  private final MainCategoryService mainCategoryService;

  @PostMapping
  public ResponseEntity<?> createMainCategory(
      @Valid @RequestBody MainCategoryCreateRequest request) {
    var mainCategoryDto = mainCategoryService.createMainCategory(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(mainCategoryDto);
  }

  @ExceptionHandler(MainCategoryAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> mainCategoryAlreadyExists() {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("message:", "Main category already exists"));
  }
}
