package com.vanseva.service;

import com.vanseva.dto.CampaignDto;
import com.vanseva.entity.Campaign;
import com.vanseva.entity.StoredFile;
import com.vanseva.exception.ResourceNotFoundException;
import com.vanseva.repository.CampaignRepository;
import com.vanseva.repository.StoredFileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CampaignService {

    private static final Logger log = LoggerFactory.getLogger(CampaignService.class);

    private final CampaignRepository campaignRepository;
    private final StoredFileRepository storedFileRepository;
    private final NextcloudService nextcloudService;

    public CampaignService(CampaignRepository campaignRepository,
                           StoredFileRepository storedFileRepository,
                           NextcloudService nextcloudService) {
        this.campaignRepository = campaignRepository;
        this.storedFileRepository = storedFileRepository;
        this.nextcloudService = nextcloudService;
    }

    public List<CampaignDto> getAllCampaigns() {
        return campaignRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<CampaignDto> getActiveCampaigns() {
        return campaignRepository.findByStatusOrderByCreatedAtDesc("ACTIVE").stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CampaignDto getCampaignById(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with ID " + id));
        return toDto(campaign);
    }

    public CampaignDto getCampaignBySlug(String slug) {
        Campaign campaign = campaignRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with slug " + slug));
        return toDto(campaign);
    }

    @Transactional
    public CampaignDto createCampaign(CampaignDto dto, MultipartFile coverImage, Long adminUserId) {
        Campaign campaign = new Campaign();
        campaign.setTitle(dto.getTitle());
        String slug = (dto.getSlug() != null && !dto.getSlug().isBlank())
                ? dto.getSlug()
                : dto.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        campaign.setSlug(slug);
        campaign.setDescription(dto.getDescription());
        campaign.setLocation(dto.getLocation());
        campaign.setTargetPlants(dto.getTargetPlants() != null ? dto.getTargetPlants() : 5000);
        campaign.setTargetDonation(dto.getTargetDonation() != null ? dto.getTargetDonation() : new BigDecimal("750000.00"));
        campaign.setPlantUnitPrice(dto.getPlantUnitPrice() != null ? dto.getPlantUnitPrice() : new BigDecimal("150.00"));
        campaign.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        campaign.setStartDate(dto.getStartDate());
        campaign.setEndDate(dto.getEndDate());

        if (coverImage != null && !coverImage.isEmpty()) {
            try {
                String originalFilename = coverImage.getOriginalFilename();
                String ext = (originalFilename != null && originalFilename.contains("."))
                        ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
                String storedName = "campaign_" + slug + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;

                String nextcloudPath = nextcloudService.uploadFile("CampaignMedia", storedName, coverImage.getBytes(), coverImage.getContentType());
                StoredFile file = new StoredFile(originalFilename, storedName, nextcloudPath,
                        coverImage.getContentType(), coverImage.getSize(), "CAMPAIGN_MEDIA", adminUserId, true);
                file = storedFileRepository.save(file);
                campaign.setCoverImageFile(file);
            } catch (Exception e) {
                log.error("Failed to upload campaign cover to Nextcloud: {}", e.getMessage());
            }
        }

        campaign = campaignRepository.save(campaign);
        return toDto(campaign);
    }

    @Transactional
    public CampaignDto updateCampaign(Long id, CampaignDto dto, MultipartFile coverImage, Long adminUserId) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with ID " + id));

        if (dto.getTitle() != null) campaign.setTitle(dto.getTitle());
        if (dto.getDescription() != null) campaign.setDescription(dto.getDescription());
        if (dto.getLocation() != null) campaign.setLocation(dto.getLocation());
        if (dto.getTargetPlants() != null) campaign.setTargetPlants(dto.getTargetPlants());
        if (dto.getTargetDonation() != null) campaign.setTargetDonation(dto.getTargetDonation());
        if (dto.getPlantUnitPrice() != null) campaign.setPlantUnitPrice(dto.getPlantUnitPrice());
        if (dto.getStatus() != null) campaign.setStatus(dto.getStatus());
        if (dto.getStartDate() != null) campaign.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) campaign.setEndDate(dto.getEndDate());

        if (coverImage != null && !coverImage.isEmpty()) {
            try {
                String originalFilename = coverImage.getOriginalFilename();
                String ext = (originalFilename != null && originalFilename.contains("."))
                        ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
                String storedName = "campaign_" + campaign.getSlug() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;

                String nextcloudPath = nextcloudService.uploadFile("CampaignMedia", storedName, coverImage.getBytes(), coverImage.getContentType());
                StoredFile file = new StoredFile(originalFilename, storedName, nextcloudPath,
                        coverImage.getContentType(), coverImage.getSize(), "CAMPAIGN_MEDIA", adminUserId, true);
                file = storedFileRepository.save(file);
                campaign.setCoverImageFile(file);
            } catch (Exception e) {
                log.error("Failed to upload campaign cover to Nextcloud: {}", e.getMessage());
            }
        }

        campaign = campaignRepository.save(campaign);
        return toDto(campaign);
    }

    public CampaignDto toDto(Campaign c) {
        CampaignDto dto = new CampaignDto();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setSlug(c.getSlug());
        dto.setDescription(c.getDescription());
        dto.setLocation(c.getLocation());
        dto.setTargetPlants(c.getTargetPlants());
        dto.setPlantedPlants(c.getPlantedPlants());
        dto.setPledgedPlants(c.getPledgedPlants());
        dto.setTargetDonation(c.getTargetDonation());
        dto.setCollectedDonation(c.getCollectedDonation());
        dto.setPlantUnitPrice(c.getPlantUnitPrice());
        dto.setStatus(c.getStatus());
        if (c.getCoverImageFile() != null) {
            dto.setCoverImageFileId(c.getCoverImageFile().getId());
            dto.setCoverImageUrl("/api/files/" + c.getCoverImageFile().getId() + "/view");
        }
        dto.setStartDate(c.getStartDate());
        dto.setEndDate(c.getEndDate());

        // Calculate progress percentages safely
        if (c.getTargetPlants() != null && c.getTargetPlants() > 0) {
            double p = ((double) c.getPlantedPlants() / c.getTargetPlants()) * 100.0;
            dto.setPlantProgressPercentage(Math.min(100.0, Math.round(p * 10.0) / 10.0));
        }

        if (c.getTargetDonation() != null && c.getTargetDonation().compareTo(BigDecimal.ZERO) > 0 && c.getCollectedDonation() != null) {
            double f = c.getCollectedDonation()
                    .divide(c.getTargetDonation(), 4, RoundingMode.HALF_UP)
                    .doubleValue() * 100.0;
            dto.setFundingProgressPercentage(Math.min(100.0, Math.round(f * 10.0) / 10.0));
        }

        return dto;
    }
}
