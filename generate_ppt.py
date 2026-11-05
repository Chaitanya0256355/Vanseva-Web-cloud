import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette - Eco Cloud Modern
    DARK_BG = RGBColor(16, 42, 28)         # #102A1C
    DARK_CARD = RGBColor(24, 58, 40)       # #183A28
    ACCENT_MINT = RGBColor(74, 222, 128)    # #4ADE80
    ACCENT_LIGHT = RGBColor(187, 247, 208)  # #BBF7D0
    
    LIGHT_BG = RGBColor(247, 250, 248)     # #F7FAF8
    WHITE = RGBColor(255, 255, 255)
    TEXT_MAIN = RGBColor(30, 41, 59)       # #1E293B
    TEXT_MUTED = RGBColor(100, 116, 139)   # #64748B
    PRIMARY_GREEN = RGBColor(26, 84, 46)   # #1A542E
    EMERALD_GREEN = RGBColor(34, 139, 74)  # #228B4A
    CARD_BORDER = RGBColor(226, 232, 240)  # #E2E8F0
    CARD_BG = RGBColor(255, 255, 255)
    CARD_LIGHT_TINT = RGBColor(240, 249, 243) # #F0F9F3
    CODE_BG = RGBColor(30, 41, 59)

    def add_header(slide, title_text, category_text="VANSEVA CLOUD COMPUTING PoC"):
        # Category / Badge
        badge_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(8), Inches(0.4))
        tf_b = badge_box.text_frame
        tf_b.word_wrap = True
        tf_b.margin_left = tf_b.margin_right = tf_b.margin_top = tf_b.margin_bottom = 0
        p_b = tf_b.paragraphs[0]
        p_b.text = category_text.upper()
        p_b.font.size = Pt(11)
        p_b.font.bold = True
        p_b.font.color.rgb = EMERALD_GREEN

        # Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.8))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_right = tf_t.margin_top = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_MAIN

        # Divider line
        shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.65), Inches(11.733), Inches(0.02))
        shape.fill.solid()
        shape.fill.fore_color.rgb = CARD_BORDER
        shape.line.fill.background()

    def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1)
        else:
            card.line.fill.background()
        return card

    # ==========================================
    # SLIDE 1: Title Slide (Dark Theme)
    # ==========================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = DARK_BG
    bg1.line.fill.background()

    # Title & Subtitle Box
    t_box = slide1.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.333), Inches(3.2))
    tf1 = t_box.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "🌱 CLOUD COMPUTING PROOF OF CONCEPT"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = ACCENT_MINT
    p0.space_after = Pt(14)

    p1 = tf1.add_paragraph()
    p1.text = "VANSEVA : Green Earth & Plantation Platform"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1.space_after = Pt(12)

    p2 = tf1.add_paragraph()
    p2.text = "Enterprise-Grade Microservices Architecture with Nextcloud Private Cloud Object Storage, Docker Orchestration & Automated 80G Tax Receipts"
    p2.font.size = Pt(16)
    p2.font.color.rgb = ACCENT_LIGHT
    p2.space_after = Pt(20)

    # Info Card in Title Slide
    card_info = add_card(slide1, Inches(1.0), Inches(4.5), Inches(11.333), Inches(2.2), DARK_CARD, None)
    ibox = slide1.shapes.add_textbox(Inches(1.3), Inches(4.7), Inches(10.7), Inches(1.8))
    itf = ibox.text_frame
    itf.word_wrap = True

    ip1 = itf.paragraphs[0]
    ip1.text = "PROJECT METADATA & REPOSITORY"
    ip1.font.size = Pt(12)
    ip1.font.bold = True
    ip1.font.color.rgb = ACCENT_MINT
    ip1.space_after = Pt(8)

    ip2 = itf.add_paragraph()
    ip2.text = "• Developer & Lead Architect: Chaitanya (Chaitanya0256355)"
    ip2.font.size = Pt(14)
    ip2.font.color.rgb = WHITE
    ip2.space_after = Pt(4)

    ip3 = itf.add_paragraph()
    ip3.text = "• GitHub Repository: https://github.com/Chaitanya0256355/Vanseva-Web-cloud"
    ip3.font.size = Pt(14)
    ip3.font.bold = True
    ip3.font.color.rgb = ACCENT_MINT
    ip3.space_after = Pt(4)

    ip4 = itf.add_paragraph()
    ip4.text = "• Core Technologies: Spring Boot 3 (Java 21) | React 18 (TypeScript) | Nextcloud WebDAV | Docker Compose | MySQL 8.4 | Redis"
    ip4.font.size = Pt(13)
    ip4.font.color.rgb = ACCENT_LIGHT

    # Speaker notes
    slide1.notes_slide.notes_text_frame.text = (
        "Welcome examiners and reviewers. Today I am presenting Vanseva, a comprehensive Cloud Computing "
        "Proof of Concept. This project demonstrates how an NGO eco-stewardship platform leverages distributed "
        "cloud computing, private object storage via Nextcloud WebDAV, and containerized microservices to solve "
        "real-world afforestation and compliance challenges. The full source code is hosted on GitHub at "
        "https://github.com/Chaitanya0256355/Vanseva-Web-cloud."
    )

    # ==========================================
    # SLIDE 2: Problem Statement & Motivation
    # ==========================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "Project Motivation & Real-World Problem Statement", "EXECUTIVE SUMMARY")

    # 3 Cards Layout
    c1 = add_card(slide2, Inches(0.8), Inches(1.9), Inches(3.64), Inches(4.8), CARD_LIGHT_TINT)
    c2 = add_card(slide2, Inches(4.84), Inches(1.9), Inches(3.64), Inches(4.8))
    c3 = add_card(slide2, Inches(8.88), Inches(1.9), Inches(3.64), Inches(4.8), CARD_LIGHT_TINT)

    # Card 1: The Environmental Challenge
    tb1 = slide2.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(3.24), Inches(4.4))
    tf = tb1.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🌲 THE ENVIRONMENTAL GAP"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(12)

    bullets1 = [
        "Deforestation & Carbon Imbalance: Rapid urban expansion demands verified, tracked afforestation campaigns.",
        "Donor Trust Deficit: Donors lack visual, geotagged proof that their sponsored saplings were actually planted.",
        "Manual NGO Workflows: Reliance on paper receipts and delayed tax benefit distribution creates severe operational friction."
    ]
    for b in bullets1:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(10)

    # Card 2: The Technical Anti-Patterns
    tb2 = slide2.shapes.add_textbox(Inches(5.04), Inches(2.1), Inches(3.24), Inches(4.4))
    tf = tb2.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⚠️ THE TECHNICAL PROBLEMS"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = RGBColor(194, 65, 12)
    p.space_after = Pt(12)

    bullets2 = [
        "Monolithic Database Bloat: Storing heavy photos & PDF certificates inside MySQL as BLOBs chokes I/O performance.",
        "Single Point of Failure: Traditional web architectures lack fault tolerance across storage, compute, and web tiers.",
        "Uncontrolled File Access: Local disk file saving fails to scale, lacks access quotas, and lacks audit trails."
    ]
    for b in bullets2:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(10)

    # Card 3: The Vanseva Cloud Solution
    tb3 = slide2.shapes.add_textbox(Inches(9.08), Inches(2.1), Inches(3.24), Inches(4.4))
    tf = tb3.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "✅ THE VANSEVA CLOUD SOLUTION"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(12)

    bullets3 = [
        "Decoupled Object Storage: Offloads all media and generated 80G tax receipts to Nextcloud private cloud over WebDAV.",
        "Microservices & Docker: Multi-container orchestration isolates compute, presentation, database, and cache layers.",
        "Automated Compliance Engine: Instant on-the-fly PDF receipt hashing with cryptographic verification."
    ]
    for b in bullets3:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(10)

    slide2.notes_slide.notes_text_frame.text = (
        "In Slide 2, we present the core problem. Conventional NGO applications store photos and receipts directly "
        "inside database BLOBs or unmanaged local disk folders, leading to high latency and database crashes. "
        "Vanseva solves this through an enterprise cloud architecture separating compute from storage."
    )

    # ==========================================
    # SLIDE 3: The 3 Pillars of Cloud Computing (NIST Model)
    # ==========================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "What Makes This a Cloud Project? The 3 NIST Pillars", "CORE CLOUD COMPUTING CONCEPTS")

    c1 = add_card(slide3, Inches(0.8), Inches(1.9), Inches(3.64), Inches(4.8))
    c2 = add_card(slide3, Inches(4.84), Inches(1.9), Inches(3.64), Inches(4.8), CARD_LIGHT_TINT)
    c3 = add_card(slide3, Inches(8.88), Inches(1.9), Inches(3.64), Inches(4.8))

    # Pillar 1: Compute
    tb = slide3.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(3.24), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "1. CLOUD COMPUTE"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Dynamic processing across isolated virtual runtimes:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    pts1 = [
        "Spring Boot 3 (Port 8081): Executes donation logic, 80G tax calculation, and WebDAV orchestration.",
        "Nginx Presentation Server (Port 3000): Serves optimized SPA assets and handles ingress routing.",
        "Nextcloud PHP-FPM Engine: Computes cryptographic ETags, SHA-256 hashes, and user storage quotas.",
        "Redis In-Memory Engine: Instant session state lookup and rate-limiting compute."
    ]
    for pt in pts1:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(8)

    # Pillar 2: Storage
    tb = slide3.shapes.add_textbox(Inches(5.04), Inches(2.1), Inches(3.24), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "2. CLOUD STORAGE"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Multi-tier decoupled storage strategy:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    pts2 = [
        "Private Object Store (Nextcloud): Stores uncompressed plantation photos, KYC documents, and generated 80G PDFs.",
        "Relational Store (MySQL 8.4): Fast tabular indexing of user credentials, donations, and campaign state.",
        "Catalog Store (MariaDB): Manages Nextcloud oc_filecache, MIME types, and storage mount points.",
        "Persistent Volumes: Host-mapped Docker named volumes guarantee zero data loss across reboots."
    ]
    for pt in pts2:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(8)

    # Pillar 3: Networking
    tb = slide3.shapes.add_textbox(Inches(9.08), Inches(2.1), Inches(3.24), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "3. CLOUD NETWORKING"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Software-Defined Virtual Private Cloud:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    pts3 = [
        "Isolated Bridge Network ('cch-network'): Microservices communicate via internal virtual subnet.",
        "Automated Cloud DNS Discovery: Services resolve peers by container name (e.g., 'http://cch-nextcloud:80', 'cch-portal-mysql:3306').",
        "Ingress Reverse Proxy: Only Nginx (3000) and Nextcloud (8080) are exposed; backend databases are invisible to external WAN."
    ]
    for pt in pts3:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(8)

    slide3.notes_slide.notes_text_frame.text = (
        "Examiners frequently ask: 'What makes this a cloud project rather than just a website?' "
        "Here are the 3 NIST pillars: Cloud Compute across 4 independent engines, Cloud Storage with a dedicated "
        "Nextcloud WebDAV object tier, and Cloud Networking with a private bridge network and internal DNS."
    )

    # ==========================================
    # SLIDE 4: Architecture & Data Flow Diagram
    # ==========================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "End-to-End System Architecture & Traffic Flow", "INFRASTRUCTURE TOPOLOGY")

    # Main Architecture Diagram Cards
    top_c = add_card(slide4, Inches(0.8), Inches(1.9), Inches(11.733), Inches(1.1), CARD_LIGHT_TINT)
    tb = slide4.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(11.333), Inches(0.9))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "CLIENT LAYER (Public Donors, Eco-Guardians & National Trustees)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p = tf.add_paragraph()
    p.text = "React 18 SPA (TypeScript) | Responsive Mobile-First UI | Lucide Icons | Axios REST Client"
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_MAIN

    # Middle Row: Ingress & Compute
    mid_left = add_card(slide4, Inches(0.8), Inches(3.2), Inches(5.666), Inches(1.6))
    tb = slide4.shapes.add_textbox(Inches(1.0), Inches(3.3), Inches(5.266), Inches(1.4))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "INGRESS & WEB SERVER: vanseva-frontend (:3000)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p = tf.add_paragraph()
    p.text = "• Nginx on Alpine Linux • Serves static production assets\n• Reverse-proxies /api/* to Spring Boot • SSL/TLS Termination ready"
    p.font.size = Pt(11.5)
    p.font.color.rgb = TEXT_MAIN

    mid_right = add_card(slide4, Inches(6.866), Inches(3.2), Inches(5.666), Inches(1.6))
    tb = slide4.shapes.add_textbox(Inches(7.066), Inches(3.3), Inches(5.266), Inches(1.4))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "COMPUTE ENGINE: vanseva-backend (:8081)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p = tf.add_paragraph()
    p.text = "• Spring Boot 3.3.4 (Java 21) • Spring Security 6 (JWT / Cookies)\n• OpenPDF 80G Receipt Generator • Sardine WebDAV Client integration"
    p.font.size = Pt(11.5)
    p.font.color.rgb = TEXT_MAIN

    # Bottom Row: 3 Data & Storage Services
    bot1 = add_card(slide4, Inches(0.8), Inches(5.0), Inches(3.64), Inches(1.8), CARD_LIGHT_TINT)
    tb = slide4.shapes.add_textbox(Inches(1.0), Inches(5.1), Inches(3.24), Inches(1.6))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "STRUCTURED SQL TIER"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p = tf.add_paragraph()
    p.text = "MySQL 8.4 (cch-portal-mysql)\n• Users & BCrypt Credentials\n• Campaigns & Donations\n• Volume: cch_mysql_data"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MAIN

    bot2 = add_card(slide4, Inches(4.84), Inches(5.0), Inches(3.64), Inches(1.8), CARD_LIGHT_TINT)
    tb = slide4.shapes.add_textbox(Inches(5.04), Inches(5.1), Inches(3.24), Inches(1.6))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "PRIVATE OBJECT STORAGE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p = tf.add_paragraph()
    p.text = "Nextcloud 30 (cch-nextcloud)\n• WebDAV API over HTTP (:8080)\n• 80G Receipts & High-Res Photos\n• Volume: nextcloud_data"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MAIN

    bot3 = add_card(slide4, Inches(8.88), Inches(5.0), Inches(3.64), Inches(1.8), CARD_LIGHT_TINT)
    tb = slide4.shapes.add_textbox(Inches(9.08), Inches(5.1), Inches(3.24), Inches(1.6))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "CACHE & METADATA"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p = tf.add_paragraph()
    p.text = "Redis 7.4 + MariaDB 10.11\n• In-memory session validation\n• Nextcloud oc_filecache catalog\n• Volume: cch_nextcloud_db_data"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MAIN

    slide4.notes_slide.notes_text_frame.text = (
        "Here we show the complete request pipeline. Requests hit Nginx on port 3000, which proxies /api requests "
        "to Spring Boot on port 8081. Spring Boot queries MySQL for tabular data, streams receipts and photos to "
        "Nextcloud WebDAV, and verifies sessions using Redis. No database port is exposed to the public internet."
    )

    # ==========================================
    # SLIDE 5: 6 Docker Containers Breakdown
    # ==========================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "Containerized Orchestration: The 6 Microservices", "DOCKER CLUSTER BREAKDOWN")

    # Table of containers
    rows = 7
    cols = 5
    left = Inches(0.8)
    top = Inches(1.9)
    width = Inches(11.733)
    height = Inches(4.8)

    table_shape = slide5.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table

    table.columns[0].width = Inches(2.2)
    table.columns[1].width = Inches(2.1)
    table.columns[2].width = Inches(1.4)
    table.columns[3].width = Inches(3.7)
    table.columns[4].width = Inches(2.333)

    headers = ["Container Name", "Base Image", "Host Port", "Internal Role / Responsibilities", "Persistent Storage"]
    for col_idx, h in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = PRIMARY_GREEN
        p = cell.text_frame.paragraphs[0]
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = WHITE

    data = [
        ("vanseva-frontend", "nginx:alpine", "3000", "Serves compiled React SPA assets, reverse proxy for /api/*", "Read-only image layers"),
        ("vanseva-backend", "openjdk:17-slim", "8081", "Core Spring Boot REST API, PDF generation, WebDAV calls", "Ephemeral container runtime"),
        ("cch-portal-mysql", "mysql:8.0", "3306", "Relational database: users, donations, campaigns, files metadata", "Named volume: cch_mysql_data"),
        ("cch-nextcloud", "nextcloud:28-apache", "8080", "Private cloud storage server, WebDAV REST API, quotas", "Named volume: nextcloud_data"),
        ("cch-nextcloud-db", "mariadb:10.11", "Internal", "Nextcloud internal file metadata catalog (oc_filecache)", "Named volume: cch_nc_db_data"),
        ("cch-redis", "redis:7-alpine", "Internal", "In-memory caching, user session states, fast rate limiting", "In-memory volatile")
    ]

    for row_idx, row_data in enumerate(data):
        for col_idx, cell_value in enumerate(row_data):
            cell = table.cell(row_idx + 1, col_idx)
            cell.text = cell_value
            cell.fill.solid()
            if row_idx % 2 == 0:
                cell.fill.fore_color.rgb = RGBColor(248, 250, 252)
            else:
                cell.fill.fore_color.rgb = WHITE
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(10.5)
            p.font.color.rgb = TEXT_MAIN

    slide5.notes_slide.notes_text_frame.text = (
        "Examiners frequently ask for details about the Docker Compose configuration. "
        "Here are all 6 microservices. Notice that internal databases (Redis and MariaDB) don't even have "
        "host ports mapped, preserving zero-trust network isolation. All application state is preserved "
        "in Docker named volumes."
    )

    # ==========================================
    # SLIDE 6: Nextcloud Private Cloud Object Storage
    # ==========================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "Private Cloud Storage: Nextcloud & WebDAV Integration", "CLOUD STORAGE ARCHITECTURE")

    # Left Card: The 3-Step Storage Lifecycle
    c_left = add_card(slide6, Inches(0.8), Inches(1.9), Inches(5.666), Inches(4.8))
    tb = slide6.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(5.266), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "THE 3-STEP STORAGE PIPELINE"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(10)

    steps = [
        "Step 1: Physical File on Disk\nNextcloud writes raw binaries directly to host-backed Docker named volume:\n• Receipts: .../Vanseva/DonationReceipts/VS-REC-1001.pdf\n• Gallery: .../Vanseva/PlantationImages/sapling_01.jpg",
        "Step 2: Metadata Cataloging in MariaDB\nNextcloud immediately indexes the file in table 'oc_filecache' with File ID, MIME type, byte size, and SHA-256 ETag hash.",
        "Step 3: Portal Linking in MySQL\nSpring Boot creates a record in 'stored_files' containing the relative WebDAV path, uploader ID, and permission scope. Frontend streams files via backend proxy without exposing Nextcloud credentials."
    ]
    for s in steps:
        p = tf.add_paragraph()
        p.text = s
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(10)

    # Right Card: Directory Hierarchy & Benefits
    c_right = add_card(slide6, Inches(6.866), Inches(1.9), Inches(5.666), Inches(4.8), CARD_LIGHT_TINT)
    tb = slide6.shapes.add_textbox(Inches(7.066), Inches(2.1), Inches(5.266), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "DIRECTORY STRUCTURE & CLOUD ADVANTAGES"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Nextcloud Storage Hierarchy:\n" \
             "📁 Nextcloud/Vanseva/\n" \
             "  ├── 📂 Campaigns/          (Promotional campaign media)\n" \
             "  ├── 📂 DonationDocuments/  (Donor bank transfer proofs)\n" \
             "  ├── 📂 DonationReceipts/   (Automated 80G tax PDFs)\n" \
             "  ├── 📂 Memberships/        (Eco-Guardian KYC docs)\n" \
             "  └── 📂 PlantationImages/   (Geotagged verified field photos)"
    p.font.size = Pt(11)
    p.font.color.rgb = CODE_BG
    p.space_after = Pt(12)

    advantages = [
        "Why Not MySQL BLOBs? Prevents database fragmentation and eliminates 16MB max_allowed_packet limits.",
        "Private On-Premise Cloud: Zero recurring AWS S3 egress costs while maintaining enterprise WebDAV compliance.",
        "Access Quotas & Versioning: Native file versioning and rollback in case of accidental corruption."
    ]
    for adv in advantages:
        p = tf.add_paragraph()
        p.text = "✓ " + adv
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(8)

    slide6.notes_slide.notes_text_frame.text = (
        "Explain the 3-step storage pipeline: Physical storage on the Docker volume, indexing in MariaDB oc_filecache, "
        "and pointer registration in MySQL. This architecture cleanly separates heavy file streaming from relational "
        "query execution."
    )

    # ==========================================
    # SLIDE 7: Key Functional Modules
    # ==========================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_header(slide7, "Core Functional Modules of the Vanseva Platform", "FEATURE HIGHLIGHTS")

    # 4 Cards in 2x2 Grid
    cards_data = [
        ("🌲 Tree Sponsorship Engine", "• Dynamic sapling cost & tax break calculations\n• Real-time progress bars for afforestation targets\n• Multi-tier campaign funding: Western Ghats, Aravalli, Sundarbans\n• Donor allocation to specific verified GPS plantation sites"),
        ("📜 Automated 80G Tax Receipts", "• Generated instantly upon payment verification using OpenPDF\n• Computes cryptographic hash to guarantee tamper-proof audit\n• Auto-uploaded to Nextcloud WebDAV '/DonationReceipts'\n• Instant one-click PDF download for tax deduction under 80G"),
        ("🛡️ Eco-Guardian Membership", "• Multi-tier community registration (Green Scout, Forest Warden, Earth Trustee)\n• Environmental interest tagging & automated digital membership ID\n• Donor KYC verification and secure document archiving in Nextcloud"),
        ("📸 Geotagged Plantation Gallery", "• Live community showcase of real plantation progress\n• Multi-status moderation workflow (PENDING, APPROVED, REJECTED)\n• Direct streaming from Nextcloud storage via Spring WebDAV client\n• High-resolution photo zoom and metadata inspection")
    ]

    coords = [
        (Inches(0.8), Inches(1.9)),
        (Inches(6.866), Inches(1.9)),
        (Inches(0.8), Inches(4.4)),
        (Inches(6.866), Inches(4.4))
    ]

    for idx, (title, content) in enumerate(cards_data):
        x, y = coords[idx]
        add_card(slide7, x, y, Inches(5.666), Inches(2.3))
        tb = slide7.shapes.add_textbox(x + Inches(0.2), y + Inches(0.15), Inches(5.266), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_GREEN
        p.space_after = Pt(6)

        p = tf.add_paragraph()
        p.text = content
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN

    slide7.notes_slide.notes_text_frame.text = (
        "Highlight the 4 key functional pillars: The donation calculation engine, the automated 80G tax receipt "
        "generator, the Eco-Guardian community portal, and the geotagged plantation photo gallery with admin moderation."
    )

    # ==========================================
    # SLIDE 8: Security Architecture & Cryptography
    # ==========================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_header(slide8, "Security Architecture: Authentication & Cryptography", "SECURITY CONTROLS")

    c1 = add_card(slide8, Inches(0.8), Inches(1.9), Inches(5.666), Inches(4.8), CARD_LIGHT_TINT)
    tb1 = slide8.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(5.266), Inches(4.4))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "🔐 AUTHENTICATION & CREDENTIAL SECURITY"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(10)

    auth_pts = [
        "One-Way BCrypt Hashing: Passwords are encrypted using BCrypt with 10 salt rounds. Plaintext passwords never exist in database tables or log files.",
        "HttpOnly Session Security: Issues encrypted 'VANSEVA_SESSION' cookie with HttpOnly, Secure, and SameSite=Lax flags, preventing Cross-Site Scripting (XSS) credential theft.",
        "Role-Based Access Control (RBAC):\n• ROLE_USER: Eco-Guardian member portal, pledge history, receipt download.\n• ROLE_ADMIN: National trustee dashboard, donation reconciliation, WebDAV diagnostics.",
        "Session Invalidation: Instant revocation across Redis and memory upon logout, blocking browser back-button replay attacks."
    ]
    for pt in auth_pts:
        p = tf1.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(8)

    c2 = add_card(slide8, Inches(6.866), Inches(1.9), Inches(5.666), Inches(4.8))
    tb2 = slide8.shapes.add_textbox(Inches(7.066), Inches(2.1), Inches(5.266), Inches(4.4))
    tf2 = tb2.text_frame
    tf2.word_wrap = True

    p = tf2.paragraphs[0]
    p.text = "🛡️ CLOUD ISOLATION & AUDIT CONTROLS"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(10)

    sec_pts = [
        "Dedicated Cloud Service Account: Spring Boot interacts with Nextcloud via an isolated internal service account ('cch_admin'). Donors never receive raw Nextcloud credentials.",
        "Immutable Audit Logging: Every financial pledge, verification, role change, and file upload triggers an unalterable record in the 'audit_logs' table.",
        "CORS & CSRF Defense: Custom Spring Security filter chains validate origin headers and reject unauthorized cross-domain payloads.",
        "Zero Database WAN Exposure: MySQL (3306) and Nextcloud DB are accessible only within the Docker internal bridge network."
    ]
    for pt in sec_pts:
        p = tf2.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(8)

    slide8.notes_slide.notes_text_frame.text = (
        "Address the crucial security defense questions: How are passwords protected? BCrypt with salt rounds 10. "
        "How are sessions protected? HttpOnly cookies with Redis cache validation. How is storage access protected? "
        "Through an internal service account proxy."
    )

    # ==========================================
    # SLIDE 9: Multi-Tier Storage Comparison
    # ==========================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_header(slide9, "Data Architecture: Multi-Tier Storage Strategy", "STORAGE STRATEGY COMPARISON")

    # Table comparing storage strategies
    rows = 6
    cols = 4
    table_shape = slide9.shapes.add_table(rows, cols, Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    table = table_shape.table

    table.columns[0].width = Inches(2.5)
    table.columns[1].width = Inches(2.2)
    table.columns[2].width = Inches(3.5)
    table.columns[3].width = Inches(3.533)

    headers = ["Storage Tier", "Technology", "Stored Data Types", "Cloud Engineering Rationale"]
    for col_idx, h in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = PRIMARY_GREEN
        p = cell.text_frame.paragraphs[0]
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = WHITE

    tier_data = [
        ("Private Object Storage", "Nextcloud 30 (WebDAV)", "80G PDF Receipts, KYC proofs, high-res plantation photos", "Eliminates database BLOB bloat; supports file streaming, quotas, and native checksum verification."),
        ("Relational Database", "MySQL 8.4 Enterprise", "User profiles, campaigns, donation records, file pointers", "ACID transactions for donation tallies and financial accounting; indexed foreign-key relationships."),
        ("Cloud Catalog Store", "MariaDB 10.11", "Nextcloud oc_filecache, permissions, mount configurations", "Maintains file metadata separately from binary content, allowing instant file lookups by path."),
        ("In-Memory Volatile Cache", "Redis 7.4 Alpine", "Session tokens, login states, rate-limiting counters", "Sub-millisecond latency for authentication validation and duplicate donation submission locks."),
        ("Host Persistent Volume", "Docker Named Volumes", "Raw physical files, MySQL tables, MariaDB data files", "Guarantees data durability across container restarts, upgrades, and system shutdowns.")
    ]

    for row_idx, row_values in enumerate(tier_data):
        for col_idx, val in enumerate(row_values):
            cell = table.cell(row_idx + 1, col_idx)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(248, 250, 252) if row_idx % 2 == 0 else WHITE
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(10.5)
            p.font.color.rgb = TEXT_MAIN

    slide9.notes_slide.notes_text_frame.text = (
        "This slide directly answers why multiple database and storage engines are used. "
        "Each engine handles what it is optimized for: MySQL for relational ACID transactions, Nextcloud for "
        "unstructured binary storage, Redis for fast in-memory caching, and Docker volumes for physical persistence."
    )

    # ==========================================
    # SLIDE 10: REST API & Integration Matrix
    # ==========================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_header(slide10, "REST API Endpoints & Nextcloud WebDAV Integration", "INTERFACE SPECIFICATIONS")

    c1 = add_card(slide10, Inches(0.8), Inches(1.9), Inches(5.666), Inches(4.8))
    tb1 = slide10.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(5.266), Inches(4.4))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "CORE SPRING BOOT REST ENDPOINTS"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(10)

    apis = [
        "POST /api/auth/login\nAuthenticates credentials via BCrypt, issues secure HTTP-only session cookie.",
        "POST /api/donations/pledge\nCreates tree donation pledge with live amount & sapling count calculation.",
        "GET /api/donations/{id}/receipt/download\nStreams official 80G tax PDF from Nextcloud WebDAV to user.",
        "GET /api/gallery\nReturns verified geotagged plantation photographs with Nextcloud streaming URLs.",
        "GET /api/admin/overview-stats\nReturns total saplings planted, active campaigns, and donation totals.",
        "GET /api/admin/storage/health\nReal-time diagnostic probe testing Nextcloud WebDAV ping & latency."
    ]
    for api in apis:
        p = tf1.add_paragraph()
        p.text = "• " + api
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(6)

    c2 = add_card(slide10, Inches(6.866), Inches(1.9), Inches(5.666), Inches(4.8), CARD_LIGHT_TINT)
    tb2 = slide10.shapes.add_textbox(Inches(7.066), Inches(2.1), Inches(5.266), Inches(4.4))
    tf2 = tb2.text_frame
    tf2.word_wrap = True

    p = tf2.paragraphs[0]
    p.text = "WEBDAV PROTOCOL INTERACTIONS"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(10)

    webdav_steps = [
        "1. WebDAV PUT (File Ingestion):\nSpring Boot uses Sardine WebDAV library to upload generated 80G PDF receipts directly to Nextcloud remote endpoint:\nhttp://cch-nextcloud:80/remote.php/dav/files/cch_admin/Vanseva/...",
        "2. WebDAV GET (File Retrieval):\nWhen donor requests a receipt, backend streams byte chunks from Nextcloud to browser response output stream with 'Content-Disposition: attachment'.",
        "3. WebDAV PROPFIND (Health & Folder Probing):\nBackend diagnostics execute PROPFIND requests to verify folder accessibility, free storage quota, and response latency in milliseconds."
    ]
    for s in webdav_steps:
        p = tf2.add_paragraph()
        p.text = s
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(10)

    slide10.notes_slide.notes_text_frame.text = (
        "Demonstrate the technical implementation of WebDAV: PUT requests for uploading files, GET for streaming, "
        "and PROPFIND for cloud health monitoring."
    )

    # ==========================================
    # SLIDE 11: Deployment & DevOps Workflow
    # ==========================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_header(slide11, "Deployment & DevOps: Declarative Cloud Orchestration", "CI/CD & DEVOPS")

    c1 = add_card(slide11, Inches(0.8), Inches(1.9), Inches(5.666), Inches(4.8), CARD_LIGHT_TINT)
    tb1 = slide11.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(5.266), Inches(4.4))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "🚀 ONE-COMMAND DOCKER ORCHESTRATION"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(10)

    p = tf1.add_paragraph()
    p.text = "Start all 6 services with automated networking:\n" \
             "$ docker compose up -d --build\n\n" \
             "Verify running cluster:\n" \
             "$ docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
    p.font.size = Pt(11)
    p.font.color.rgb = CODE_BG
    p.space_after = Pt(12)

    devops_pts = [
        "Multi-Stage Docker Builds: React frontend is compiled inside a Node 20 builder and copied to an ultralight Alpine Nginx runtime (reduces image size by 85%).",
        "Environment Decoupling (.env): Database passwords, WebDAV credentials, and secret tokens are injected dynamically via environment variables without hardcoding in Git."
    ]
    for pt in devops_pts:
        p = tf1.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(8)

    c2 = add_card(slide11, Inches(6.866), Inches(1.9), Inches(5.666), Inches(4.8))
    tb2 = slide11.shapes.add_textbox(Inches(7.066), Inches(2.1), Inches(5.266), Inches(4.4))
    tf2 = tb2.text_frame
    tf2.word_wrap = True

    p = tf2.paragraphs[0]
    p.text = "📈 HEALTH PROBES & MONITORING"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_GREEN
    p.space_after = Pt(10)

    mon_pts = [
        "Spring Boot Actuator: Live health probe at '/actuator/health' monitors database connection pooling, disk space, and JVM heap consumption.",
        "Nextcloud Storage Diagnostics: Administrator dashboard displays real-time WebDAV round-trip latency, connection state, and folder hierarchy status.",
        "Zero-Downtime Volume Persistence: Data volumes remain intact on the host OS even when containers are stopped, removed, or updated.",
        "Disaster Recovery Ready: Simple volume snapshotting enables instantaneous backup of all MySQL tables and Nextcloud documents."
    ]
    for pt in mon_pts:
        p = tf2.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(10)

    slide11.notes_slide.notes_text_frame.text = (
        "Explain how simple it is to deploy this enterprise architecture: A single Docker Compose command builds "
        "and boots the entire 6-container cluster. Multi-stage builds keep image sizes small and secure."
    )

    # ==========================================
    # SLIDE 12: Examiner Rapid-Fire Viva Q&A
    # ==========================================
    slide12 = prs.slides.add_slide(blank_layout)
    add_header(slide12, "Examiner Rapid-Fire Defense Q&A", "PROJECT DEFENSE PREPARATION")

    c = add_card(slide12, Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    tb = slide12.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(11.333), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True

    qas = [
        ("Q1: In one sentence, why is this an authentic Cloud Computing project?",
         "A1: It implements all three NIST cloud computing pillars: containerized multi-engine compute, private object storage via Nextcloud WebDAV, and software-defined virtual network isolation."),
        ("Q2: Why didn't you just save photos and PDFs in a local computer folder?",
         "A2: Local folders create tight coupling to a single machine, fail to scale in distributed clusters, and lack cloud-native capabilities like WebDAV REST APIs, quota management, and cryptographic ETags."),
        ("Q3: What happens if the backend or database container crashes? Is data lost?",
         "A3: No data is lost. Container runtimes are stateless; all persistent state resides safely in Docker named volumes (cch_mysql_data, nextcloud_data, cch_nc_db_data) on the host filesystem."),
        ("Q4: How does Spring Boot communicate with Nextcloud across containers?",
         "A4: Via standard HTTP WebDAV protocol using Docker's internal DNS name 'http://cch-nextcloud:80', executing PUT requests to store files and GET requests to stream them."),
        ("Q5: Where are donor passwords stored and can a system administrator read them?",
         "A5: Passwords are encrypted in the MySQL 'users' table using one-way BCrypt hashing with 10 salt rounds. They cannot be decrypted or read even with direct database dump access.")
    ]

    for idx, (q, a) in enumerate(qas):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        p.text = q
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_GREEN
        p.space_after = Pt(2)

        p = tf.add_paragraph()
        p.text = a
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(8)

    slide12.notes_slide.notes_text_frame.text = (
        "These are the 5 most critical technical questions faculty evaluators ask. Reviewing them guarantees a "
        "confident, professional defense during the project viva."
    )

    # ==========================================
    # SLIDE 13: Future Roadmap & Project Impact
    # ==========================================
    slide13 = prs.slides.add_slide(blank_layout)
    add_header(slide13, "Future Scope, Scalability & Environmental Impact", "PROJECT ROADMAP")

    # 4 Cards Layout
    future_items = [
        ("🛰️ AI & Satellite Canopy Monitoring", "Integrate Sentinel-2 satellite imagery and computer vision to verify canopy density growth and automated survival rate scoring of planted sapling clusters over time."),
        ("📡 IoT Soil & Micro-Climate Sensors", "Deploy solar-powered ESP32/LoRaWAN field sensors transmitting soil moisture, temperature, and nitrogen levels to the Vanseva cloud telemetry engine."),
        ("⛓️ Carbon Credit & Blockchain Ledger", "Mint verifiable carbon credit tokens for certified afforestation acreage, allowing corporate ESG sponsors to offset carbon footprints transparently."),
        ("📱 Mobile Field App for Volunteers", "Flutter-based offline-capable mobile application enabling field foresters to upload geotagged plantation proofs directly to Nextcloud storage even in remote zones.")
    ]

    coords = [
        (Inches(0.8), Inches(1.9)),
        (Inches(6.866), Inches(1.9)),
        (Inches(0.8), Inches(4.4)),
        (Inches(6.866), Inches(4.4))
    ]

    for idx, (title, content) in enumerate(future_items):
        x, y = coords[idx]
        add_card(slide13, x, y, Inches(5.666), Inches(2.3), CARD_LIGHT_TINT if idx % 2 == 0 else CARD_BG)
        tb = slide13.shapes.add_textbox(x + Inches(0.2), y + Inches(0.15), Inches(5.266), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_GREEN
        p.space_after = Pt(8)

        p = tf.add_paragraph()
        p.text = content
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_MAIN

    slide13.notes_slide.notes_text_frame.text = (
        "Demonstrate vision beyond the proof of concept: AI satellite imagery, IoT sensors, carbon credit tokenization, "
        "and mobile volunteer apps."
    )

    # ==========================================
    # SLIDE 14: Conclusion & GitHub Repository (Dark Theme)
    # ==========================================
    slide14 = prs.slides.add_slide(blank_layout)
    bg14 = slide14.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg14.fill.solid()
    bg14.fill.fore_color.rgb = DARK_BG
    bg14.line.fill.background()

    tb = slide14.shapes.add_textbox(Inches(1.0), Inches(1.0), Inches(11.333), Inches(2.2))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "CONCLUSION & PROJECT REPOSITORY"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ACCENT_MINT
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Vanseva demonstrates how modern cloud-native architectures solve real environmental challenges with high reliability, security, and low operational overhead."
    p.font.size = Pt(18)
    p.font.color.rgb = WHITE
    p.space_after = Pt(16)

    # Big Card for GitHub link and commands
    c_repo = add_card(slide14, Inches(1.0), Inches(3.2), Inches(11.333), Inches(3.6), DARK_CARD, None)
    tb_repo = slide14.shapes.add_textbox(Inches(1.3), Inches(3.4), Inches(10.7), Inches(3.2))
    tf_repo = tb_repo.text_frame
    tf_repo.word_wrap = True

    p = tf_repo.paragraphs[0]
    p.text = "🔗 OFFICIAL GITHUB REPOSITORY LINK"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_MINT
    p.space_after = Pt(6)

    p = tf_repo.add_paragraph()
    p.text = "https://github.com/Chaitanya0256355/Vanseva-Web-cloud"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.space_after = Pt(12)

    p = tf_repo.add_paragraph()
    p.text = "Git Commands to Sync & Clone Repository:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_LIGHT
    p.space_after = Pt(4)

    git_cmds = (
        "$ git remote add origin https://github.com/Chaitanya0256355/Vanseva-Web-cloud.git\n"
        "$ git push -u origin main\n"
        "$ git clone https://github.com/Chaitanya0256355/Vanseva-Web-cloud.git"
    )
    p = tf_repo.add_paragraph()
    p.text = git_cmds
    p.font.size = Pt(12)
    p.font.color.rgb = ACCENT_MINT
    p.space_after = Pt(12)

    p = tf_repo.add_paragraph()
    p.text = "Developer Contact: Chaitanya (chaitanyaedki46@gmail.com) | Thank you for your time & evaluation!"
    p.font.size = Pt(13)
    p.font.color.rgb = WHITE

    slide14.notes_slide.notes_text_frame.text = (
        "Conclude your presentation by summarizing the key achievements and pointing evaluators to the official "
        "GitHub repository for source code inspection. Open the floor for questions."
    )

    output_path = "Vanseva_Cloud_Computing_Project_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation generated successfully at: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    create_deck()
