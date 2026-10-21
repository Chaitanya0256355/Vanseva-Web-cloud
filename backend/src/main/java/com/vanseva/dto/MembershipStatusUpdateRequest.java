package com.vanseva.dto;

import jakarta.validation.constraints.NotBlank;

public class MembershipStatusUpdateRequest {
    @NotBlank(message = "Status is required (ACTIVE, PENDING, SUSPENDED)")
    private String status;

    public MembershipStatusUpdateRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
