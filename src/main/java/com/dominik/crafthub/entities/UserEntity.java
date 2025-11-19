package com.dominik.crafthub.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "\"user\"")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role;

    @OneToMany(mappedBy = "userEntity1")
    private Set<ConversationEntity> conversationsOne = new LinkedHashSet<>();

    @OneToMany(mappedBy = "userEntity2")
    private Set<ConversationEntity> conversationsTwo = new LinkedHashSet<>();

    @OneToMany(mappedBy = "userEntity")
    private Set<ListingEntity> listingEntities = new LinkedHashSet<>();

    @OneToMany(mappedBy = "sender")
    private Set<MessageEntity> messageEntities = new LinkedHashSet<>();

    @OneToOne(mappedBy = "userEntity")
    private ProfileEntity profiles;

    @OneToMany(mappedBy = "reviewerUserEntity")
    private Set<ReviewEntity> reviews = new LinkedHashSet<>();

}