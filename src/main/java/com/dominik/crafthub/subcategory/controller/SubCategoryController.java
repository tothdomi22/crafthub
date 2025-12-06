package com.dominik.crafthub.subcategory.controller;

import com.dominik.crafthub.maincategory.exceptions.MainCategoryNotFoundException;
import com.dominik.crafthub.subcategory.exception.SubCategoryNotFoundException;
import com.dominik.crafthub.subcategory.service.SubCategoryService;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/sub-category")
public class SubCategoryController {
  private final SubCategoryService subCategoryService;

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
