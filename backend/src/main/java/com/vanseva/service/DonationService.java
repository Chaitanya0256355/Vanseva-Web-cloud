package com.vanseva.service;

import com.vanseva.dto.DonationRequest;
import com.vanseva.dto.DonationResponseDto;
import com.vanseva.dto.DonationVerifyRequest;
import com.vanseva.entity.*;
import com.vanseva.exception.ResourceNotFoundException;
import com.vanseva.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DonationService {

    private static final Logger log = LoggerFactory.getLogger(DonationService.class);

    private final DonationRepository donationRepository;
    private final DonationReceiptRepository donationReceiptRepository;
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;
    private final StoredFileRepository storedFileRepository;
    private final NextcloudService nextcloudService;
    private final PdfReceiptService pdfReceiptService;
    private final AuditService auditService;
    private final SecureRandom random = new SecureRandom();

    public DonationService(DonationRepository donationRepository,
                           DonationReceiptRepository donationReceiptRepository,
                           CampaignRepository campaignRepository,
                           UserRepository userRepository,
                           StoredFileRepository storedFileRepository,
                           NextcloudService nextcloudService,
                           PdfReceiptService pdfReceiptService,
                           AuditService auditService) {
        this.donationRepository = donationRepository;
        this.donationReceiptRepository = donationReceiptRepository;
        this.campaignRepository = campaignRepository;
        this.userRepository = userRepository;
        this.storedFileRepository = storedFileRepository;
        this.nextcloudService = nextcloudService;
        this.pdfReceiptService = pdfReceiptService;
        this.auditService = auditService;
    }

    public synchronized String generateUniqueDonationReference() {
        int year = Year.now().getValue();
        String candidate;
        do {
            int seq = 1000 + random.nextInt(9000);
            candidate = String.format("VS-DON-%d-%04d", year, seq);
        } while (donationRepository.findByDonationReference(candidate).isPresent());
        return candidate;
    }

    public synchronized String generateUniqueReceiptNumber() {
        int year = Year.now().getValue();
        String candidate;
        do {
            int seq = 1000 + random.nextInt(9000);
            candidate = String.format("VS-REC-%d-%04d", year, seq);
        } while (donationReceiptRepository.existsByReceiptNumber(candidate));
        return candidate;
    }

    @Transactional
    public DonationResponseDto submitDonation(DonationRequest request, MultipartFile proofDoc, Long currentUserId, String ipAddress) {
        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with ID " + request.getCampaignId()));

        User user = null;
        if (currentUserId != null) {
            user = userRepository.findById(currentUserId).orElse(null);
        }

        Donation donation = new Donation();
        donation.setDonationReference(generateUniqueDonationReference());
        donation.setUser(user);
        donation.setDonorName(request.getDonorName().trim());
        donation.setDonorEmail(request.getDonorEmail().trim().toLowerCase());
        donation.setDonorPhone(request.getDonorPhone());
        donation.setCampaign(campaign);
        donation.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "OFFLINE_TRANSFER");
        donation.setTransactionNotes(request.getTransactionNotes());
        donation.setStatus("AWAITING_VERIFICATION");

        if ("PLANT_SPONSORSHIP".equalsIgnoreCase(request.getDonationType())) {
            donation.setDonationType("PLANT_SPONSORSHIP");
            int plantCount = (request.getPlantCount() != null && request.getPlantCount() > 0) ? request.getPlantCount() : 1;
            donation.setPlantCount(plantCount);
            donation.setPlantSpecies(request.getPlantSpecies() != null ? request.getPlantSpecies() : "Mixed Native Broadleaf");

            // Server-side calculated authoritative amount
            BigDecimal unitPrice = campaign.getPlantUnitPrice() != null ? campaign.getPlantUnitPrice() : new BigDecimal("150.00");
            BigDecimal totalAmount = unitPrice.multiply(new BigDecimal(plantCount));
            donation.setAmount(totalAmount);

            // Update campaign pledged plants
            campaign.setPledgedPlants(campaign.getPledgedPlants() + plantCount);
            campaignRepository.save(campaign);
        } else {
            donation.setDonationType("MONETARY");
            if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Monetary donation amount must be greater than zero.");
            }
            donation.setAmount(request.getAmount());
            donation.setPlantCount(0);
        }

        // Upload supporting proof of transfer document to Nextcloud if provided
        if (proofDoc != null && !proofDoc.isEmpty()) {
            try {
                String originalFilename = proofDoc.getOriginalFilename();
                String ext = (originalFilename != null && originalFilename.contains("."))
                        ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".pdf";
                String storedName = "doc_" + donation.getDonationReference() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;

                String nextcloudPath = nextcloudService.uploadFile("DonationDocuments", storedName, proofDoc.getBytes(), proofDoc.getContentType());

                StoredFile storedFile = new StoredFile(originalFilename, storedName, nextcloudPath,
                        proofDoc.getContentType(), proofDoc.getSize(), "DONATION_DOCUMENT",
                        (user != null ? user.getId() : null), false);
                storedFile = storedFileRepository.save(storedFile);
                donation.setSupportingDocument(storedFile);
            } catch (Exception e) {
                log.error("Failed to upload donation proof document to Nextcloud: {}", e.getMessage());
            }
        }

        donation = donationRepository.save(donation);

        auditService.record("DONATION_PLEDGED", "Donation pledge created: " + donation.getDonationReference() + " (" + donation.getAmount() + " INR)",
                (user != null ? user.getId() : null), donation.getDonorEmail(), ipAddress, "Donation", donation.getId());

        return toDto(donation);
    }

    @Transactional
    public DonationResponseDto verifyDonation(Long donationId, DonationVerifyRequest verifyRequest, Long adminUserId, String ipAddress) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation record not found with ID " + donationId));

        String targetStatus = verifyRequest.getStatus().toUpperCase();
        String prevStatus = donation.getStatus();
        donation.setStatus(targetStatus);
        donation.setVerifiedBy(adminUserId);
        donation.setVerifiedAt(LocalDateTime.now());
        if (verifyRequest.getNotes() != null && !verifyRequest.getNotes().isBlank()) {
            donation.setTransactionNotes((donation.getTransactionNotes() != null ? donation.getTransactionNotes() + "\n" : "") +
                    "[Admin Note]: " + verifyRequest.getNotes());
        }

        if ("CONFIRMED".equals(targetStatus) && !"CONFIRMED".equals(prevStatus)) {
            // 1. Update Campaign totals
            Campaign campaign = donation.getCampaign();
            if (campaign != null) {
                campaign.setCollectedDonation(campaign.getCollectedDonation().add(donation.getAmount()));
                if ("PLANT_SPONSORSHIP".equals(donation.getDonationType()) && donation.getPlantCount() != null) {
                    campaign.setPlantedPlants(campaign.getPlantedPlants() + donation.getPlantCount());
                }
                campaignRepository.save(campaign);
            }

            // 2. Generate PDF Receipt and store in Nextcloud
            ensureReceiptGenerated(donation);
        }

        donation = donationRepository.save(donation);

        auditService.record("DONATION_VERIFIED", "Donation " + donation.getDonationReference() + " status verified to " + targetStatus,
                adminUserId, "admin", ipAddress, "Donation", donation.getId());

        return toDto(donation);
    }

    public synchronized DonationReceipt ensureReceiptGenerated(Donation donation) {
        Optional<DonationReceipt> existing = donationReceiptRepository.findByDonationId(donation.getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        String receiptNumber = generateUniqueReceiptNumber();
        try {
            // Generate real PDF receipt using OpenPDF
            byte[] pdfBytes = pdfReceiptService.generateDonationReceiptPdf(donation, receiptNumber);

            // Upload PDF to Nextcloud
            String filename = receiptNumber + ".pdf";
            String nextcloudPath = nextcloudService.uploadFile("DonationReceipts", filename, pdfBytes, "application/pdf");

            // Save StoredFile reference
            StoredFile storedFile = new StoredFile(filename, filename, nextcloudPath,
                    "application/pdf", (long) pdfBytes.length, "DONATION_RECEIPT",
                    (donation.getUser() != null ? donation.getUser().getId() : null), false);
            storedFile = storedFileRepository.save(storedFile);

            // Save DonationReceipt
            DonationReceipt receipt = new DonationReceipt(donation, receiptNumber, LocalDateTime.now(), storedFile,
                    "Official acknowledged receipt for contribution towards " + donation.getCampaign().getTitle());
            receipt = donationReceiptRepository.save(receipt);

            log.info("Successfully generated and stored receipt {} in Nextcloud for donation {}", receiptNumber, donation.getDonationReference());
            return receipt;
        } catch (Exception e) {
            log.error("Failed to generate or store receipt for donation {}: {}", donation.getDonationReference(), e.getMessage(), e);
            throw new RuntimeException("Could not generate receipt in Nextcloud: " + e.getMessage(), e);
        }
    }

    public byte[] downloadReceiptPdf(Long donationId, Long requestingUserId, boolean isAdmin) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with ID " + donationId));

        if (!isAdmin) {
            if (requestingUserId == null || donation.getUser() == null || !donation.getUser().getId().equals(requestingUserId)) {
                throw new org.springframework.security.access.AccessDeniedException("Unauthorized to download this receipt.");
            }
        }

        if (!"CONFIRMED".equalsIgnoreCase(donation.getStatus())) {
            throw new IllegalArgumentException("Receipt is only available for confirmed donations.");
        }

        DonationReceipt receipt = donationReceiptRepository.findByDonationId(donationId)
                .orElseGet(() -> ensureReceiptGenerated(donation));

        // Fetch actual PDF from Nextcloud
        return nextcloudService.downloadFile(receipt.getStoredFile().getNextcloudPath());
    }

    public List<DonationResponseDto> getMyDonations(Long userId) {
        return donationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<DonationResponseDto> getAllDonations() {
        return donationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public DonationResponseDto getDonationById(Long id) {
        Donation d = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with ID " + id));
        return toDto(d);
    }

    public DonationResponseDto toDto(Donation d) {
        DonationResponseDto dto = new DonationResponseDto();
        dto.setId(d.getId());
        dto.setDonationReference(d.getDonationReference());
        if (d.getUser() != null) {
            dto.setUserId(d.getUser().getId());
        }
        dto.setDonorName(d.getDonorName());
        dto.setDonorEmail(d.getDonorEmail());
        dto.setDonorPhone(d.getDonorPhone());
        dto.setDonationType(d.getDonationType());
        dto.setAmount(d.getAmount());
        dto.setPlantCount(d.getPlantCount());
        dto.setPlantSpecies(d.getPlantSpecies());
        if (d.getCampaign() != null) {
            dto.setCampaignId(d.getCampaign().getId());
            dto.setCampaignTitle(d.getCampaign().getTitle());
        }
        dto.setStatus(d.getStatus());
        dto.setPaymentMethod(d.getPaymentMethod());
        dto.setTransactionNotes(d.getTransactionNotes());
        dto.setVerifiedAt(d.getVerifiedAt());
        dto.setCreatedAt(d.getCreatedAt());

        Optional<DonationReceipt> receiptOpt = donationReceiptRepository.findByDonationId(d.getId());
        if (receiptOpt.isPresent()) {
            dto.setHasReceipt(true);
            dto.setReceiptNumber(receiptOpt.get().getReceiptNumber());
            dto.setReceiptDownloadUrl("/api/donations/" + d.getId() + "/receipt/download");
        } else if ("CONFIRMED".equalsIgnoreCase(d.getStatus())) {
            dto.setHasReceipt(true);
            dto.setReceiptDownloadUrl("/api/donations/" + d.getId() + "/receipt/download");
        } else {
            dto.setHasReceipt(false);
        }

        return dto;
    }
}
