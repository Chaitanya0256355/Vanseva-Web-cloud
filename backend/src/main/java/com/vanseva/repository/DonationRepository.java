package com.vanseva.repository;

import com.vanseva.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    Optional<Donation> findByDonationReference(String donationReference);
    List<Donation> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Donation> findByDonorEmailOrderByCreatedAtDesc(String email);
    List<Donation> findAllByOrderByCreatedAtDesc();
    List<Donation> findByStatusOrderByCreatedAtDesc(String status);
    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.status = 'CONFIRMED'")
    BigDecimal sumConfirmedDonationAmount();

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d")
    BigDecimal sumTotalPledgedAmount();

    @Query("SELECT COALESCE(SUM(d.plantCount), 0) FROM Donation d WHERE d.status = 'CONFIRMED'")
    Long sumConfirmedPlantCount();

    @Query("SELECT COALESCE(SUM(d.plantCount), 0) FROM Donation d")
    Long sumTotalPledgedPlantCount();
}
