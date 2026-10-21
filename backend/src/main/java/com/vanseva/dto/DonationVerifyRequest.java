package com.vanseva.dto;

import jakarta.validation.constraints.NotBlank;

public class DonationVerifyRequest {
    @NotBlank(message = "Status is required (CONFIRMED or REJECTED)")
    private String status; // CONFIRMED, REJECTED, REFUNDED

    private String notes;

    public DonationVerifyRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
