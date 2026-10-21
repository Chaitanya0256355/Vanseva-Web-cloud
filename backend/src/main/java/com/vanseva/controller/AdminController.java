package com.vanseva.controller;

import com.vanseva.dto.*;
import com.vanseva.entity.AuditLog;
import com.vanseva.entity.User;
import com.vanseva.repository.*;
import com.vanseva.service.CampaignService;
import com.vanseva.service.DonationService;
import com.vanseva.service.GalleryService;
import com.vanseva.service.MembershipService;
import com.vanseva.service.NextcloudService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final DonationRepository donationRepository;
    private final DonationReceiptRepository receiptRepository;
    private final CampaignRepository campaignRepository;
    private final PlantationGalleryRepository galleryRepository;
    private final AuditLogRepository auditLogRepository;
    private final MembershipService membershipService;
    private final DonationService donationService;
    private final CampaignService campaignService;
    private final GalleryService galleryService;
    private final NextcloudService nextcloudService;

    public AdminController(UserRepository userRepository,
                           MembershipRepository membershipRepository,
                           DonationRepository donationRepository,
                           DonationReceiptRepository receiptRepository,
                           CampaignRepository campaignRepository,
                           PlantationGalleryRepository galleryRepository,
                           AuditLogRepository auditLogRepository,
                           MembershipService membershipService,
                           DonationService donationService,
                           CampaignService campaignService,
                           GalleryService galleryService,
                           NextcloudService nextcloudService) {
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.donationRepository = donationRepository;
        this.receiptRepository = receiptRepository;
        this.campaignRepository = campaignRepository;
        this.galleryRepository = galleryRepository;
        this.auditLogRepository = auditLogRepository;
        this.membershipService = membershipService;
        this.donationService = donationService;
        this.campaignService = campaignService;
        this.galleryService = galleryService;
        this.nextcloudService = nextcloudService;
    }

    private Long getAdminUserId(Authentication authentication) {
        if (authentication == null) return null;
        return userRepository.findByUsername(authentication.getName()).map(User::getId).orElse(null);
    }

    @GetMapping("/overview-stats")
    public ResponseEntity<ApiResponse<AdminOverviewStatsDto>> getOverviewStats() {
        AdminOverviewStatsDto stats = new AdminOverviewStatsDto();

        // 1. Memberships
        stats.setTotalMembers(membershipRepository.count());
        stats.setActiveMemberships(membershipRepository.countByStatus("ACTIVE"));
        stats.setPendingMembershipApprovals(membershipRepository.countByStatus("PENDING"));

        // 2. Donations
        BigDecimal totalPledges = donationRepository.sumTotalPledgedAmount();
        BigDecimal confirmedTotal = donationRepository.sumConfirmedDonationAmount();
        stats.setTotalDonationPledges(totalPledges != null ? totalPledges : BigDecimal.ZERO);
        stats.setConfirmedDonationsTotal(confirmedTotal != null ? confirmedTotal : BigDecimal.ZERO);
        stats.setPendingDonationsCount(donationRepository.countByStatus("AWAITING_VERIFICATION") + donationRepository.countByStatus("PENDING"));

        // 3. Plants
        Long totalPlants = donationRepository.sumTotalPledgedPlantCount();
        Long confirmedPlants = donationRepository.sumConfirmedPlantCount();
        stats.setTotalPlantsSponsored(totalPlants != null ? totalPlants : 0L);
        stats.setConfirmedPlantsPlanted(confirmedPlants != null ? confirmedPlants : 0L);

        // 4. Campaigns & Receipts
        stats.setActiveCampaignsCount(campaignRepository.countByStatus("ACTIVE"));
        stats.setTotalReceiptsGenerated(receiptRepository.count());
        stats.setApprovedGalleryPhotos(galleryRepository.countByIsApprovedPublicTrue());

        // 5. Nextcloud health
        StorageHealthDto health = nextcloudService.checkHealth();
        stats.setNextcloudStorageConnected(health.isHealthy());
        stats.setNextcloudStatus(health.isHealthy() ? "Connected (" + health.getLatencyMs() + "ms)" : "Degraded");

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    // Memberships Management
    @GetMapping("/memberships")
    public ResponseEntity<ApiResponse<List<MembershipResponseDto>>> getAllMemberships() {
        return ResponseEntity.ok(ApiResponse.ok(membershipService.getAllMemberships()));
    }

    @PatchMapping("/memberships/{id}/status")
    public ResponseEntity<ApiResponse<MembershipResponseDto>> updateMembershipStatus(
            @PathVariable Long id,
            @Valid @RequestBody MembershipStatusUpdateRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long adminId = getAdminUserId(authentication);
        MembershipResponseDto result = membershipService.updateStatus(id, request.getStatus(), adminId, httpRequest.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Membership status updated to " + request.getStatus(), result));
    }

    // Donations Verification
    @GetMapping("/donations")
    public ResponseEntity<ApiResponse<List<DonationResponseDto>>> getAllDonations() {
        return ResponseEntity.ok(ApiResponse.ok(donationService.getAllDonations()));
    }

    @PostMapping("/donations/{id}/verify")
    public ResponseEntity<ApiResponse<DonationResponseDto>> verifyDonation(
            @PathVariable Long id,
            @Valid @RequestBody DonationVerifyRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long adminId = getAdminUserId(authentication);
        DonationResponseDto result = donationService.verifyDonation(id, request, adminId, httpRequest.getRemoteAddr());
        String msg = "CONFIRMED".equalsIgnoreCase(request.getStatus())
                ? "Donation verified and confirmed! Official PDF receipt generated and stored in Nextcloud."
                : "Donation status updated to " + request.getStatus();
        return ResponseEntity.ok(ApiResponse.ok(msg, result));
    }

    // Campaign Management
    @PostMapping(value = "/campaigns", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ApiResponse<CampaignDto>> createCampaign(
            @ModelAttribute CampaignDto dto,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage,
            Authentication authentication) {
        Long adminId = getAdminUserId(authentication);
        CampaignDto created = campaignService.createCampaign(dto, coverImage, adminId);
        return ResponseEntity.ok(ApiResponse.ok("Campaign created successfully", created));
    }

    @PutMapping(value = "/campaigns/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ApiResponse<CampaignDto>> updateCampaign(
            @PathVariable Long id,
            @ModelAttribute CampaignDto dto,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage,
            Authentication authentication) {
        Long adminId = getAdminUserId(authentication);
        CampaignDto updated = campaignService.updateCampaign(id, dto, coverImage, adminId);
        return ResponseEntity.ok(ApiResponse.ok("Campaign updated successfully", updated));
    }

    // Gallery Moderation
    @GetMapping("/gallery")
    public ResponseEntity<ApiResponse<List<GalleryDto>>> getAllGalleryPhotos() {
        return ResponseEntity.ok(ApiResponse.ok(galleryService.getAllPhotosForAdmin()));
    }

    @PatchMapping("/gallery/{id}/status")
    public ResponseEntity<ApiResponse<GalleryDto>> updateGalleryApproval(
            @PathVariable Long id,
            @RequestParam boolean approved,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long adminId = getAdminUserId(authentication);
        GalleryDto result = galleryService.updateApproval(id, approved, adminId, httpRequest.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Photo approval status updated to " + approved, result));
    }

    // Audit Logs
    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.ok(auditLogRepository.findTop50ByOrderByCreatedAtDesc()));
    }

    // Storage Health
    @GetMapping("/storage/health")
    public ResponseEntity<ApiResponse<StorageHealthDto>> getStorageHealth() {
        StorageHealthDto health = nextcloudService.checkHealth();
        return ResponseEntity.ok(ApiResponse.ok(health));
    }
}
