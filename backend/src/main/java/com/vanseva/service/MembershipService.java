package com.vanseva.service;

import com.vanseva.dto.MembershipResponseDto;
import com.vanseva.dto.RegisterRequest;
import com.vanseva.entity.Membership;
import com.vanseva.entity.StoredFile;
import com.vanseva.entity.User;
import com.vanseva.exception.ResourceNotFoundException;
import com.vanseva.repository.MembershipRepository;
import com.vanseva.repository.StoredFileRepository;
import com.vanseva.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MembershipService {

    private static final Logger log = LoggerFactory.getLogger(MembershipService.class);
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final StoredFileRepository storedFileRepository;
    private final NextcloudService nextcloudService;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;
    private final SecureRandom random = new SecureRandom();

    public MembershipService(MembershipRepository membershipRepository,
                             UserRepository userRepository,
                             StoredFileRepository storedFileRepository,
                             NextcloudService nextcloudService,
                             PasswordEncoder passwordEncoder,
                             AuditService auditService) {
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
        this.storedFileRepository = storedFileRepository;
        this.nextcloudService = nextcloudService;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    public synchronized String generateUniqueMembershipNumber() {
        int year = Year.now().getValue();
        String candidate;
        do {
            int seq = 1000 + random.nextInt(9000);
            candidate = String.format("VS-MEM-%d-%04d", year, seq);
        } while (membershipRepository.existsByMembershipNumber(candidate));
        return candidate;
    }

    @Transactional
    public Membership registerMember(RegisterRequest request, MultipartFile profilePhoto, String ipAddress) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("An account with email " + request.getEmail() + " already exists.");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username " + request.getUsername() + " is already taken.");
        }

        // 1. Create User
        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_MEMBER");
        user = userRepository.save(user);

        // 2. Handle Profile Photo Upload to Nextcloud if provided
        StoredFile profileFile = null;
        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            try {
                String originalFilename = profilePhoto.getOriginalFilename();
                String ext = (originalFilename != null && originalFilename.contains("."))
                        ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
                String storedName = "profile_" + user.getId() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;

                String nextcloudPath = nextcloudService.uploadFile("Memberships", storedName, profilePhoto.getBytes(), profilePhoto.getContentType());

                profileFile = new StoredFile(originalFilename, storedName, nextcloudPath,
                        profilePhoto.getContentType(), profilePhoto.getSize(), "PROFILE_IMAGE", user.getId(), false);
                profileFile = storedFileRepository.save(profileFile);
            } catch (Exception e) {
                log.error("Failed to upload profile image to Nextcloud during registration: {}", e.getMessage());
                // Non-fatal, membership still proceeds
            }
        }

        // 3. Create Membership Record
        Membership membership = new Membership();
        membership.setUser(user);
        membership.setMembershipNumber(generateUniqueMembershipNumber());
        membership.setMembershipType(request.getMembershipType() != null ? request.getMembershipType().toUpperCase() : "INDIVIDUAL");
        membership.setStatus("ACTIVE"); // auto-active for instant NGO welcome, or can be PENDING
        membership.setAddress(request.getAddress());
        membership.setCity(request.getCity());
        membership.setPostalCode(request.getPostalCode());
        membership.setEnvironmentalInterests(request.getEnvironmentalInterests());
        membership.setConsentPrivacy(request.getConsentPrivacy() != null ? request.getConsentPrivacy() : true);
        membership.setProfileFile(profileFile);
        membership = membershipRepository.save(membership);

        auditService.record("MEMBERSHIP_REGISTERED", "New membership created: " + membership.getMembershipNumber(),
                user.getId(), user.getEmail(), ipAddress, "Membership", membership.getId());

        return membership;
    }

    public MembershipResponseDto getMembershipByUserId(Long userId) {
        Membership m = membershipRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership profile not found for user ID " + userId));
        return toDto(m);
    }

    public MembershipResponseDto getMembershipById(Long id) {
        Membership m = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with ID " + id));
        return toDto(m);
    }

    public List<MembershipResponseDto> getAllMemberships() {
        return membershipRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MembershipResponseDto updateStatus(Long membershipId, String status, Long adminUserId, String ipAddress) {
        Membership m = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with ID " + membershipId));

        String oldStatus = m.getStatus();
        m.setStatus(status.toUpperCase());
        if ("ACTIVE".equalsIgnoreCase(status)) {
            m.setApprovedBy(adminUserId);
            m.setApprovedAt(LocalDateTime.now());
        }
        m = membershipRepository.save(m);

        auditService.record("MEMBERSHIP_STATUS_CHANGED", "Membership " + m.getMembershipNumber() + " status changed from " + oldStatus + " to " + status,
                adminUserId, "admin", ipAddress, "Membership", m.getId());

        return toDto(m);
    }

    public MembershipResponseDto toDto(Membership m) {
        MembershipResponseDto dto = new MembershipResponseDto();
        dto.setId(m.getId());
        if (m.getUser() != null) {
            dto.setUserId(m.getUser().getId());
            dto.setFullName(m.getUser().getFullName());
            dto.setEmail(m.getUser().getEmail());
            dto.setPhone(m.getUser().getPhone());
        }
        dto.setMembershipNumber(m.getMembershipNumber());
        dto.setMembershipType(m.getMembershipType());
        dto.setStatus(m.getStatus());
        dto.setAddress(m.getAddress());
        dto.setCity(m.getCity());
        dto.setPostalCode(m.getPostalCode());
        dto.setEnvironmentalInterests(m.getEnvironmentalInterests());
        if (m.getProfileFile() != null) {
            dto.setProfileFileId(m.getProfileFile().getId());
            dto.setProfileFileUrl("/api/files/" + m.getProfileFile().getId() + "/view");
        }
        dto.setApprovedAt(m.getApprovedAt());
        dto.setCreatedAt(m.getCreatedAt());
        return dto;
    }
}
