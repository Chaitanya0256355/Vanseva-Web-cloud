package com.vanseva.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_receipts")
public class DonationReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donation_id", nullable = false, unique = true)
    private Donation donation;

    @Column(name = "receipt_number", nullable = false, unique = true, length = 40)
    private String receiptNumber;

    @Column(name = "issue_date", nullable = false)
    private LocalDateTime issueDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stored_file_id", nullable = false)
    private StoredFile storedFile;

    @Column(name = "acknowledgement_note", length = 500)
    private String acknowledgementNote;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public DonationReceipt() {}

    public DonationReceipt(Donation donation, String receiptNumber, LocalDateTime issueDate, StoredFile storedFile, String acknowledgementNote) {
        this.donation = donation;
        this.receiptNumber = receiptNumber;
        this.issueDate = issueDate;
        this.storedFile = storedFile;
        this.acknowledgementNote = acknowledgementNote;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.issueDate == null) {
            this.issueDate = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Donation getDonation() { return donation; }
    public void setDonation(Donation donation) { this.donation = donation; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public LocalDateTime getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDateTime issueDate) { this.issueDate = issueDate; }

    public StoredFile getStoredFile() { return storedFile; }
    public void setStoredFile(StoredFile storedFile) { this.storedFile = storedFile; }

    public String getAcknowledgementNote() { return acknowledgementNote; }
    public void setAcknowledgementNote(String acknowledgementNote) { this.acknowledgementNote = acknowledgementNote; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
