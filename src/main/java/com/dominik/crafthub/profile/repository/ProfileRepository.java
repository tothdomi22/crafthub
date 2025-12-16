package com.dominik.crafthub.profile.repository;

import com.dominik.crafthub.profile.entity.ProfileEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {
  Boolean existsByUserEntity_Id(Long userEntityId);

  @Query(
      value =
          """
            SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END
            FROM ProfileEntity p
            WHERE (p.userEntity.id = :userId AND (p.birthDate IS NOT NULL or p.cityEntity IS NOT NULL))
            """)
  Boolean isProfileAlreadyFilled(@Param("userId") Long userId);

  @Query(
      value =
          """
        SELECT p
        FROM ProfileEntity p
        LEFT JOIN FETCH p.userEntity u
        LEFT JOIN FETCH p.cityEntity c
        WHERE p.userEntity.id = :userId
        """)
  Optional<ProfileEntity> findProfileByUserId(@Param("userId") Long userId);
}
