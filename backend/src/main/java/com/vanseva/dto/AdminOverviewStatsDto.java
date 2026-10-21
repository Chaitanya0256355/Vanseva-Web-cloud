package com.vanseva.dto;

import java.math.BigDecimal;

public class AdminOverviewStatsDto {
    private long totalMembers;
    private long activeMemberships;
    private long pendingMembershipApprovals;
    private BigDecimal totalDonationPledges;
    private BigDecimal confirmedDonationsTotal;
    private long pendingDonationsCount;
    private long totalPlantsSponsored;
    private long confirmedPlantsPlanted;
    private long activeCampaignsCount;
    private long totalReceiptsGenerated;
    private long approvedGalleryPhotos;
    private boolean nextcloudStorageConnected;
    private String nextcloudStatus;

    public AdminOverviewStatsDto() {}

    public long getTotalMembers() { return totalMembers; }
    public void setTotalMembers(long totalMembers) { this.totalMembers = totalMembers; }

    public long getActiveMemberships() { return activeMemberships; }
    public void setActiveMemberships(long activeMemberships) { this.activeMemberships = activeMemberships; }

    public long getPendingMembershipApprovals() { return pendingMembershipApprovals; }
    public void setPendingMembershipApprovals(long pendingMembershipApprovals) { this.pendingMembershipApprovals = pendingMembershipApprovals; }

    public BigDecimal getTotalDonationPledges() { return totalDonationPledges; }
    public void setTotalDonationPledges(BigDecimal totalDonationPledges) { this.totalDonationPledges = totalDonationPledges; }

    public BigDecimal getConfirmedDonationsTotal() { return confirmedDonationsTotal; }
    public void setConfirmedDonationsTotal(BigDecimal confirmedDonationsTotal) { this.confirmedDonationsTotal = confirmedDonationsTotal; }

    public long getPendingDonationsCount() { return pendingDonationsCount; }
    public void setPendingDonationsCount(long pendingDonationsCount) { this.pendingDonationsCount = pendingDonationsCount; }

    public long getTotalPlantsSponsored() { return totalPlantsSponsored; }
    public void setTotalPlantsSponsored(long totalPlantsSponsored) { this.totalPlantsSponsored = totalPlantsSponsored; }

    public long getConfirmedPlantsPlanted() { return confirmedPlantsPlanted; }
    public void setConfirmedPlantsPlanted(long confirmedPlantsPlanted) { this.confirmedPlantsPlanted = confirmedPlantsPlanted; }

    public long getActiveCampaignsCount() { return activeCampaignsCount; }
    public void setActiveCampaignsCount(long activeCampaignsCount) { this.activeCampaignsCount = activeCampaignsCount; }

    public long getTotalReceiptsGenerated() { return totalReceiptsGenerated; }
    public void setTotalReceiptsGenerated(long totalReceiptsGenerated) { this.totalReceiptsGenerated = totalReceiptsGenerated; }

    public long getApprovedGalleryPhotos() { return approvedGalleryPhotos; }
    public void setApprovedGalleryPhotos(long approvedGalleryPhotos) { this.approvedGalleryPhotos = approvedGalleryPhotos; }

    public boolean isNextcloudStorageConnected() { return nextcloudStorageConnected; }
    public void setNextcloudStorageConnected(boolean nextcloudStorageConnected) { this.nextcloudStorageConnected = nextcloudStorageConnected; }

    public String getNextcloudStatus() { return nextcloudStatus; }
    public void setNextcloudStatus(String nextcloudStatus) { this.nextcloudStatus = nextcloudStatus; }
}
