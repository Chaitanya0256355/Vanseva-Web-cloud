package com.vanseva.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stored_files")
public class StoredFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_name", nullable = false)
    private String originalName;

    @Column(name = "stored_name", nullable = false, unique = true)
    private String storedName;

    @Column(name = "nextcloud_path", nullable = false, length = 500)
    private String nextcloudPath;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(nullable = false, length = 50)
    private String category; // PROFILE_IMAGE, PLANTATION_IMAGE, DONATION_DOCUMENT, DONATION_RECEIPT, CAMPAIGN_MEDIA

    @Column(name = "uploaded_by_user_id")
    private Long uploadedByUserId;

    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = false;

    @Column(length = 500)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public StoredFile() {}

    public StoredFile(String originalName, String storedName, String nextcloudPath, String contentType, Long fileSize, String category, Long uploadedByUserId, Boolean isPublic) {
        this.originalName = originalName;
        this.storedName = storedName;
        this.nextcloudPath = nextcloudPath;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.category = category;
        this.uploadedByUserId = uploadedByUserId;
        this.isPublic = isPublic != null ? isPublic : false;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOriginalName() { return originalName; }
    public void setOriginalName(String originalName) { this.originalName = originalName; }

    public String getStoredName() { return storedName; }
    public void setStoredName(String storedName) { this.storedName = storedName; }

    public String getNextcloudPath() { return nextcloudPath; }
    public void setNextcloudPath(String nextcloudPath) { this.nextcloudPath = nextcloudPath; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Long getUploadedByUserId() { return uploadedByUserId; }
    public void setUploadedByUserId(Long uploadedByUserId) { this.uploadedByUserId = uploadedByUserId; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
