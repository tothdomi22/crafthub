package com.dominik.crafthub.city.controller;

import com.dominik.crafthub.city.service.CityService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/city/list")
public class CityController {
  private final CityService cityService;

  @GetMapping
  public ResponseEntity<?> getCities() {
    var cityDtos = cityService.getCities();
    return ResponseEntity.status(HttpStatus.OK).body(cityDtos);
  }
}
