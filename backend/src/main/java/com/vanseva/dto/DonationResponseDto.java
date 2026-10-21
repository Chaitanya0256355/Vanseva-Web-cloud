package com.vanseva.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DonationResponseDto {
    private Long id;
    private String donationReference;
    private Long userId;
    private String donorName;
    private String donorEmail;
    private String donorPhone;
    private String donationType;
    private BigDecimal amount;
    private Integer plantCount;
    private String plantSpecies;
    private Long campaignId;
    private String campaignTitle;
    private String status;
    private String paymentMethod;
    private String transactionNotes;
    private Boolean hasReceipt;
    private String receiptNumber;
    private String receiptDownloadUrl;
    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;

    public DonationResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDonationReference() { return donationReference; }
    public void setDonationReference(String donationReference) { this.donationReference = donationReference; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

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

    public String getCampaignTitle() { return campaignTitle; }
    public void setCampaignTitle(String campaignTitle) { this.campaignTitle = campaignTitle; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionNotes() { return transactionNotes; }
    public void setTransactionNotes(String transactionNotes) { this.transactionNotes = transactionNotes; }

    public Boolean getHasReceipt() { return hasReceipt; }
    public void setHasReceipt(Boolean hasReceipt) { this.hasReceipt = hasReceipt; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public String getReceiptDownloadUrl() { return receiptDownloadUrl; }
    public void setReceiptDownloadUrl(String receiptDownloadUrl) { this.receiptDownloadUrl = receiptDownloadUrl; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
