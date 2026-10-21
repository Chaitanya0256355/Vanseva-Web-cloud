package com.vanseva.controller;

import com.vanseva.dto.ApiResponse;
import com.vanseva.dto.MembershipResponseDto;
import com.vanseva.dto.RegisterRequest;
import com.vanseva.entity.User;
import com.vanseva.repository.UserRepository;
import com.vanseva.service.MembershipService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/memberships")
public class MembershipController {

    private final MembershipService membershipService;
    private final UserRepository userRepository;

    public MembershipController(MembershipService membershipService, UserRepository userRepository) {
        this.membershipService = membershipService;
        this.userRepository = userRepository;
    }

    @PostMapping(value = "/register", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ApiResponse<MembershipResponseDto>> register(
            @ModelAttribute RegisterRequest request,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto,
            HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        var membership = membershipService.registerMember(request, profilePhoto, clientIp);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Membership registered successfully with ID: " + membership.getMembershipNumber(),
                        membershipService.toDto(membership)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<MembershipResponseDto>> getMyMembership(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("You must be logged in to view your membership.");
        }
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        MembershipResponseDto dto = membershipService.getMembershipByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MembershipResponseDto>> getMembershipById(@PathVariable Long id,
                                                                                Authentication authentication) {
        MembershipResponseDto dto = membershipService.getMembershipById(id);
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isOwner = authentication != null && authentication.getName().equals(dto.getEmail());

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You are not authorized to view this membership.");
        }

        return ResponseEntity.ok(ApiResponse.ok(dto));
    }
}
