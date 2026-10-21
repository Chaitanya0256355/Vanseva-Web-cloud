package com.vanseva.dto;

import java.time.LocalDateTime;

public class MembershipResponseDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String membershipNumber;
    private String membershipType;
    private String status;
    private String address;
    private String city;
    private String postalCode;
    private String environmentalInterests;
    private Long profileFileId;
    private String profileFileUrl;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;

    public MembershipResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getMembershipNumber() { return membershipNumber; }
    public void setMembershipNumber(String membershipNumber) { this.membershipNumber = membershipNumber; }

    public String getMembershipType() { return membershipType; }
    public void setMembershipType(String membershipType) { this.membershipType = membershipType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getEnvironmentalInterests() { return environmentalInterests; }
    public void setEnvironmentalInterests(String environmentalInterests) { this.environmentalInterests = environmentalInterests; }

    public Long getProfileFileId() { return profileFileId; }
    public void setProfileFileId(Long profileFileId) { this.profileFileId = profileFileId; }

    public String getProfileFileUrl() { return profileFileUrl; }
    public void setProfileFileUrl(String profileFileUrl) { this.profileFileUrl = profileFileUrl; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
