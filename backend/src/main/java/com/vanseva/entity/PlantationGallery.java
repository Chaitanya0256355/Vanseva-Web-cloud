package com.vanseva.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "plantation_gallery")
public class PlantationGallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(length = 150)
    private String location;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "file_id", nullable = false)
    private StoredFile file;

    @Column(name = "plant_species", length = 100)
    private String plantSpecies;

    @Column(name = "date_planted")
    private LocalDate datePlanted;

    @Column(name = "is_approved_public", nullable = false)
    private Boolean isApprovedPublic = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uploaded_by_user_id")
    private User uploadedByUser;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public PlantationGallery() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isApprovedPublic == null) {
            this.isApprovedPublic = false;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Campaign getCampaign() { return campaign; }
    public void setCampaign(Campaign campaign) { this.campaign = campaign; }

    public StoredFile getFile() { return file; }
    public void setFile(StoredFile file) { this.file = file; }

    public String getPlantSpecies() { return plantSpecies; }
    public void setPlantSpecies(String plantSpecies) { this.plantSpecies = plantSpecies; }

    public LocalDate getDatePlanted() { return datePlanted; }
    public void setDatePlanted(LocalDate datePlanted) { this.datePlanted = datePlanted; }

    public Boolean getIsApprovedPublic() { return isApprovedPublic; }
    public void setIsApprovedPublic(Boolean isApprovedPublic) { this.isApprovedPublic = isApprovedPublic; }

    public User getUploadedByUser() { return uploadedByUser; }
    public void setUploadedByUser(User uploadedByUser) { this.uploadedByUser = uploadedByUser; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
