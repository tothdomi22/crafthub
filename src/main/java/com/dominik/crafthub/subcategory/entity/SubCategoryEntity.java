package com.dominik.crafthub.subcategory.entity;

import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.maincategory.entity.MainCategoryEntity;
import jakarta.persistence.*;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sub_category")
public class SubCategoryEntity {
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

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "main_category_id")
  private MainCategoryEntity mainCategoryEntity;

  @OneToMany(mappedBy = "subCategoryEntity")
  private Set<ListingEntity> listingEntities = new LinkedHashSet<>();
}
