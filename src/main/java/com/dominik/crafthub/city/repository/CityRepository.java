package com.dominik.crafthub.city.repository;

import com.dominik.crafthub.city.entity.CityEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<CityEntity, Short> {}
