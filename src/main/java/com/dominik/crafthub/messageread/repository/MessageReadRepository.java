package com.dominik.crafthub.messageread.repository;

import com.dominik.crafthub.messageread.entity.MessageReadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageReadRepository extends JpaRepository<MessageReadEntity, Long> {

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query(
      value =
          """
            UPDATE MessageReadEntity mr
            SET mr.readAt = CURRENT_TIMESTAMP
            WHERE mr.userEntity.id = :userId
                AND mr.readAt IS NULL
                AND mr.messageEntity.conversationEntity.id = :conversationId
                AND mr.messageEntity.sender.id <> :userId
            """)
  void markConversationAsRead(
      @Param("conversationId") Long conversationId, @Param("userId") Long userId);

  @Query(
      value =
          """
            SELECT CASE WHEN COUNT(mr) > 0 THEN true ELSE false END
            FROM MessageReadEntity mr
            WHERE (mr.userEntity.id = :userId AND mr.readAt IS null)
        """)
  Boolean doesUnreadExists(@Param("userId") Long userId);
}
