package com.dominik.crafthub.listing.repository;

import com.dominik.crafthub.listing.entity.ListingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListingRepository extends JpaRepository<ListingEntity, Long> {
}
