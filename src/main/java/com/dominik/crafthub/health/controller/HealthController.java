package com.dominik.crafthub.health.controller;

import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/health")
public class HealthController {
  @GetMapping("/alive")
  public ResponseEntity<?> alive() {
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "ok"));
  }
}
