package com.dominik.crafthub.messageread.repository;

import com.dominik.crafthub.messageread.entity.MessageReadEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageReadRepository extends JpaRepository<MessageReadEntity, Long> {}
