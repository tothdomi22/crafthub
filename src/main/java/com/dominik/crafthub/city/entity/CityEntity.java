package com.dominik.crafthub.city.entity;

import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.profile.entity.ProfileEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "city")
public class CityEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Short id;

  @Size(max = 50)
  @NotNull
  @Column(name = "name", nullable = false, length = 50)
  private String name;

  @OneToMany(mappedBy = "cityEntity")
  private Set<ListingEntity> listings = new LinkedHashSet<>();

  @OneToMany(mappedBy = "cityEntity")
  private Set<ProfileEntity> profiles = new LinkedHashSet<>();
}
