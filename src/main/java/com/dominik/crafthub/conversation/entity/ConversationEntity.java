package com.dominik.crafthub.conversation.entity;

import com.dominik.crafthub.message.entity.MessageEntity;
import com.dominik.crafthub.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "conversation")
public class ConversationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user1_id")
    private UserEntity userEntity1;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user2_id")
    private UserEntity userEntity2;

    @Column(name = "listing_id")
    private Long listingId;

    @OneToMany(mappedBy = "conversationEntity")
    private Set<MessageEntity> messageEntities = new LinkedHashSet<>();

}