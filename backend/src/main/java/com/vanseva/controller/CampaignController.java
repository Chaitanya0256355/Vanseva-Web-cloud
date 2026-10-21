package com.vanseva.controller;

import com.vanseva.dto.ApiResponse;
import com.vanseva.dto.CampaignDto;
import com.vanseva.service.CampaignService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CampaignDto>>> getActiveCampaigns() {
        List<CampaignDto> campaigns = campaignService.getActiveCampaigns();
        return ResponseEntity.ok(ApiResponse.ok(campaigns));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CampaignDto>>> getAllCampaigns() {
        List<CampaignDto> campaigns = campaignService.getAllCampaigns();
        return ResponseEntity.ok(ApiResponse.ok(campaigns));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignDto>> getCampaignById(@PathVariable Long id) {
        CampaignDto campaign = campaignService.getCampaignById(id);
        return ResponseEntity.ok(ApiResponse.ok(campaign));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<CampaignDto>> getCampaignBySlug(@PathVariable String slug) {
        CampaignDto campaign = campaignService.getCampaignBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(campaign));
    }
}
