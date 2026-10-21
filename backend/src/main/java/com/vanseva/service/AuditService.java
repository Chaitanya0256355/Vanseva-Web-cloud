package com.vanseva.service;

import com.vanseva.entity.AuditLog;
import com.vanseva.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void record(String eventType, String description, Long userId, String userEmail, String ipAddress, String targetResource, Long recordId) {
        try {
            AuditLog auditLog = new AuditLog(eventType, description, userId, userEmail, ipAddress, targetResource, recordId);
            auditLogRepository.save(auditLog);
            log.info("AUDIT [{}] {} (User: {}, Resource: {} #{})", eventType, description, userEmail, targetResource, recordId);
        } catch (Exception e) {
            log.error("Failed to record audit log: {}", e.getMessage());
        }
    }
}
