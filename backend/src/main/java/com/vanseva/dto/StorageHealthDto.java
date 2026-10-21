package com.vanseva.dto;

public class StorageHealthDto {
    private boolean healthy;
    private String nextcloudUrl;
    private String version;
    private long latencyMs;
    private String rootFolderStatus;
    private String message;

    public StorageHealthDto() {}

    public StorageHealthDto(boolean healthy, String nextcloudUrl, String version, long latencyMs, String rootFolderStatus, String message) {
        this.healthy = healthy;
        this.nextcloudUrl = nextcloudUrl;
        this.version = version;
        this.latencyMs = latencyMs;
        this.rootFolderStatus = rootFolderStatus;
        this.message = message;
    }

    public boolean isHealthy() { return healthy; }
    public void setHealthy(boolean healthy) { this.healthy = healthy; }

    public String getNextcloudUrl() { return nextcloudUrl; }
    public void setNextcloudUrl(String nextcloudUrl) { this.nextcloudUrl = nextcloudUrl; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public long getLatencyMs() { return latencyMs; }
    public void setLatencyMs(long latencyMs) { this.latencyMs = latencyMs; }

    public String getRootFolderStatus() { return rootFolderStatus; }
    public void setRootFolderStatus(String rootFolderStatus) { this.rootFolderStatus = rootFolderStatus; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
