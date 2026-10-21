package com.vanseva.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class GalleryDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private Long campaignId;
    private String campaignTitle;
    private Long fileId;
    private String imageUrl;
    private String plantSpecies;
    private LocalDate datePlanted;
    private Boolean isApprovedPublic;
    private String uploaderName;
    private LocalDateTime createdAt;

    public GalleryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }

    public String getCampaignTitle() { return campaignTitle; }
    public void setCampaignTitle(String campaignTitle) { this.campaignTitle = campaignTitle; }

    public Long getFileId() { return fileId; }
    public void setFileId(Long fileId) { this.fileId = fileId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getPlantSpecies() { return plantSpecies; }
    public void setPlantSpecies(String plantSpecies) { this.plantSpecies = plantSpecies; }

    public LocalDate getDatePlanted() { return datePlanted; }
    public void setDatePlanted(LocalDate datePlanted) { this.datePlanted = datePlanted; }

    public Boolean getIsApprovedPublic() { return isApprovedPublic; }
    public void setIsApprovedPublic(Boolean isApprovedPublic) { this.isApprovedPublic = isApprovedPublic; }

    public String getUploaderName() { return uploaderName; }
    public void setUploaderName(String uploaderName) { this.uploaderName = uploaderName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
