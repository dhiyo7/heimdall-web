# Roadmap

Dokumen ini menjelaskan arah pengembangan **Heimdall**: versi saat ini, fitur yang akan datang, permintaan komunitas, voting, milestone tracking, serta cara berkontribusi ke roadmap.

---

## Ringkasan Versi

| Versi | Rilis | Status | Fokus Utama |
|-------|-------|--------|-------------|
| **0.1.0** | 2024-01-15 | ✅ Released | Headless CLI, Keyword DSL, Android/Web Drivers |
| **0.2.0** | Q2 2024 | 🚧 In Progress | Self-Healing, Visual Regression, Data-Driven Testing |
| **0.3.0** | Q3 2024 | 🚀 Planned | English DSL, AI Test Generation, API Testing |
| **1.0.0** | Q4 2024 | 📅 Planned | Stabilisasi fitur, dokumentasi lengkap, plugin system |
| **2.0.0** | 2025 | 📅 Planned | Enterprise TMS Integration, Multi-language support |

---

## Versi Saat Ini (0.1.0)

### Fitur yang Sudah Ada

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Headless CLI | ✅ Stable | `heimdall run`, `heimdall suite`, `heimdall devices`, `heimdall health` |
| Automation Drivers | ✅ Stable | Android (UIAutomator2) + Web (Playwright) |
| Keyword DSL (ID) | ✅ Stable | `Buka`, `Ketik`, `Ketuk`, `Tunggu`, `Pastikan`, `Gulir` |
| Action Recording | ✅ Beta | Rekam aksi UI dan auto-convert ke `.heim` |
| Report Export | ✅ Stable | JUnit XML, Allure, JSON |
| Parallel Execution | ✅ Stable | Multi-device, multi-process via `--parallel` |

---

## Upcoming Features

### 0.2.0 (Q2 2024) — In Progress

| Fitur | Priority | Status | Target |
|-------|----------|--------|--------|
| Self-Healing Selector Engine | 🔴 High | 🚧 In Progress | April 2024 |
| Visual Regression Testing | 🔴 High | 🚧 In Progress | May 2024 |
| Data-Driven Testing | 🟡 Medium | 📋 Planned | May 2024 |
| Test Center Module (Data Center) | 🟡 Medium | 📋 Planned | June 2024 |

#### Detail: Self-Healing Selector Engine

- Fallback chain otomatis berdasarkan metadata Inspector
- Strategi berbeda untuk Android (UIAutomator2) dan Web (Playwright)
- Keyword DSL baru: `GUNAKAN selector alt { ... }`
- Healing event logging ke database

#### Detail: Visual Regression Testing

- Golden screenshot per kombinasi test case + platform + device
- Algoritma pixel comparison dengan threshold (default 98%)
- Diff image, heatmap, dan changed regions detection
- Dynamic element masking
- Keyword DSL: `VISUAL_MATCH dengan threshold 95%`

#### Detail: Data-Driven Testing

- Keyword DSL: `GUNAKAN DATA "source_id" SEBAGAI "row" ... SELESAI GUNAKAN DATA`
- Support format: CSV, Excel (.xlsx), JSON, SQLite
- Data Center module untuk upload, preview, dan manajemen dataset
- Row limit 10,000 per file

---

### 0.3.0 (Q3 2024) — Planned

| Fitur | Priority | Status | Target |
|-------|----------|--------|--------|
| English DSL | 🟡 Medium | 📋 Planned | July 2024 |
| AI Test Generation | 🔴 High | 📋 Planned | August 2024 |
| API Testing | 🟡 Medium | 📋 Planned | July 2024 |
| Smart Suggestions | 🟡 Medium | 📋 Planned | September 2024 |
| Error Diagnosis | 🟡 Medium | 📋 Planned | September 2024 |

#### Detail: English DSL + AI Test Generation

- Penulisan skrip dalam Bahasa Inggris selain Bahasa Indonesia
- Text-to-Script: Deskripsi natural language → skrip `.heim`
- Smart Suggestions: Inspector memberi saran langkah logis berikutnya
- Error Diagnosis: Test gagal → AI menganalisis screenshot + log → menyarankan perbaikan
- Provider: OpenAI, Google Gemini, Ollama (lokal)

#### Detail: API Testing

- CLI: `heimdall api-test /path/to/api-test-file.json`
- Support: GET, POST, PUT, DELETE
- Assertions: statusCode, responseTime, body (JSONPath), headers
- Auth: Bearer, Basic, API Key

---

### 1.0.0 (Q4 2024) — Stabilisasi

| Fitur | Priority | Status | Target |
|-------|----------|--------|--------|
| Dokumentasi Lengkap | 🔴 High | 📋 Planned | October 2024 |
| Plugin System | 🟡 Medium | 📋 Planned | November 2024 |
| Performance Optimization | 🟡 Medium | 📋 Planned | October 2024 |
| Multi-language Support | 🟡 Medium | 📋 Planned | December 2024 |

---

### 2.0.0 (2025) — Enterprise

| Fitur | Priority | Status | Target |
|-------|----------|--------|--------|
| Enterprise TMS Integration | 🔴 High | 📋 Planned | Q1 2025 |
| Advanced Analytics Dashboard | 🟡 Medium | 📋 Planned | Q2 2025 |
| Cloud Execution (SaaS) | 🟡 Medium | 📋 Planned | Q3 2025 |
| Team Collaboration | 🟡 Medium | 📋 Planned | Q3 2025 |

---

## Community Requests

Kami menerima permintaan fitur dari komunitas melalui GitHub Issues dan diskusi. Berikut adalah daftar permintaan yang sedang ditinjau:

| ID | Permintaan | Votes | Status | Catatan |
|----|------------|-------|--------|---------|
| #12 | Support untuk iOS / XCUITest | 24 | 📋 Planned | Evaluasi prioritas Q3 2024 |
| #18 | Plugin untuk Visual Studio Code | 31 | 🚧 In Progress | Beta di repository terpisah |
| #25 | Integrasi dengan Slack notification | 18 | 📋 Planned | Bergantung pada webhook system |
| #31 | Batch execution dengan filter regex | 15 | ✅ Merged | Sudah tersedia di v0.1.1 |
| #42 | Export laporan PDF | 22 | 📋 Planned | Bergantung pada visual report system |

### Cara Mengajukan Permintaan Fitur

1. Buka [GitHub Issues](https://github.com/dhiyo7/heimdall/issues)
2. Pilih template **Feature Request**
3. Jelaskan use case dan manfaatnya
4. Komunitas akan memberikan votes

---

## Voting

Kami menggunakan sistem voting untuk menentukan prioritas fitur. Setiap orang dapat memberikan vote pada issue yang mereka butuhkan.

### Cara Voting

1. Buka issue fitur yang ingin didukung
2. Klik **👍 Thumbs up** pada komentar pertama
3. Atau tambahkan komentar "+1" untuk mendukung

### Aturan Voting

- 1 akun GitHub = 1 vote per issue
- Vote dihitung setiap hari Senin untuk prioritas minggu tersebut
- Fitur dengan vote tertinggi diprioritaskan untuk milestone berikutnya

### Top Voted Features (Saat Ini)

| Rank | Feature | Votes |
|------|---------|-------|
| 1 | Plugin VSCode | 31 |
| 2 | iOS Support (XCUITest) | 24 |
| 3 | Export PDF Report | 22 |
| 4 | Slack Notification | 18 |
| 5 | Batch Regex Filter | 15 |

---

## Milestone Tracking

### Milestone 0.2.0 — "Self-Healing & Visual Testing"

| Task | Owner | Status | Deadline |
|------|-------|--------|----------|
| [SPEC-3] Self-Healing Selector Engine | Tim Backend | 🚧 In Progress | 2024-04-30 |
| [SPEC-4] Visual Regression Testing | Tim Frontend | 🚧 In Progress | 2024-05-15 |
| [SPEC-5] Data-Driven Testing (DDT) | Tim Backend | 📋 Planned | 2024-05-30 |
| Test Center Module | Tim Frontend | 📋 Planned | 2024-06-15 |

### Milestone 0.3.0 — "AI & API Testing"

| Task | Owner | Status | Deadline |
|------|-------|--------|----------|
| [SPEC-6] English DSL | Tim Backend | 📋 Planned | 2024-07-15 |
| [SPEC-7] API Testing | Tim Backend | 📋 Planned | 2024-07-30 |
| [SPEC-6b] AI Test Generation | Tim AI | 📋 Planned | 2024-08-15 |
| Smart Suggestions | Tim AI | 📋 Planned | 2024-08-30 |

### Milestone 1.0.0 — "Stabilization"

| Task | Owner | Status | Deadline |
|------|-------|--------|----------|
| Dokumentasi Lengkap | Tim Docs | 📋 Planned | 2024-10-15 |
| Performance Optimization | Tim Backend | 📋 Planned | 2024-10-30 |
| Plugin System | Tim Architecture | 📋 Planned | 2024-11-15 |
| Multi-language Support | Tim i18n | 📋 Planned | 2024-12-15 |

---

## Cara Berkontribusi ke Roadmap

### 1. Diskusi di GitHub Issues

- Cari atau buat issue dengan label `enhancement`
- Berikan pendapat Anda tentang fitur tersebut
- Vote untuk fitur yang Anda butuhkan

### 2. Pull Request

- Fork repository
- Buat branch: `feature/nama-fitur`
- Commit perubahan dengan pesan yang jelas
- Buat Pull Request ke branch `develop`

### 3. Dokumentasi

- Update dokumentasi untuk fitur baru
- Tambahkan contoh penggunaan
- Update changelog

### 4. Testing

- Jalankan test suite
- Pastikan tidak ada regresi
- Tambahkan test untuk fitur baru

### 5. Code Review

- Review Pull Request dari kontributor lain
- Berikan feedback yang konstruktif
- Approval sebelum merge

---

## Aturan Prioritisasi

Kami menggunakan matriks Eisenhower untuk menentukan prioritas fitur:

| | **Urgent** | **Not Urgent** |
|--|------------|----------------|
| **Important** | 🔴 **High Priority** — Kerjakan segera | 🟡 **Medium Priority** — Jadwalkan |
| **Not Important** | 🟠 **Low Priority** — Delegasikan | ⚪ **Backlog** — Evaluasi nanti |

### Kriteria High Priority

- Fitur yang dibutuhkan untuk rilis stabil
- Bug yang mempengaruhi banyak pengguna
- Keamanan dan performa kritis

### Kriteria Medium Priority

- Fitur tambahan yang berguna
- Perbaikan UX
- Dokumentasi baru

---

## Rencana Jangka Panjang

### 2024

- **Q1**: Rilis awal (v0.1.0) — Headless CLI + Keyword DSL
- **Q2**: Self-Healing + Visual Regression + DDT (v0.2.0)
- **Q3**: AI Test Generation + API Testing (v0.3.0)
- **Q4**: Stabilisasi dan dokumentasi lengkap (v1.0.0)

### 2025

- **Q1**: Enterprise TMS Integration (v2.0.0)
- **Q2**: Advanced Analytics Dashboard
- **Q3**: Cloud Execution Platform
- **Q4**: Team Collaboration Features

---

## Referensi

- [GitHub Issues](https://github.com/dhiyo7/heimdall/issues)
- [GitHub Discussions](https://github.com/dhiyo7/heimdall/discussions)
- [Changelog](./changelog.md)
- [Contributing Guide](../../guides/contributing.md)