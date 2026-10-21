package com.vanseva.repository;

import com.vanseva.entity.PlantationGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlantationGalleryRepository extends JpaRepository<PlantationGallery, Long> {
    List<PlantationGallery> findByIsApprovedPublicTrueOrderByCreatedAtDesc();
    List<PlantationGallery> findAllByOrderByCreatedAtDesc();
    List<PlantationGallery> findByCampaignIdAndIsApprovedPublicTrueOrderByCreatedAtDesc(Long campaignId);
    List<PlantationGallery> findByUploadedByUserIdOrderByCreatedAtDesc(Long userId);
    long countByIsApprovedPublicTrue();
}
