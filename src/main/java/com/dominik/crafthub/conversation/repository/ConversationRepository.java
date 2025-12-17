package com.dominik.crafthub.conversation.repository;

import com.dominik.crafthub.conversation.dto.ConversationWithLastMessageDto;
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
        SELECT new com.dominik.crafthub.conversation.dto.ConversationWithLastMessageDto(
        new com.dominik.crafthub.conversation.dto.ConversationDto(
            c.id,
            new com.dominik.crafthub.user.dto.UserDto(
                u1.id,
                u1.name,
                u1.email,
                u1.role,
                u1.createdAt
            ),
            new com.dominik.crafthub.user.dto.UserDto(
                u2.id,
                u2.name,
                u2.email,
                u2.role,
                u2.createdAt
            ),
            new com.dominik.crafthub.listing.dto.ListingReviewDto(
                l.id,
                l.name
            ),
            c.createdAt,
            c.updatedAt
        ),
        new com.dominik.crafthub.message.dto.MessageDto(
            m.id,
            m.textContent,
            new com.dominik.crafthub.user.dto.UserDto(
                u3.id,
                u3.name,
                u3.email,
                u3.role,
                u3.createdAt
            ),
            m.createdAt
        ),
        CASE WHEN mr.readAt IS NULL AND mr.userEntity.id = :userId THEN false ELSE true END
                )
        FROM ConversationEntity c
        LEFT JOIN MessageEntity m
                ON m.conversationEntity.id = c.id
                AND m.createdAt = (
                        SELECT MAX(m2.createdAt)
                         FROM MessageEntity m2
                         WHERE m2.conversationEntity.id = c.id
                )
        LEFT JOIN MessageReadEntity mr
                ON mr.messageEntity.id = m.id AND mr.userEntity.id = :userId
        LEFT JOIN UserEntity u1
                ON u1.id = c.userEntity1.id
        LEFT JOIN UserEntity u2
                ON u2.id = c.userEntity2.id
        LEFT JOIN ListingEntity l
                ON l.id = c.listingEntity.id
        LEFT JOIN UserEntity u3
                ON u3.id = m.sender.id
        WHERE (c.userEntity2.id = :userId OR c.userEntity1.id = :userId)
        ORDER BY c.updatedAt DESC
        """)
  List<ConversationWithLastMessageDto> findAllConversationsWithLastMessage(
      @Param("userId") Long userId);

  @Query(
      value =
          """
            SELECT c
            FROM ConversationEntity c
            LEFT JOIN FETCH c.userEntity1 u1
            LEFT JOIN FETCH c.userEntity2 u2
            LEFT JOIN FETCH c.listingEntity l
            LEFT JOIN FETCH l.cityEntity ct
            WHERE c.id = :conversationId
            """)
  Optional<ConversationEntity> getConversationById(@Param("conversationId") Long conversationId);
}
