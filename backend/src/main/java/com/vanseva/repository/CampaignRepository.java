package com.vanseva.repository;

import com.vanseva.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    Optional<Campaign> findBySlug(String slug);
    List<Campaign> findByStatusOrderByCreatedAtDesc(String status);
    List<Campaign> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
