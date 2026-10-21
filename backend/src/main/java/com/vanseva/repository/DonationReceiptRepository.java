package com.vanseva.repository;

import com.vanseva.entity.Donation;
import com.vanseva.entity.DonationReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DonationReceiptRepository extends JpaRepository<DonationReceipt, Long> {
    Optional<DonationReceipt> findByReceiptNumber(String receiptNumber);
    Optional<DonationReceipt> findByDonation(Donation donation);
    Optional<DonationReceipt> findByDonationId(Long donationId);
    boolean existsByReceiptNumber(String receiptNumber);
}
