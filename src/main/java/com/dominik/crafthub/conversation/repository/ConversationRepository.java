package com.dominik.crafthub.conversation.repository;

import com.dominik.crafthub.conversation.entity.ConversationEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConversationRepository extends JpaRepository<ConversationEntity, Long> {
  Boolean existsByUserEntity1_IdAndListingEntity_Id(Long userEntity1Id, Long listingEntityId);

  @EntityGraph(attributePaths = {"listingEntity"})
  List<ConversationEntity> findAllByUserEntity1_IdOrUserEntity2_Id(
      Long userEntity1Id, Long userEntity2Id, Sort updatedAt);

  @Query(
      value =
          """
            SELECT c
            FROM ConversationEntity c
            LEFT JOIN FETCH c.userEntity1 u1
            LEFT JOIN FETCH c.userEntity2 u2
            LEFT JOIN FETCH c.listingEntity l
            WHERE c.id = :conversationId
            """)
  Optional<ConversationEntity> getConversationById(@Param("conversationId") Long conversationId);
}
