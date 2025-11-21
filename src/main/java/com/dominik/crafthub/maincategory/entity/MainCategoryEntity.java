package com.dominik.crafthub.maincategory.entity;

import com.dominik.crafthub.subcategory.entity.SubCategoryEntity;
import jakarta.persistence.*;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "main_category")
public class MainCategoryEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Integer id;

  @Column(name = "unique_name")
  private String uniqueName;

  @Column(name = "display_name")
  private String displayName;

  @Column(name = "description")
  private String description;

  @OneToMany(mappedBy = "mainCategoryEntity")
  private Set<SubCategoryEntity> subCategories = new LinkedHashSet<>();
}
