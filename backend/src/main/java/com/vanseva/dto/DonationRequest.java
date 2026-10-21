package com.vanseva.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class DonationRequest {

    @NotBlank(message = "Donor name is required")
    private String donorName;

    @NotBlank(message = "Donor email is required")
    @Email(message = "Valid email is required")
    private String donorEmail;

    private String donorPhone;

    @NotBlank(message = "Donation type is required (MONETARY or PLANT_SPONSORSHIP)")
    private String donationType; // MONETARY, PLANT_SPONSORSHIP

    private BigDecimal amount;

    private Integer plantCount;

    private String plantSpecies;

    @NotNull(message = "Campaign ID is required")
    private Long campaignId;

    private String paymentMethod = "OFFLINE_TRANSFER"; // OFFLINE_TRANSFER, PLEDGE, UPI_OFFLINE

    private String transactionNotes;

    private Boolean consentTerms = true;

    public DonationRequest() {}

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }

    public String getDonationType() { return donationType; }
    public void setDonationType(String donationType) { this.donationType = donationType; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Integer getPlantCount() { return plantCount; }
    public void setPlantCount(Integer plantCount) { this.plantCount = plantCount; }

    public String getPlantSpecies() { return plantSpecies; }
    public void setPlantSpecies(String plantSpecies) { this.plantSpecies = plantSpecies; }

    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionNotes() { return transactionNotes; }
    public void setTransactionNotes(String transactionNotes) { this.transactionNotes = transactionNotes; }

    public Boolean getConsentTerms() { return consentTerms; }
    public void setConsentTerms(Boolean consentTerms) { this.consentTerms = consentTerms; }
}
