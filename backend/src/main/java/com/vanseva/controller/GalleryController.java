package com.vanseva.controller;

import com.vanseva.dto.ApiResponse;
import com.vanseva.dto.GalleryDto;
import com.vanseva.entity.User;
import com.vanseva.repository.UserRepository;
import com.vanseva.service.GalleryService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final GalleryService galleryService;
    private final UserRepository userRepository;

    public GalleryController(GalleryService galleryService, UserRepository userRepository) {
        this.galleryService = galleryService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GalleryDto>>> getApprovedPhotos() {
        List<GalleryDto> photos = galleryService.getApprovedPhotos();
        return ResponseEntity.ok(ApiResponse.ok(photos));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<GalleryDto>> uploadPhoto(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "campaignId", required = false) Long campaignId,
            @RequestParam(value = "plantSpecies", required = false) String plantSpecies,
            @RequestParam(value = "datePlanted", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datePlanted,
            @RequestPart("image") MultipartFile image,
            Authentication authentication,
            HttpServletRequest httpRequest) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("You must be logged in to upload plantation photos.");
        }

        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        String clientIp = httpRequest.getRemoteAddr();
        // Admins can auto-approve; regular members submit for approval
        GalleryDto result = galleryService.uploadPhoto(title, description, location, campaignId,
                plantSpecies, datePlanted, image, user.getId(), isAdmin, clientIp);

        String msg = isAdmin ? "Photo uploaded and published immediately." : "Photo uploaded successfully! Awaiting review by Vanseva moderators.";
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(msg, result));
    }
}
