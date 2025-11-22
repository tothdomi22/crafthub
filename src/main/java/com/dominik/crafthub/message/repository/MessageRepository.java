package com.dominik.crafthub.message.repository;

import com.dominik.crafthub.message.entity.MessageEntity;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
  List<MessageEntity> findAllByConversationEntity_Id(Long conversationEntityId, Sort createdAt);
}
