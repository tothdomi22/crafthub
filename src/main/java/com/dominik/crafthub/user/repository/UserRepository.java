package com.dominik.crafthub.user.repository;

import com.dominik.crafthub.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
  Object findByEmail(String email);

  Boolean existsByEmail(String email);
}
