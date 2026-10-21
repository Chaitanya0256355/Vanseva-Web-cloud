package com.vanseva.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.vanseva.entity.Donation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfReceiptService {

    private static final Logger log = LoggerFactory.getLogger(PdfReceiptService.class);

    @Value("${app.organization.name:Vanseva — Green Earth Foundation}")
    private String orgName;

    @Value("${app.organization.registration-number:NGO-DL-2026-ENV-9081}")
    private String regNumber;

    @Value("${app.organization.email:contact@vanseva.org}")
    private String orgEmail;

    @Value("${app.organization.phone:+91 98765 43210}")
    private String orgPhone;

    @Value("${app.organization.address:Vanseva Sanctuary Campus, Eco Park Corridor, New Delhi 110001, India}")
    private String orgAddress;

    @Value("${app.organization.tax-exemption-note:Contributions are acknowledged under environmental plantation CSR guidelines. Official tax deduction certificates are issued upon formal verification.}")
    private String taxNote;

    public byte[] generateDonationReceiptPdf(Donation donation, String receiptNumber) {
        log.info("Generating PDF receipt {} for donation {}", receiptNumber, donation.getDonationReference());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 40, 40);
            PdfWriter.getInstance(document, out);
            document.open();

            // Color Palette
            Color forestGreen = new Color(22, 101, 52); // #166534
            Color emeraldLight = new Color(240, 253, 244); // #f0fdf4
            Color earthDark = new Color(30, 41, 59); // #1e293b
            Color subtleGray = new Color(100, 116, 139); // #64748b
            Color borderColor = new Color(187, 247, 208); // #bbf7d0

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, forestGreen);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, subtleGray);
            Font sectionHeadingFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, forestGreen);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, earthDark);
            Font regularFont = FontFactory.getFont(FontFactory.HELVETICA, 10, earthDark);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 8, subtleGray);

            // Header Banner Table
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{60f, 40f});

            PdfPCell leftHeader = new PdfPCell();
            leftHeader.setBorder(Rectangle.NO_BORDER);
            leftHeader.addElement(new Paragraph("🌱 " + orgName, titleFont));
            leftHeader.addElement(new Paragraph("Preserving Forests • Nurturing Biodiversity • Empowering Communities", subtitleFont));
            leftHeader.addElement(new Paragraph("Reg No: " + regNumber, smallFont));
            headerTable.addCell(leftHeader);

            PdfPCell rightHeader = new PdfPCell();
            rightHeader.setBorder(Rectangle.NO_BORDER);
            rightHeader.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph receiptBadge = new Paragraph("OFFICIAL DONATION RECEIPT", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, forestGreen));
            receiptBadge.setAlignment(Element.ALIGN_RIGHT);
            rightHeader.addElement(receiptBadge);
            Paragraph recNo = new Paragraph("Receipt #: " + receiptNumber, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, earthDark));
            recNo.setAlignment(Element.ALIGN_RIGHT);
            rightHeader.addElement(recNo);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm 'UTC'");
            Paragraph dateP = new Paragraph("Issued: " + java.time.LocalDateTime.now().format(formatter), smallFont);
            dateP.setAlignment(Element.ALIGN_RIGHT);
            rightHeader.addElement(dateP);
            headerTable.addCell(rightHeader);

            document.add(headerTable);

            // Divider Line
            document.add(new Paragraph(" "));
            PdfPTable divider = new PdfPTable(1);
            divider.setWidthPercentage(100);
            PdfPCell divCell = new PdfPCell();
            divCell.setBackgroundColor(forestGreen);
            divCell.setFixedHeight(2.5f);
            divCell.setBorder(Rectangle.NO_BORDER);
            divider.addCell(divCell);
            document.add(divider);
            document.add(new Paragraph(" "));

            // Details Table: Donor Info & Transaction Info
            PdfPTable detailsTable = new PdfPTable(2);
            detailsTable.setWidthPercentage(100);
            detailsTable.setWidths(new float[]{50f, 50f});
            detailsTable.setSpacingBefore(5f);

            // Left: Donor Details
            PdfPCell donorCell = new PdfPCell();
            donorCell.setBackgroundColor(emeraldLight);
            donorCell.setPadding(12f);
            donorCell.setBorderColor(borderColor);
            donorCell.setBorderWidth(1f);
            donorCell.addElement(new Paragraph("DONOR DETAILS", sectionHeadingFont));
            donorCell.addElement(new Paragraph("Name: " + donation.getDonorName(), boldFont));
            donorCell.addElement(new Paragraph("Email: " + donation.getDonorEmail(), regularFont));
            if (donation.getDonorPhone() != null && !donation.getDonorPhone().isBlank()) {
                donorCell.addElement(new Paragraph("Phone: " + donation.getDonorPhone(), regularFont));
            }
            if (donation.getUser() != null) {
                donorCell.addElement(new Paragraph("Vanseva Member: Verified Registered Account", regularFont));
            }
            detailsTable.addCell(donorCell);

            // Right: Donation Meta
            PdfPCell metaCell = new PdfPCell();
            metaCell.setBackgroundColor(emeraldLight);
            metaCell.setPadding(12f);
            metaCell.setBorderColor(borderColor);
            metaCell.setBorderWidth(1f);
            metaCell.addElement(new Paragraph("CONTRIBUTION DETAILS", sectionHeadingFont));
            metaCell.addElement(new Paragraph("Reference: " + donation.getDonationReference(), boldFont));
            metaCell.addElement(new Paragraph("Campaign: " + (donation.getCampaign() != null ? donation.getCampaign().getTitle() : "General Forest Fund"), regularFont));
            metaCell.addElement(new Paragraph("Donation Date: " + (donation.getCreatedAt() != null ? donation.getCreatedAt().format(formatter) : "Verified"), regularFont));
            metaCell.addElement(new Paragraph("Status: " + donation.getStatus() + " (Verified by Vanseva Staff)", boldFont));
            detailsTable.addCell(metaCell);

            document.add(detailsTable);
            document.add(new Paragraph(" "));

            // Line Items Table
            PdfPTable itemsTable = new PdfPTable(4);
            itemsTable.setWidthPercentage(100);
            itemsTable.setWidths(new float[]{45f, 20f, 15f, 20f});
            itemsTable.setSpacingBefore(10f);

            // Table Header
            String[] headers = {"Description / Allocation", "Type", "Quantity", "Amount (INR)"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE)));
                cell.setBackgroundColor(forestGreen);
                cell.setPadding(8f);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                itemsTable.addCell(cell);
            }

            // Table Content
            String desc = "MONETARY".equalsIgnoreCase(donation.getDonationType())
                    ? "Direct contribution toward tree plantation & biodiversity maintenance"
                    : "Sponsorship of " + donation.getPlantSpecies() + " saplings with geotagged cultivation";

            PdfPCell descCell = new PdfPCell(new Phrase(desc, regularFont));
            descCell.setPadding(8f);
            itemsTable.addCell(descCell);

            PdfPCell typeCell = new PdfPCell(new Phrase(donation.getDonationType(), regularFont));
            typeCell.setPadding(8f);
            typeCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            itemsTable.addCell(typeCell);

            String qty = ("PLANT_SPONSORSHIP".equalsIgnoreCase(donation.getDonationType()) && donation.getPlantCount() != null)
                    ? String.valueOf(donation.getPlantCount()) + " Trees"
                    : "1 Contribution";
            PdfPCell qtyCell = new PdfPCell(new Phrase(qty, regularFont));
            qtyCell.setPadding(8f);
            qtyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            itemsTable.addCell(qtyCell);

            PdfPCell amtCell = new PdfPCell(new Phrase("INR " + donation.getAmount().toPlainString(), boldFont));
            amtCell.setPadding(8f);
            amtCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            itemsTable.addCell(amtCell);

            // Total Row
            PdfPCell totalLabel = new PdfPCell(new Phrase("TOTAL VERIFIED CONTRIBUTION:", boldFont));
            totalLabel.setColspan(3);
            totalLabel.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalLabel.setPadding(8f);
            totalLabel.setBackgroundColor(emeraldLight);
            itemsTable.addCell(totalLabel);

            PdfPCell totalValue = new PdfPCell(new Phrase("INR " + donation.getAmount().toPlainString(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, forestGreen)));
            totalValue.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalValue.setPadding(8f);
            totalValue.setBackgroundColor(emeraldLight);
            itemsTable.addCell(totalValue);

            document.add(itemsTable);
            document.add(new Paragraph(" "));

            // Acknowledgment & Impact Section
            PdfPTable ackTable = new PdfPTable(1);
            ackTable.setWidthPercentage(100);
            PdfPCell ackCell = new PdfPCell();
            ackCell.setBackgroundColor(new Color(248, 250, 252));
            ackCell.setPadding(12f);
            ackCell.setBorderColor(new Color(226, 232, 240));

            Paragraph ackTitle = new Paragraph("💚 Gratitude & Environmental Stewardship", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, forestGreen));
            Paragraph ackText = new Paragraph(
                    "On behalf of Vanseva and future generations, thank you for supporting sustainable ecology and green cover restoration. " +
                    "Every tree planted or supported helps restore habitats, conserve native soil, and sequester carbon.", regularFont);
            Paragraph certText = new Paragraph("Legal Compliance Note: " + taxNote, smallFont);

            ackCell.addElement(ackTitle);
            ackCell.addElement(ackText);
            ackCell.addElement(certText);
            ackTable.addCell(ackCell);

            document.add(ackTable);
            document.add(new Paragraph(" "));

            // Footer Section
            PdfPTable footerTable = new PdfPTable(2);
            footerTable.setWidthPercentage(100);
            footerTable.setWidths(new float[]{65f, 35f});

            PdfPCell contactCell = new PdfPCell();
            contactCell.setBorder(Rectangle.NO_BORDER);
            contactCell.addElement(new Paragraph("Vanseva Environmental NGO Platform", boldFont));
            contactCell.addElement(new Paragraph(orgAddress, smallFont));
            contactCell.addElement(new Paragraph("Email: " + orgEmail + " | Phone: " + orgPhone, smallFont));
            contactCell.addElement(new Paragraph("Stored Permanently in Vanseva Cloud Repository", smallFont));
            footerTable.addCell(contactCell);

            PdfPCell signCell = new PdfPCell();
            signCell.setBorder(Rectangle.NO_BORDER);
            signCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph authorizedBy = new Paragraph("Authorized Signatory\nVanseva Board of Trustees", boldFont);
            authorizedBy.setAlignment(Element.ALIGN_RIGHT);
            signCell.addElement(authorizedBy);
            Paragraph seal = new Paragraph("[ Digitally Verified • System Generated ]", smallFont);
            seal.setAlignment(Element.ALIGN_RIGHT);
            signCell.addElement(seal);
            footerTable.addCell(signCell);

            document.add(footerTable);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate PDF receipt: {}", e.getMessage(), e);
            throw new RuntimeException("Receipt PDF generation failed: " + e.getMessage(), e);
        }
    }
}
