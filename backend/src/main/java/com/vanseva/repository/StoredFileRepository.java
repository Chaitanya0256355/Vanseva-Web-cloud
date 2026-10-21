package com.vanseva.repository;

import com.vanseva.entity.StoredFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoredFileRepository extends JpaRepository<StoredFile, Long> {
    Optional<StoredFile> findByStoredName(String storedName);
    List<StoredFile> findByCategoryOrderByCreatedAtDesc(String category);
    List<StoredFile> findByUploadedByUserIdOrderByCreatedAtDesc(Long userId);
}
