package com.vanseva.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "donation_reference", nullable = false, unique = true, length = 35)
    private String donationReference;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "donor_name", nullable = false, length = 100)
    private String donorName;

    @Column(name = "donor_email", nullable = false, length = 100)
    private String donorEmail;

    @Column(name = "donor_phone", length = 25)
    private String donorPhone;

    @Column(name = "donation_type", nullable = false, length = 30)
    private String donationType; // MONETARY, PLANT_SPONSORSHIP

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "plant_count")
    private Integer plantCount = 0;

    @Column(name = "plant_species", length = 100)
    private String plantSpecies;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @Column(nullable = false, length = 30)
    private String status = "AWAITING_VERIFICATION"; // PENDING, AWAITING_VERIFICATION, CONFIRMED, REJECTED, REFUNDED

    @Column(name = "payment_method", length = 40)
    private String paymentMethod = "OFFLINE_TRANSFER"; // OFFLINE_TRANSFER, PLEDGE, UPI_OFFLINE

    @Column(name = "transaction_notes", length = 500)
    private String transactionNotes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supporting_document_file_id")
    private StoredFile supportingDocument;

    @Column(name = "verified_by")
    private Long verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Donation() {}

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

    public String getDonationReference() { return donationReference; }
    public void setDonationReference(String donationReference) { this.donationReference = donationReference; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public Campaign getCampaign() { return campaign; }
    public void setCampaign(Campaign campaign) { this.campaign = campaign; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionNotes() { return transactionNotes; }
    public void setTransactionNotes(String transactionNotes) { this.transactionNotes = transactionNotes; }

    public StoredFile getSupportingDocument() { return supportingDocument; }
    public void setSupportingDocument(StoredFile supportingDocument) { this.supportingDocument = supportingDocument; }

    public Long getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(Long verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
