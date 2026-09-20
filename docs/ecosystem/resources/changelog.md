# Changelog

Semua perubahan penting pada proyek **Heimdall** akan didokumentasikan di file ini.

Format changelog ini mengikuti standar [Keep a Changelog](https://keepachangelog.com/id/), dan versi semver mengikuti [Semantic Versioning](https://semver.org/lang/id/).

---

## Daftar Isi

- [Versi Awal (0.1.0) - 2024-01-15](#versi-awal-010---2024-01-15)
- [Breaking Changes](#breaking-changes)
- [Migration Guide](#migration-guide)
- [Release Notes Template](#release-notes-template)
- [Format Changelog](#format-changelog)

---

## Versi Awal (0.1.0) - 2024-01-15

Versi ini adalah rilis pertama Heimdall sebagai QA automation tool yang menggabungkan keyword-driven testing untuk Android dan Web.

### Fitur Utama

- [x] **Headless CLI** — Eksekusi test tanpa GUI.
  - Perintah: `heimdall run`, `heimdall suite`, `heimdall devices`, `heimdall health`
  - Export laporan: JUnit XML, Allure, JSON
  - Autentikasi berbasis token API
  - Eksekusi paralel multi-device via `--parallel`
- [x] **Automation Drivers** — Driver Android (UIAutomator2) dan Web (Playwright)
- [x] **Keyword DSL** — Keyword Bahasa Indonesia: `Buka`, `Ketik`, `Ketuk`, `Tunggu`, `Pastikan`, `Gulir`
- [x] **Action Recording** — Rekam aksi UI dan konversi otomatis ke skrip `.heim`
- [x] **Self-Healing Selector Engine** — Fallback selector otomatis
- [x] **Visual Regression Testing** — Golden screenshot + pixel comparison
- [x] **Data-Driven Testing** — Dukungan CSV, Excel, JSON, SQLite
- [x] **English DSL + AI Test Generation** — Penulisan skrip Inggris, Text-to-Script
- [x] **API Testing** — Integrasi REST API ke DSL Heimdall
- [x] **Reporting** — Laporan visual (Allure), JUnit XML, JSON

### Bug Fixes

- [x] Perbaikan selector tidak terdeteksi pada form dengan label panjang
- [x] Perbaikan timeout test pada emulator berkecepatan rendah
- [x] Perbaikan keyboard bawaan tidak muncul setelah FastInputIME

### Dependensi

| Package | Versi |
|---------|-------|
| Python | >= 3.10 |
| uiautomator2 | latest |
| Playwright | latest |
| Graphviz | >= 2.42 |

---

## [Unreleased]

### Added
- Integrasi TMS untuk sinkronisasi test case
- Webhook automation untuk notifikasi hasil test
- Pytest integration untuk runner alternatif

### Changed
- Memperbaiki dokumentasi untuk instalasi multi-platform

### Fixed
- Perbaikan selektor fallback pada Web (Playwright)

---

## Breaking Changes

Berikut adalah daftar perubahan yang dapat memutus kompatibilitas dengan versi sebelumnya. Perubahan ini hanya terjadi pada versi mayor (major version bump).

### v0.2.0 (Rencana)

| Perubahan | Dampak | Solusi |
|-----------|--------|--------|
| Struktur keyword DSL berubah | Script `.heim` lama perlu diperbarui | Lihat [Migration Guide](#migration-guide) |
| Opsi `--device` menjadi required | Perintah tanpa device akan gagal | Tambahkan `--device` atau gunakan `.heimdallrc.json` |
| Format JSON report berubah | Integrasi custom perlu update parser | Lihat contoh [HeadlessExecutionReport](#struktur-headlessexecutionreport) |

### v0.3.0 (Rencana)

| Perubahan | Dampak | Solusi |
|-----------|--------|--------|
| API token autentikasi wajib | Operasi tanpa token ditolak | Generate API token via `heimdall auth` |
| Format JUnit XML berubah | CI/CD perlu update | Gunakan `--junit-version 2` untuk kompatibilitas |

---

## Migration Guide

### Migrasi dari v0.1.x ke v0.2.x

#### Perubahan 1: Keyword DSL

**Sebelum:**
```heim
Ketuk tombol "Login"
```

**Sesudah:**
```heim
GUNAKAN selector alt {
  Ketuk tombol "Login"
}
```

**Action:** Tambahkan blok `GUNAKAN selector alt` di sekitar aksi yang memerlukan fallback selector.

#### Perubahan 2: Konfigurasi Paralel

**Sebelum:**
```json
{
  "parallel": {
    "maxProcesses": 5
  }
}
```

**Sesudah:**
```json
{
  "parallel": {
    "maxProcesses": 5,
    "throttle": 1000,
    "deviceManager": {
      "maxDevicesPerProcess": 2
    }
  }
}
```

**Action:** Tambahkan `throttle` dan `deviceManager` ke konfigurasi.

#### Perubahan 3: Format Report

**Sebelum:**
```json
{
  "summary": {
    "passed": 12,
    "failed": 2
  }
}
```

**Sesudah:**
```json
{
  "status": "success",
  "summary": {
    "passed": 12,
    "failed": 2,
    "skipped": 1,
    "total": 15
  },
  "duration": "00:05:23"
}
```

**Action:** Update parser untuk membaca field `status` dan `total`.

---

## Release Notes Template

Gunakan template ini untuk setiap rilis baru:

```markdown
# [Versi] - YYYY-MM-DD

## Added
- Deskripsi fitur baru 1
- Deskripsi fitur baru 2

## Changed
- Perubahan perilaku yang ada
- Perbaikan performance

## Deprecated
- Fitur yang akan dihapus di masa depan

## Removed
- Fitur yang dihapus di versi ini

## Fixed
- Bug fix 1
- Bug fix 2

## Security
- Perbaikan keamanan
- Update dependensi

## Dependencies
- Update package X ke versi Y
- Add new package Z
```

### Contoh Release Notes

```markdown
# [0.2.0] - 2024-06-15

## Added
- Integrasi TMS dengan JIRA, TestRail, Azure DevOps
- Webhook automation untuk notifikasi hasil test
- Pytest integration untuk runner alternatif
- Export hasil test massal ke TMS

## Changed
- Perbaiki selektor fallback Web (Playwright)
- Optimalkan parallel execution untuk emulator

## Fixed
- Fix timeout pada test Web dengan elemen animasi
- Fix memory leak pada eksekusi paralel

## Security
- Update Playwright ke versi stabil terbaru
- Patch keamanan untuk token autentikasi
```

---

## Versioning

Heimdall menggunakan [Semantic Versioning](https://semver.org/lang/id/) (SemVer):

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

### Penjelasan

| Komponen | Deskripsi |
|----------|-----------|
| MAJOR | Perubahan besar, bisa memutus kompatibilitas |
| MINOR | Fitur baru, kompatibel dengan versi sebelumnya |
| PATCH | Bug fix kecil, kompatibel |
| PRERELEASE | Alpha, beta, rc (contoh: `0.3.0-alpha.1`) |
| BUILD | Build metadata (contoh: `0.3.0+build.123`) |

### Contoh Versi

- `0.1.0` — Rilis awal
- `0.1.1` — Bug fix kecil
- `0.2.0` — Fitur baru, kompatibel
- `1.0.0` — Rilis stabil pertama
- `1.1.0` — Fitur baru setelah stabil
- `2.0.0` — Perubahan besar, migrasi diperlukan

---

## Format Changelog

### Aturan Penulisan

1. **Satu baris per perubahan**
2. **Gunakan bahasa yang jelas dan ringkas**
3. **Gunakan kategori yang sesuai** (`Added`, `Changed`, `Fixed`, dll.)
4. **Jangan hapus entri lama** — tambahkan entri baru di bagian atas
5. **Beri tanggal pada setiap rilis**

### Kategori yang Disarankan

| Kategori | Deskripsi |
|----------|-----------|
| `Added` | Fitur baru |
| `Changed` | Perubahan pada fitur yang ada |
| `Deprecated` | Fitur yang akan dihapus |
| `Removed` | Fitur yang dihapus |
| `Fixed` | Bug fix |
| `Security` | Perbaikan keamanan |

### Contoh Entri

```markdown
## [1.2.0] - 2024-08-22

### Added
- Integrasi CircleCI untuk pipeline otomatis
- Ekspor hasil test ke format JUnit XML versi 2

### Changed
- Perbaiki performa parallel execution untuk emulator
- Update dokumentasi instalasi untuk macOS

### Fixed
- Fix selector tidak terdeteksi pada elemen dynamic content
- Fix timeout pada test dengan data besar (CSV > 1000 baris)

### Security
- Update dependensi Playwright ke versi 1.41.0
```

---

## Referensi

- [Keep a Changelog](https://keepachangelog.com/id/)
- [Semantic Versioning](https://semver.org/lang/id/)
- [Headless CLI](../../features/basic-features/headsless-cli.md)
- [Menjalankan Test](../../tutorials/getting-started/running-tests.md)
- [Roadmap](./roadmap.md)