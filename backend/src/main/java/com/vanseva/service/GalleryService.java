package com.vanseva.service;

import com.vanseva.dto.GalleryDto;
import com.vanseva.entity.Campaign;
import com.vanseva.entity.PlantationGallery;
import com.vanseva.entity.StoredFile;
import com.vanseva.entity.User;
import com.vanseva.exception.ResourceNotFoundException;
import com.vanseva.repository.CampaignRepository;
import com.vanseva.repository.PlantationGalleryRepository;
import com.vanseva.repository.StoredFileRepository;
import com.vanseva.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GalleryService {

    private static final Logger log = LoggerFactory.getLogger(GalleryService.class);

    private final PlantationGalleryRepository galleryRepository;
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;
    private final StoredFileRepository storedFileRepository;
    private final NextcloudService nextcloudService;
    private final AuditService auditService;

    public GalleryService(PlantationGalleryRepository galleryRepository,
                          CampaignRepository campaignRepository,
                          UserRepository userRepository,
                          StoredFileRepository storedFileRepository,
                          NextcloudService nextcloudService,
                          AuditService auditService) {
        this.galleryRepository = galleryRepository;
        this.campaignRepository = campaignRepository;
        this.userRepository = userRepository;
        this.storedFileRepository = storedFileRepository;
        this.nextcloudService = nextcloudService;
        this.auditService = auditService;
    }

    public List<GalleryDto> getApprovedPhotos() {
        return galleryRepository.findByIsApprovedPublicTrueOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<GalleryDto> getAllPhotosForAdmin() {
        return galleryRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public GalleryDto uploadPhoto(String title, String description, String location, Long campaignId,
                                  String plantSpecies, LocalDate datePlanted, MultipartFile imageFile,
                                  Long userId, boolean autoApprove, String ipAddress) {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("Image file is required.");
        }

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        Campaign campaign = null;
        if (campaignId != null) {
            campaign = campaignRepository.findById(campaignId).orElse(null);
        }

        try {
            String originalFilename = imageFile.getOriginalFilename();
            String ext = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String storedName = "plantation_" + UUID.randomUUID().toString().substring(0, 8) + ext;

            // Upload directly to Nextcloud PlantationImages directory
            String nextcloudPath = nextcloudService.uploadFile("PlantationImages", storedName, imageFile.getBytes(), imageFile.getContentType());

            StoredFile storedFile = new StoredFile(originalFilename, storedName, nextcloudPath,
                    imageFile.getContentType(), imageFile.getSize(), "PLANTATION_IMAGE",
                    (user != null ? user.getId() : null), true);
            storedFile = storedFileRepository.save(storedFile);

            PlantationGallery gallery = new PlantationGallery();
            gallery.setTitle(title);
            gallery.setDescription(description);
            gallery.setLocation(location);
            gallery.setCampaign(campaign);
            gallery.setFile(storedFile);
            gallery.setPlantSpecies(plantSpecies);
            gallery.setDatePlanted(datePlanted != null ? datePlanted : LocalDate.now());
            gallery.setIsApprovedPublic(autoApprove);
            gallery.setUploadedByUser(user);
            gallery = galleryRepository.save(gallery);

            auditService.record("IMAGE_UPLOADED", "Plantation photo uploaded: " + title,
                    (user != null ? user.getId() : null), (user != null ? user.getEmail() : "public"),
                    ipAddress, "PlantationGallery", gallery.getId());

            return toDto(gallery);
        } catch (Exception e) {
            log.error("Failed to upload plantation photo to Nextcloud: {}", e.getMessage(), e);
            throw new RuntimeException("Image upload to Nextcloud failed: " + e.getMessage(), e);
        }
    }

    @Transactional
    public GalleryDto updateApproval(Long galleryId, boolean approved, Long adminUserId, String ipAddress) {
        PlantationGallery gallery = galleryRepository.findById(galleryId)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found with ID " + galleryId));
        gallery.setIsApprovedPublic(approved);
        gallery = galleryRepository.save(gallery);

        auditService.record("IMAGE_APPROVAL_CHANGED", "Gallery item " + gallery.getId() + " approval set to " + approved,
                adminUserId, "admin", ipAddress, "PlantationGallery", gallery.getId());

        return toDto(gallery);
    }

    public GalleryDto toDto(PlantationGallery g) {
        GalleryDto dto = new GalleryDto();
        dto.setId(g.getId());
        dto.setTitle(g.getTitle());
        dto.setDescription(g.getDescription());
        dto.setLocation(g.getLocation());
        if (g.getCampaign() != null) {
            dto.setCampaignId(g.getCampaign().getId());
            dto.setCampaignTitle(g.getCampaign().getTitle());
        }
        if (g.getFile() != null) {
            dto.setFileId(g.getFile().getId());
            dto.setImageUrl("/api/files/" + g.getFile().getId() + "/view");
        }
        dto.setPlantSpecies(g.getPlantSpecies());
        dto.setDatePlanted(g.getDatePlanted());
        dto.setIsApprovedPublic(g.getIsApprovedPublic());
        if (g.getUploadedByUser() != null) {
            dto.setUploaderName(g.getUploadedByUser().getFullName());
        } else {
            dto.setUploaderName("Vanseva Field Volunteer");
        }
        dto.setCreatedAt(g.getCreatedAt());
        return dto;
    }
}
