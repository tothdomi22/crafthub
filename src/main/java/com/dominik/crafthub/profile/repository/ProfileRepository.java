package com.dominik.crafthub.profile.repository;

import com.dominik.crafthub.profile.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {
  Boolean existsByUserEntity_Id(Long userEntityId);
}
