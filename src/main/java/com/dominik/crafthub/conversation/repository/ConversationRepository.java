package com.dominik.crafthub.conversation.repository;

import com.dominik.crafthub.conversation.entity.ConversationEntity;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversationRepository extends JpaRepository<ConversationEntity, Long> {
  Boolean existsByUserEntity1_IdAndListingEntity_Id(Long userEntity1Id, Long listingEntityId);

  Boolean existsByUserEntity1_IdOrUserEntity2_Id(Long userEntity1Id, Long userEntity2Id);

  List<ConversationEntity> findAllByUserEntity1_IdOrUserEntity2_Id(
      Long userEntity1Id, Long userEntity2Id, Sort updatedAt);
}
