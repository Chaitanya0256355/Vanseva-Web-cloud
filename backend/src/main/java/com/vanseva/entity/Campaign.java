package com.vanseva.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaigns")
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, unique = true, length = 150)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 150)
    private String location;

    @Column(name = "target_plants", nullable = false)
    private Integer targetPlants = 5000;

    @Column(name = "planted_plants", nullable = false)
    private Integer plantedPlants = 0; // Verified planted

    @Column(name = "pledged_plants", nullable = false)
    private Integer pledgedPlants = 0; // Pledged / sponsored

    @Column(name = "target_donation", precision = 12, scale = 2)
    private BigDecimal targetDonation = new BigDecimal("750000.00");

    @Column(name = "collected_donation", precision = 12, scale = 2)
    private BigDecimal collectedDonation = BigDecimal.ZERO;

    @Column(name = "plant_unit_price", precision = 8, scale = 2, nullable = false)
    private BigDecimal plantUnitPrice = new BigDecimal("150.00"); // Cost per sapling

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, UPCOMING

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cover_image_file_id")
    private StoredFile coverImageFile;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Campaign() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getTargetPlants() { return targetPlants; }
    public void setTargetPlants(Integer targetPlants) { this.targetPlants = targetPlants; }

    public Integer getPlantedPlants() { return plantedPlants; }
    public void setPlantedPlants(Integer plantedPlants) { this.plantedPlants = plantedPlants; }

    public Integer getPledgedPlants() { return pledgedPlants; }
    public void setPledgedPlants(Integer pledgedPlants) { this.pledgedPlants = pledgedPlants; }

    public BigDecimal getTargetDonation() { return targetDonation; }
    public void setTargetDonation(BigDecimal targetDonation) { this.targetDonation = targetDonation; }

    public BigDecimal getCollectedDonation() { return collectedDonation; }
    public void setCollectedDonation(BigDecimal collectedDonation) { this.collectedDonation = collectedDonation; }

    public BigDecimal getPlantUnitPrice() { return plantUnitPrice; }
    public void setPlantUnitPrice(BigDecimal plantUnitPrice) { this.plantUnitPrice = plantUnitPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public StoredFile getCoverImageFile() { return coverImageFile; }
    public void setCoverImageFile(StoredFile coverImageFile) { this.coverImageFile = coverImageFile; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
