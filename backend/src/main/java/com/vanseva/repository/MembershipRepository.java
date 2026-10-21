package com.vanseva.repository;

import com.vanseva.entity.Membership;
import com.vanseva.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    Optional<Membership> findByUser(User user);
    Optional<Membership> findByUserId(Long userId);
    Optional<Membership> findByMembershipNumber(String membershipNumber);
    boolean existsByMembershipNumber(String membershipNumber);
    List<Membership> findByStatus(String status);
    long countByStatus(String status);
}
