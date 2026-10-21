package com.vanseva.controller;

import com.vanseva.dto.ApiResponse;
import com.vanseva.dto.DonationRequest;
import com.vanseva.dto.DonationResponseDto;
import com.vanseva.entity.User;
import com.vanseva.repository.UserRepository;
import com.vanseva.service.DonationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;
    private final UserRepository userRepository;

    public DonationController(DonationService donationService, UserRepository userRepository) {
        this.donationService = donationService;
        this.userRepository = userRepository;
    }

    @PostMapping(value = "/pledge", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ApiResponse<DonationResponseDto>> submitDonation(
            @ModelAttribute DonationRequest request,
            @RequestPart(value = "proofDoc", required = false) MultipartFile proofDoc,
            Authentication authentication,
            HttpServletRequest httpRequest) {

        Long currentUserId = null;
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            userRepository.findByUsername(authentication.getName()).ifPresent(u -> {
                // Pre-fill user details if not given
                if (request.getDonorEmail() == null || request.getDonorEmail().isBlank()) {
                    request.setDonorEmail(u.getEmail());
                }
                if (request.getDonorName() == null || request.getDonorName().isBlank()) {
                    request.setDonorName(u.getFullName());
                }
            });
            currentUserId = userRepository.findByUsername(authentication.getName()).map(User::getId).orElse(null);
        }

        String clientIp = httpRequest.getRemoteAddr();
        DonationResponseDto response = donationService.submitDonation(request, proofDoc, currentUserId, clientIp);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Thank you! Your donation pledge (" + response.getDonationReference() + ") has been recorded and is awaiting administrative verification.", response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<DonationResponseDto>>> getMyDonations(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Not authenticated"));
        }
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        List<DonationResponseDto> donations = donationService.getMyDonations(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(donations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DonationResponseDto>> getDonationById(@PathVariable Long id) {
        DonationResponseDto dto = donationService.getDonationById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/{id}/receipt/download")
    public ResponseEntity<ByteArrayResource> downloadReceipt(@PathVariable Long id, Authentication authentication) {
        Long currentUserId = null;
        boolean isAdmin = false;

        if (authentication != null && authentication.isAuthenticated()) {
            currentUserId = userRepository.findByUsername(authentication.getName()).map(User::getId).orElse(null);
            isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }

        byte[] pdfBytes = donationService.downloadReceiptPdf(id, currentUserId, isAdmin);
        ByteArrayResource resource = new ByteArrayResource(pdfBytes);

        DonationResponseDto donation = donationService.getDonationById(id);
        String filename = "Vanseva_Receipt_" + (donation.getReceiptNumber() != null ? donation.getReceiptNumber() : donation.getDonationReference()) + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfBytes.length)
                .body(resource);
    }
}
