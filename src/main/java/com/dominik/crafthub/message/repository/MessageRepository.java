package com.dominik.crafthub.message.repository;

import com.dominik.crafthub.message.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
}
