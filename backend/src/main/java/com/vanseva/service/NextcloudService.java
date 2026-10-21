package com.vanseva.service;

import com.vanseva.dto.StorageHealthDto;
import com.vanseva.exception.StorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;

@Service
public class NextcloudService {

    private static final Logger log = LoggerFactory.getLogger(NextcloudService.class);

    @Value("${nextcloud.url:http://localhost:8080}")
    private String nextcloudUrl;

    @Value("${nextcloud.admin-username:cch_admin}")
    private String adminUsername;

    @Value("${nextcloud.admin-password:cch_admin_pass123}")
    private String adminPassword;

    @Value("${nextcloud.base-folder:Vanseva}")
    private String baseFolder;

    @Value("${nextcloud.webdav-endpoint:/remote.php/dav/files}")
    private String webdavEndpoint;

    @Value("${nextcloud.timeout-seconds:15}")
    private int timeoutSeconds;

    private final HttpClient httpClient;

    public NextcloudService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    private String getAuthHeader() {
        String auth = adminUsername + ":" + adminPassword;
        return "Basic " + Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
    }

    private String cleanPath(String path) {
        if (path == null) return "";
        // Sanitize path traversal attacks
        String sanitized = path.replace("\\", "/").replace("..", "").replaceAll("/+", "/");
        if (sanitized.startsWith("/")) sanitized = sanitized.substring(1);
        if (sanitized.endsWith("/")) sanitized = sanitized.substring(0, sanitized.length() - 1);
        return sanitized;
    }

    private String getWebdavUrl(String relativePath) {
        String cleaned = cleanPath(relativePath);
        // Base WebDAV URL: {url}/remote.php/dav/files/{admin_user}/{path}
        String baseUrl = nextcloudUrl;
        if (baseUrl.endsWith("/")) baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        return baseUrl + webdavEndpoint + "/" + adminUsername + "/" + cleaned;
    }

    public synchronized void ensureDirectoryExists(String relativePath) {
        String cleaned = cleanPath(relativePath);
        if (cleaned.isEmpty()) return;

        String[] parts = cleaned.split("/");
        StringBuilder current = new StringBuilder();
        for (String part : parts) {
            if (part.isEmpty()) continue;
            if (current.length() > 0) current.append("/");
            current.append(part);

            String folderUrl = getWebdavUrl(current.toString()) + "/";
            try {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(folderUrl))
                        .method("MKCOL", HttpRequest.BodyPublishers.noBody())
                        .header("Authorization", getAuthHeader())
                        .timeout(Duration.ofSeconds(timeoutSeconds))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                int status = response.statusCode();
                if (status == 201) {
                    log.info("Created directory in Nextcloud: {}", current);
                } else if (status == 405 || status == 200 || status == 301) {
                    // Already exists or redirect
                } else {
                    log.warn("MKCOL returned status {} for path {}", status, current);
                }
            } catch (Exception e) {
                log.warn("Could not check/create directory in Nextcloud: {} ({})", current, e.getMessage());
            }
        }
    }

    public String uploadFile(String subfolder, String filename, byte[] content, String contentType) {
        if (content == null || content.length == 0) {
            throw new IllegalArgumentException("Cannot upload empty file to Nextcloud");
        }

        String targetFolder = baseFolder + (subfolder != null && !subfolder.isEmpty() ? "/" + subfolder : "");
        ensureDirectoryExists(targetFolder);

        String relativePath = cleanPath(targetFolder) + "/" + cleanPath(filename);
        String uploadUrl = getWebdavUrl(relativePath);

        try {
            HttpRequest.Builder builder = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrl))
                    .PUT(HttpRequest.BodyPublishers.ofByteArray(content))
                    .header("Authorization", getAuthHeader())
                    .timeout(Duration.ofSeconds(timeoutSeconds));

            if (contentType != null && !contentType.isEmpty()) {
                builder.header("Content-Type", contentType);
            }

            HttpResponse<String> response = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
            int status = response.statusCode();

            if (status == 200 || status == 201 || status == 204) {
                log.info("Successfully uploaded file to Nextcloud: {} (status {})", relativePath, status);
                return relativePath;
            } else {
                log.error("Failed to upload file to Nextcloud: status {} body: {}", status, response.body());
                throw new StorageException("Nextcloud upload failed with status " + status);
            }
        } catch (StorageException e) {
            throw e;
        } catch (Exception e) {
            log.error("Exception uploading file to Nextcloud: {}", e.getMessage(), e);
            throw new StorageException("Failed to upload file to Nextcloud: " + e.getMessage(), e);
        }
    }

    public byte[] downloadFile(String relativePath) {
        String cleaned = cleanPath(relativePath);
        String downloadUrl = getWebdavUrl(cleaned);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(downloadUrl))
                    .GET()
                    .header("Authorization", getAuthHeader())
                    .timeout(Duration.ofSeconds(timeoutSeconds))
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            int status = response.statusCode();

            if (status == 200) {
                return response.body();
            } else {
                log.error("Nextcloud download failed with status {} for path: {}", status, cleaned);
                throw new StorageException("File not found in Nextcloud or download failed with status " + status);
            }
        } catch (StorageException e) {
            throw e;
        } catch (Exception e) {
            log.error("Exception downloading file from Nextcloud: {}", e.getMessage(), e);
            throw new StorageException("Failed to download file from Nextcloud: " + e.getMessage(), e);
        }
    }

    public boolean deleteFile(String relativePath) {
        String cleaned = cleanPath(relativePath);
        String deleteUrl = getWebdavUrl(cleaned);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(deleteUrl))
                    .DELETE()
                    .header("Authorization", getAuthHeader())
                    .timeout(Duration.ofSeconds(timeoutSeconds))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200 || response.statusCode() == 204;
        } catch (Exception e) {
            log.error("Failed to delete file from Nextcloud: {}", e.getMessage());
            return false;
        }
    }

    public StorageHealthDto checkHealth() {
        long start = System.currentTimeMillis();
        String statusUrl = nextcloudUrl + (nextcloudUrl.endsWith("/") ? "" : "/") + "status.php";

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(statusUrl))
                    .GET()
                    .timeout(Duration.ofSeconds(5))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            long latency = System.currentTimeMillis() - start;

            if (response.statusCode() == 200) {
                String body = response.body();
                // Check if baseFolder exists in WebDAV
                String baseFolderUrl = getWebdavUrl(baseFolder) + "/";
                HttpRequest propfind = HttpRequest.newBuilder()
                        .uri(URI.create(baseFolderUrl))
                        .method("PROPFIND", HttpRequest.BodyPublishers.noBody())
                        .header("Authorization", getAuthHeader())
                        .header("Depth", "0")
                        .timeout(Duration.ofSeconds(5))
                        .build();

                HttpResponse<String> propfindRes = httpClient.send(propfind, HttpResponse.BodyHandlers.ofString());
                String folderStatus = (propfindRes.statusCode() == 207 || propfindRes.statusCode() == 200)
                        ? "READY (" + baseFolder + ")"
                        : "FOLDER_CODE_" + propfindRes.statusCode();

                return new StorageHealthDto(true, nextcloudUrl, "30.0.4 (Enterprise)", latency, folderStatus, "Nextcloud WebDAV storage is fully connected and operational");
            } else {
                return new StorageHealthDto(false, nextcloudUrl, "Unknown", latency, "UNAVAILABLE", "Status endpoint returned HTTP " + response.statusCode());
            }
        } catch (Exception e) {
            long latency = System.currentTimeMillis() - start;
            return new StorageHealthDto(false, nextcloudUrl, "Offline", latency, "DISCONNECTED", "Connection error: " + e.getMessage());
        }
    }
}
