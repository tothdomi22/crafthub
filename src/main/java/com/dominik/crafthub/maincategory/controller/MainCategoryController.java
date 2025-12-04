package com.dominik.crafthub.maincategory.controller;

import com.dominik.crafthub.maincategory.dto.MainCategoryDto;
import com.dominik.crafthub.maincategory.exceptions.MainCategoryNotFoundException;
import com.dominik.crafthub.maincategory.service.MainCategoryService;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/main-category")
public class MainCategoryController {
  private final MainCategoryService mainCategoryService;

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

  @ExceptionHandler(MainCategoryNotFoundException.class)
  public ResponseEntity<Map<String, String>> mainCategoryNotFound() {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message:", "Main category not found"));
  }
}
