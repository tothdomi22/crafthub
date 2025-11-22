package com.dominik.crafthub.review.entity;

import com.dominik.crafthub.listing.entity.ListingEntity;
import com.dominik.crafthub.user.entity.UserEntity;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "review")
public class ReviewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ColumnDefault("1")
    @Column(name = "stars")
    private Short stars;

    @Column(name = "review_text")
    private String reviewText;
    
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id")
    private ListingEntity listingEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_user_id")
    private UserEntity reviewerUserEntity;

}