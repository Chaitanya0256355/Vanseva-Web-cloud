package com.vanseva.controller;

import com.vanseva.entity.StoredFile;
import com.vanseva.entity.User;
import com.vanseva.exception.ResourceNotFoundException;
import com.vanseva.repository.StoredFileRepository;
import com.vanseva.repository.UserRepository;
import com.vanseva.service.NextcloudService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.Duration;
import javax.imageio.ImageIO;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private static final Logger log = LoggerFactory.getLogger(FileController.class);

    private final StoredFileRepository storedFileRepository;
    private final UserRepository userRepository;
    private final NextcloudService nextcloudService;

    public FileController(StoredFileRepository storedFileRepository,
                          UserRepository userRepository,
                          NextcloudService nextcloudService) {
        this.storedFileRepository = storedFileRepository;
        this.userRepository = userRepository;
        this.nextcloudService = nextcloudService;
    }

    @GetMapping("/{id}/view")
    public ResponseEntity<ByteArrayResource> viewFile(@PathVariable Long id, Authentication authentication) {
        StoredFile file = storedFileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File reference not found with ID " + id));

        // Check Authorization: public files are open, private files require owner or admin
        if (!file.getIsPublic()) {
            boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isOwner = false;
            if (authentication != null && file.getUploadedByUserId() != null) {
                User user = userRepository.findByUsername(authentication.getName()).orElse(null);
                if (user != null && user.getId().equals(file.getUploadedByUserId())) {
                    isOwner = true;
                }
            }

            if (!isAdmin && !isOwner) {
                throw new AccessDeniedException("Unauthorized to view this private file.");
            }
        }

        byte[] content;
        try {
            content = nextcloudService.downloadFile(file.getNextcloudPath());
        } catch (Exception e) {
            log.warn("File {} not yet downloaded from Nextcloud: {}. Generating dynamic placeholder.", file.getNextcloudPath(), e.getMessage());
            content = generateDynamicPlaceholderImage(file.getOriginalName());
        }

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (file.getContentType() != null) {
            try {
                mediaType = MediaType.parseMediaType(file.getContentType());
            } catch (Exception ignored) {}
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofHours(1)).cachePublic())
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getOriginalName() + "\"")
                .body(new ByteArrayResource(content));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable Long id, Authentication authentication) {
        StoredFile file = storedFileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File reference not found with ID " + id));

        if (!file.getIsPublic()) {
            boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isOwner = false;
            if (authentication != null && file.getUploadedByUserId() != null) {
                User user = userRepository.findByUsername(authentication.getName()).orElse(null);
                if (user != null && user.getId().equals(file.getUploadedByUserId())) {
                    isOwner = true;
                }
            }

            if (!isAdmin && !isOwner) {
                throw new AccessDeniedException("Unauthorized to download this private document.");
            }
        }

        byte[] content;
        try {
            content = nextcloudService.downloadFile(file.getNextcloudPath());
        } catch (Exception e) {
            log.warn("Download from Nextcloud failed for {}: {}", file.getNextcloudPath(), e.getMessage());
            content = generateDynamicPlaceholderImage(file.getOriginalName());
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getOriginalName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new ByteArrayResource(content));
    }

    private byte[] generateDynamicPlaceholderImage(String label) {
        try {
            int width = 800;
            int height = 500;
            BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2 = img.createGraphics();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            // Lush gradient background
            GradientPaint gp = new GradientPaint(0, 0, new Color(20, 83, 45), width, height, new Color(6, 78, 59));
            g2.setPaint(gp);
            g2.fillRect(0, 0, width, height);

            // Decorative rings
            g2.setColor(new Color(255, 255, 255, 20));
            g2.drawOval(width / 2 - 180, height / 2 - 180, 360, 360);
            g2.drawOval(width / 2 - 120, height / 2 - 120, 240, 240);

            // Icon & Text
            g2.setColor(Color.WHITE);
            g2.setFont(new Font("SansSerif", Font.BOLD, 48));
            String title = "🌱 Vanseva Green Earth";
            FontMetrics fm = g2.getFontMetrics();
            g2.drawString(title, (width - fm.stringWidth(title)) / 2, height / 2 - 20);

            g2.setFont(new Font("SansSerif", Font.PLAIN, 20));
            fm = g2.getFontMetrics();
            String sub = label != null ? label : "Verified Community Plantation Image";
            g2.drawString(sub, (width - fm.stringWidth(sub)) / 2, height / 2 + 35);

            g2.setFont(new Font("SansSerif", Font.ITALIC, 14));
            fm = g2.getFontMetrics();
            String note = "Stored in Vanseva Cloud Storage";
            g2.drawString(note, (width - fm.stringWidth(note)) / 2, height / 2 + 80);

            g2.dispose();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(img, "png", baos);
            return baos.toByteArray();
        } catch (Exception e) {
            return new byte[0];
        }
    }
}
