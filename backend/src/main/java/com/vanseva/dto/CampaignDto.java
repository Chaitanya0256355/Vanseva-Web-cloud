package com.vanseva.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CampaignDto {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private String location;
    private Integer targetPlants;
    private Integer plantedPlants;
    private Integer pledgedPlants;
    private BigDecimal targetDonation;
    private BigDecimal collectedDonation;
    private BigDecimal plantUnitPrice;
    private String status;
    private Long coverImageFileId;
    private String coverImageUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private double plantProgressPercentage;
    private double fundingProgressPercentage;

    public CampaignDto() {}

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

    public Long getCoverImageFileId() { return coverImageFileId; }
    public void setCoverImageFileId(Long coverImageFileId) { this.coverImageFileId = coverImageFileId; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public double getPlantProgressPercentage() { return plantProgressPercentage; }
    public void setPlantProgressPercentage(double plantProgressPercentage) { this.plantProgressPercentage = plantProgressPercentage; }

    public double getFundingProgressPercentage() { return fundingProgressPercentage; }
    public void setFundingProgressPercentage(double fundingProgressPercentage) { this.fundingProgressPercentage = fundingProgressPercentage; }
}
