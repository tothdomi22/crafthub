package com.dominik.crafthub.subcategory.repository;

import com.dominik.crafthub.subcategory.entity.SubCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubCategoryRepository extends JpaRepository<SubCategoryEntity, Integer> {
}
