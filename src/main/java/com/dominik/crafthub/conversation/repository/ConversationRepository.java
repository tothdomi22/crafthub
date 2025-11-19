package com.dominik.crafthub.conversation.repository;

import com.dominik.crafthub.conversation.entity.ConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversationRepository extends JpaRepository<ConversationEntity, Long> {
}
