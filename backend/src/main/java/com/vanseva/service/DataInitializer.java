package com.vanseva.service;

import com.vanseva.entity.*;
import com.vanseva.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final CampaignRepository campaignRepository;
    private final DonationRepository donationRepository;
    private final PlantationGalleryRepository galleryRepository;
    private final StoredFileRepository storedFileRepository;
    private final PasswordEncoder passwordEncoder;
    private final DonationService donationService;
    private final NextcloudService nextcloudService;

    public DataInitializer(UserRepository userRepository,
                           MembershipRepository membershipRepository,
                           CampaignRepository campaignRepository,
                           DonationRepository donationRepository,
                           PlantationGalleryRepository galleryRepository,
                           StoredFileRepository storedFileRepository,
                           PasswordEncoder passwordEncoder,
                           DonationService donationService,
                           NextcloudService nextcloudService) {
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.campaignRepository = campaignRepository;
        this.donationRepository = donationRepository;
        this.galleryRepository = galleryRepository;
        this.storedFileRepository = storedFileRepository;
        this.passwordEncoder = passwordEncoder;
        this.donationService = donationService;
        this.nextcloudService = nextcloudService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Ensure Nextcloud folders are ready
        try {
            nextcloudService.ensureDirectoryExists("Vanseva");
            nextcloudService.ensureDirectoryExists("Vanseva/Memberships");
            nextcloudService.ensureDirectoryExists("Vanseva/PlantationImages");
            nextcloudService.ensureDirectoryExists("Vanseva/DonationDocuments");
            nextcloudService.ensureDirectoryExists("Vanseva/DonationReceipts");
            nextcloudService.ensureDirectoryExists("Vanseva/CampaignMedia");
        } catch (Exception e) {
            log.warn("Nextcloud folder init note: {}", e.getMessage());
        }

        // 1. Initial Administrator
        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin == null) {
            admin = new User("admin", "admin@vanseva.org", passwordEncoder.encode("Admin@Vanseva2026"),
                    "Vanseva National Trustee", "+91 98765 00001", "ROLE_ADMIN");
            admin = userRepository.save(admin);
            log.info("Created primary administrator account: admin / Admin@Vanseva2026");
        }

        // 2. Demo Member
        User member = userRepository.findByUsername("priya.sharma").orElse(null);
        if (member == null) {
            member = new User("priya.sharma", "priya@vanseva.org", passwordEncoder.encode("Member@Vanseva2026"),
                    "Priya Sharma", "+91 98111 22334", "ROLE_MEMBER");
            member = userRepository.save(member);

            Membership membership = new Membership();
            membership.setUser(member);
            membership.setMembershipNumber("VS-MEM-2026-1001");
            membership.setMembershipType("LIFE_MEMBER");
            membership.setStatus("ACTIVE");
            membership.setAddress("42 Blossom Enclave, Indiranagar");
            membership.setCity("Bengaluru");
            membership.setPostalCode("560038");
            membership.setEnvironmentalInterests("Native Reforestation, Soil Rejuvenation, Miyawaki Forest Design");
            membership.setConsentPrivacy(true);
            membership.setApprovedBy(admin.getId());
            membership.setApprovedAt(LocalDateTime.now().minusDays(10));
            membershipRepository.save(membership);
            log.info("Created sample member account: priya.sharma / Member@Vanseva2026");
        }

        // 3. Campaigns
        Campaign c1 = seedCampaign("western-ghats-revival", "Western Ghats Rainforest Revival",
                "Restoring endemic biodiversity in degraded montane evergreen rainforests along the Kodagu and Wayanad ecological corridors.",
                "Coorg & Wayanad Biosphere, Karnataka", 25000, 14200, 16800,
                new BigDecimal("3750000.00"), new BigDecimal("2130000.00"), new BigDecimal("150.00"),
                LocalDate.now().minusMonths(3), LocalDate.now().plusMonths(6));

        Campaign c2 = seedCampaign("aravalli-green-shield", "Aravalli Green Shield Initiative",
                "Combating desertification across northern India by establishing a 5-kilometer native thorn scrub and broadleaf green wall.",
                "Alwar, Sariska & South Delhi Corridor", 50000, 28900, 34500,
                new BigDecimal("6000000.00"), new BigDecimal("3468000.00"), new BigDecimal("120.00"),
                LocalDate.now().minusMonths(5), LocalDate.now().plusMonths(9));

        Campaign c3 = seedCampaign("sundarbans-mangrove-protection", "Sundarbans Coastal Mangrove Protection",
                "Stabilizing cyclone-vulnerable delta embankments with salinity-tolerant Avicennia and Rhizophora mangrove clusters.",
                "Sundarbans Delta, West Bengal", 30000, 19500, 22100,
                new BigDecimal("3000000.00"), new BigDecimal("1950000.00"), new BigDecimal("100.00"),
                LocalDate.now().minusMonths(4), LocalDate.now().plusMonths(5));

        Campaign c4 = seedCampaign("urban-miyawaki-forests", "Urban Miyawaki Dense Forests Initiative",
                "Engineering 100% organic, 30x denser multi-layered mini-forests in high particulate matter zones across Delhi-NCR.",
                "Yamuna Floodplains & Rohini Eco Zone", 15000, 8750, 11200,
                new BigDecimal("3000000.00"), new BigDecimal("1750000.00"), new BigDecimal("200.00"),
                LocalDate.now().minusMonths(2), LocalDate.now().plusMonths(4));

        // 4. Seed Verified Donation for member if none exists
        if (donationRepository.count() == 0 && member != null && c1 != null) {
            Donation d = new Donation();
            d.setDonationReference("VS-DON-2026-1001");
            d.setUser(member);
            d.setDonorName(member.getFullName());
            d.setDonorEmail(member.getEmail());
            d.setDonorPhone(member.getPhone());
            d.setCampaign(c1);
            d.setDonationType("PLANT_SPONSORSHIP");
            d.setPlantCount(20);
            d.setPlantSpecies("Neem (Azadirachta indica) & Banyan");
            d.setAmount(new BigDecimal("3000.00"));
            d.setStatus("CONFIRMED");
            d.setPaymentMethod("OFFLINE_TRANSFER");
            d.setTransactionNotes("Verified RTGS contribution for Western Ghats plantation parcel #4B");
            d.setVerifiedBy(admin.getId());
            d.setVerifiedAt(LocalDateTime.now().minusDays(2));
            d = donationRepository.save(d);

            // Generate official receipt stored in Nextcloud
            try {
                donationService.ensureReceiptGenerated(d);
            } catch (Exception ex) {
                log.warn("Seed receipt generation note: {}", ex.getMessage());
            }

            // Seed second donation
            Donation d2 = new Donation();
            d2.setDonationReference("VS-DON-2026-1002");
            d2.setUser(member);
            d2.setDonorName(member.getFullName());
            d2.setDonorEmail(member.getEmail());
            d2.setDonorPhone(member.getPhone());
            d2.setCampaign(c2);
            d2.setDonationType("MONETARY");
            d2.setPlantCount(0);
            d2.setAmount(new BigDecimal("5000.00"));
            d2.setStatus("AWAITING_VERIFICATION");
            d2.setPaymentMethod("PLEDGE");
            d2.setTransactionNotes("Cheque pledge awaiting bank clearance");
            donationRepository.save(d2);
        }

        // 5. Seed sample gallery photos if empty
        if (galleryRepository.count() == 0 && c1 != null) {
            seedGalleryItem("Sapling Cultivation at Coorg Nursery",
                    "Over 5,000 native saplings nurtured by local community nursery before monsoon transplantation.",
                    "Madikeri, Coorg", c1, "Shorea robusta & Neem", LocalDate.now().minusDays(20), admin);

            seedGalleryItem("Aravalli Ridge Restoration Drive",
                    "Students and volunteers establishing drought-resilient native cover along degraded mining ridge.",
                    "Sariska Buffer, Alwar", c2, "Kikar & Acacia senegal", LocalDate.now().minusDays(35), admin);

            seedGalleryItem("Sundarbans Mudflat Planting",
                    "Women self-help groups securing tidal mudflats with red mangrove prop-root saplings.",
                    "Gosaba Island, Sundarbans", c3, "Rhizophora mucronata", LocalDate.now().minusDays(14), admin);
        }

        log.info("Vanseva initial database seeding completed successfully.");
    }

    private Campaign seedCampaign(String slug, String title, String desc, String loc,
                                  int targetPlants, int planted, int pledged,
                                  BigDecimal targetDon, BigDecimal collectedDon, BigDecimal unitPrice,
                                  LocalDate start, LocalDate end) {
        Campaign c = campaignRepository.findBySlug(slug).orElse(null);
        if (c == null) {
            c = new Campaign();
            c.setSlug(slug);
            c.setTitle(title);
            c.setDescription(desc);
            c.setLocation(loc);
            c.setTargetPlants(targetPlants);
            c.setPlantedPlants(planted);
            c.setPledgedPlants(pledged);
            c.setTargetDonation(targetDon);
            c.setCollectedDonation(collectedDon);
            c.setPlantUnitPrice(unitPrice);
            c.setStatus("ACTIVE");
            c.setStartDate(start);
            c.setEndDate(end);
            c = campaignRepository.save(c);
        }
        return c;
    }

    private void seedGalleryItem(String title, String desc, String loc, Campaign campaign, String species, LocalDate date, User uploader) {
        // Create sample placeholder StoredFile
        String storedName = "seed_" + title.toLowerCase().replaceAll("[^a-z0-9]", "_") + ".jpg";
        StoredFile file = new StoredFile(title + ".jpg", storedName, "Vanseva/PlantationImages/" + storedName,
                "image/jpeg", 256000L, "PLANTATION_IMAGE", uploader.getId(), true);
        file = storedFileRepository.save(file);

        PlantationGallery g = new PlantationGallery();
        g.setTitle(title);
        g.setDescription(desc);
        g.setLocation(loc);
        g.setCampaign(campaign);
        g.setFile(file);
        g.setPlantSpecies(species);
        g.setDatePlanted(date);
        g.setIsApprovedPublic(true);
        g.setUploadedByUser(uploader);
        galleryRepository.save(g);
    }
}
