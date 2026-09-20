# Tutorial Visual Regression Testing

Tutorial ini memandu Anda mengatur, menjalankan, dan menganalisis visual regression testing menggunakan Heimdall. Fitur ini mendeteksi perubahan visual pada UI secara otomatis dengan membandingkan screenshot saat ini terhadap baseline yang sudah ada.

---

## Prasyarat

Pastikan Anda sudah memiliki:

- [ ] Heimdall terinstall dan terverifikasi
- [ ] Setup Android selesai ([Setup Android](../tutorials/getting-started/setup-android.md)) **ATAU** Setup Web selesai ([Setup Web](../tutorials/getting-started/setup-web.md))
- [ ] Minimal satu test case `.heim` yang sudah berhasil dijalankan
- [ ] Keyword `VISUAL_MATCH` dipahami

Jika belum familiar dengan menulis test, baca terlebih dahulu [Menulis Test Pertama](../tutorials/getting-started/writing-first-test.md).

---

## Langkah 1: Konsep Visual Regression Testing

Visual Regression Testing adalah teknik testing yang membandingkan screenshot saat ini terhadap screenshot baseline (referensi). Heimdall menggunakan algoritma **pixel comparison** dengan tolerance threshold yang bisa dikonfigurasi.

### Cara Kerja

```text
┌─────────────┐     ┌────────────────┐     ┌───────────────┐
│ Jalankan Test│────▶│ Ambil Screenshot│────▶│ Bandingkan    │
│              │     │ (Current)       │     │ dengan Baseline│
└─────────────┘     └────────────────┘     └───────┬───────┘
                                                    │
                                            ┌───────▼───────┐
                                            │ Pass / Fail   │
                                            │ (dengan diff) │
                                            └───────────────┘
```

### Threshold (Tolerance)

| Threshold | Arti |
|-----------|------|
| 100% | Pixel harus identik (tidak ada perubahan) |
| 98% | 98% pixel harus identik (threshold default) |
| 95% | 95% pixel harus identik (lebih toleran) |
| 0% | Screenshot tidak ada kesamaan |

> **Tip:** Default threshold Heimdall adalah **98%**. Gunakan threshold lebih rendah (95-96%) untuk halaman yang memiliki konten dinamis (timestamp, counters, dll).

---

## Langkah 2: Setup Baseline (Golden Screenshot)

Baseline adalah screenshot referensi yang akan dibandingkan di kemudian hari.

### 2.1 Baseline Naming Convention

Format nama baseline di Heimdall:

```
testcase-{testCaseId}-{platform}-{deviceModel}.png
```

Contoh:
```
testcase-login-001-android-pixel7.png
testcase-login-001-web-chromium.png
```

### 2.2 Menyimpan Baseline Pertama

Buat file `visual_login_test.heim`:

```heim
# =========================================
# TEST: Visual Regression - Login Page
# =========================================

# FITUR: Buka Aplikasi
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# FITUR: Ambil Screenshot untuk Baseline
# Flag `simpan-baseline=true` menyimpan screenshot ini sebagai baseline baru
SIMPAN_SCREENSHOT sebagai baseline "login-page"

# FITUR: Validasi Visual
# Bandingkan dengan baseline yang sudah ada (default 98%)
VISUAL_MATCH dengan threshold 98%
```

Atau untuk Web:

```heim
# =========================================
# TEST: Visual Regression - Login Page Web
# =========================================

# FITUR: Buka Halaman Login
Buka halaman "https://example.com/login"
Tunggu sampai muncul teks "Sign In"

# FITUR: Ambil Screenshot untuk Baseline
SIMPAN_SCREENSHOT sebagai baseline "login-page"

# FITUR: Validasi Visual
VISUAL_MATCH dengan threshold 98%
```

### 2.3 Jalankan untuk Membuat Baseline

```bash
# Jalankan test untuk pertama kali (membuat baseline)
heimdall run visual_login_test.heim --save-baseline
```

Output yang diharapkan:

```
✓ Buka aplikasi "com.example.app"
✓ Tunggu sampai muncul teks "Sign In"
✓ SIMPAN_SCREENSHOT sebagai baseline "login-page" → Saved
✓ VISUAL_MATCH dengan threshold 98% → No baseline to compare, baseline saved
RESULT: PASSED
```

> **Penting:** Saat pertama kali menjalankan test visual regression tanpa baseline, Heimdall akan otomatis menyimpan screenshot sebagai baseline baru.

### 2.4 Menyimpan Baseline untuk Multiple Platform

Jika test harus berjalan di multiple device/platform, jalankan sekali untuk setiap kombinasi:

```bash
# Baseline untuk Android
heimdall run visual_login_test.heim --device "pixel7" --save-baseline

# Baseline untuk Android lain
heimdall run visual_login_test.heim --device "galaxy-s22" --save-baseline

# Baseline untuk Web chromium
heimdall run visual_login_test.heim --browser chromium --save-baseline
```

---

## Langkah 3: Menjalankan Visual Comparison

Setelah baseline tersimpan, jalankan test untuk membandingkan dengan baseline.

### 3.1 Jalankan Test dengan Visual Match

```heim
# =========================================
# TEST: Visual Regression Check
# =========================================

# FITUR: Buka dan Bandingkan
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# Bandingkan screenshot saat ini dengan baseline
VISUAL_MATCH dengan threshold 98%
```

Jalankan:
```bash
heimdall run visual_login_test.heim
```

### 3.2 Output yang Diharapkan

**Jika PASS:**
```
✓ Buka aplikasi "com.example.app"
✓ Tunggu sampai muncul teks "Sign In"
✓ VISUAL_MATCH dengan threshold 98% → Match 99.2% (PASS)
RESULT: PASSED
```

**Jika FAIL:**
```
✓ Buka aplikasi "com.example.app"
✓ Tunggu sampai muncul teks "Sign In"
✗ VISUAL_MATCH dengan threshold 98% → Match 93.7% (FAIL) - 12 regions changed
RESULT: FAILED
```

---

## Langkah 4: Threshold Konfigurasi

### 4.1 Custom Threshold per Test Case

```heim
# Threshold 95% (lebih toleran untuk konten dinamis)
VISUAL_MATCH dengan threshold 95%

# Threshold 100% (harus identik)
VISUAL_MATCH dengan threshold 100%

# Hard fail jika tidak match (default, tidak perlu flag khusus)
VISUAL_MATCH dengan threshold 95% harus gagal
```

### 4.2 Threshold di Config File

Buat atau edit file `visual-regression-config.yml`:

```yaml
# visual-regression-config.yml

# Threshold default untuk semua test
defaultThreshold: 98

# Threshold per test case (override default)
testCases:
  - id: "login-page"
    threshold: 96
  - id: "dashboard"
    threshold: 95
  - id: "checkout"
    threshold: 99

# Detail perbandingan
comparison:
  # Algoritma pixel comparison
  algorithm: "pixel-by-pixel"
  # tolerance untuk anti-aliasing
  antialiasingTolerance: 3
```

### 4.3 Understanding Threshold Values

| Threshold | Penggunaan |
|-----------|-----------|
| 98% (default) | UI statis, tested semua kondisi |
| 95-97% | UI dengan sedikit konten dinamis |
| 90-94% | UI dengan timestamp atau counters |
| 85-89% | UI dengan konten dinamis tinggi |
| < 85% | ⚠️ Tidak direkomendasikan, terlalu longgar |

---

## Langkah 5: Dynamic Element Masking

Masking memungkinkan Anda mengabaikan area tertentu pada screenshot yang berubah-ubah (timestamp, iklan, counters, dll).

### 5.1 Mengapa Perlu Masking

| Element | Contoh | Masking Needed? |
|---------|--------|-----------------|
| Timestamp | "Last updated: 2024-01-15 10:30" | Ya |
| User avatar | Foto profil user | Ya |
| Ad banner | Iklan dinamis | Ya |
| Notification badges | "5 new" counter | Ya |
| Static logo | Logo aplikasi | Tidak |
| Button text | "Submit", "Cancel" | Tidak |

### 5.2 Konfigurasi Masking via YAML

```yaml
# visual-regression-config.yml

masking:
  enabled: true

  elements:
    - type: "text"
      patterns:
        - "timestamp"
        - "date"
        - "user-name"
        - "last-updated"

    - type: "image"
      patterns:
        - "avatar"
        - "profile-picture"
        - "ad-banner"
        - "banner"

    - type: "button"
      patterns:
        - "Follow"
        - "Subscribe"

  regions:
    # Top bar dengan status (180px dari atas)
    - x: 0
      y: 0
      width: 1080
      height: 180

    # Area waktu aktual
    - x: 0
      y: 180
      width: 400
      height: 50
```

### 5.3 Menggunakan Masking dengan Keyword DSL

```heim
# =========================================
# TEST: Visual Login dengan Masking
# =========================================

# FITUR: Buka Aplikasi
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# FITUR: Visual Check dengan Masking
# Abaikan area waktu dan banner iklan
VISUAL_MATCH dengan threshold 95% {
  ignore_elements: ["timestamp", "ad-banner"]
  ignore_regions: [
    {x: 0, y: 0, width: 1080, height: 180}
  ]
}
```

---

## Langkah 6: Membaca Diff Image dan Changed Regions

Saat visual comparison gagal, Heimdall menghasilkan diff image yang membantu menganalisis perubahan.

### 6.1 Output Files

| File | Deskripsi |
|------|-----------|
| `current.png` | Screenshot saat ini |
| `baseline.png` | Screenshot baseline |
| `diff.png` | Perbedaan antara keduanya |
| `heatmap.png` | Heatmap intensitas perubahan |
| `regions.json` | Data koordinat region berubah |

### 6.2 Memahami Diff Image

```text
┌─────────────────────────────────┐
│ Diff Image:                      │
│ - Background hitam = tidak ada   │
│   perubahan                      │
│ - Background merah/kuning =      │
│   ada perubahan di area itu      │
│ - Background hijau = perubahan   │
│   minor (masih di threshold)     │
└─────────────────────────────────┘
```

### 6.3 Mengakses Diff Files

```bash
# Diff files biasanya disimpan di:
# ./reports/diff/{testCaseId}-{platform}-{deviceModel}/

ls ./reports/diff/login-001-android-pixel7/
# baseline.png
# current.png
# diff.png
# heatmap.png
# regions.json
```

### 6.4 VisualDiffViewer di Frontend

Heimdall Web menyediakan VisualDiffViewer dengan tiga mode:

| Mode | Fungsi |
|------|--------|
| **Side-by-side** | Baseline (kiri) dan Current (kanan) berdampingan |
| **Overlay** | Keduanya ditumpuk dengan opacity yang bisa diatur |
| **Heatmap** | Menunjukkan area dengan intensitas perubahan |

### 6.5 Detail Changed Regions

Format `regions.json`:

```json
{
  "regions": [
    {
      "x": 120,
      "y": 450,
      "width": 280,
      "height": 45,
      "confidence": 0.95,
      "changeType": "color"
    },
    {
      "x": 0,
      "y": 0,
      "width": 1080,
      "height": 180,
      "confidence": 0.88,
      "changeType": "element"
    }
  ]
}
```

| changeType | Arti |
|-----------|------|
| `color` | Perubahan warna (font, background) |
| `element` | Perubahan elemen (tambah/hapus) |
| `layout` | Perubahan layout/posisi |
| `noise` | Noise rendering (anti-aliasing, dll) |

---

## Langkah 7: Baseline Management

### 7.1 Update Baseline

Ketika UI berubah secara sah, update baseline yang sudah ada:

```bash
# Update baseline dengan menjalankan ulang test
heimdall run visual_login_test.heim --update-baseline
```

Atau via keyword DSL:

```heim
# Simpan screenshot baru sebagai baseline pengganti
SIMPAN_SCREENSHOT sebagai baseline "login-page" --update
```

### 7.2 Lihat Semua Baseline

```bash
# List semua baseline yang tersimpan
heimdall visual list-baselines

# Output:
# login-001-android-pixel7.png     1234.5 KB   2024-01-15
# login-001-android-galaxy-s22.png 1245.2 KB   2024-01-15
# login-001-web-chromium.png       1102.8 KB   2024-01-15
```

### 7.3 Delete Baseline

```bash
# Hapus baseline tertentu
heimdall visual delete-baseline "login-001-android-pixel7.png"

# Hapus semua baseline untuk platform tertentu
heimdall visual delete-baseline --platform android --all
```

### 7.4 Baseline File Format

| Informasi | Detail |
|-----------|--------|
| Format | PNG |
| Path | `baselines/{testCaseId}-{platform}-{deviceModel}.png` |
| Metadata | Timestamp, device info, app version |
| Checksum | MD5 untuk verifikasi integritas |

---

## Langkah 8: Visual Regression Test Case Lengkap

Berikut adalah contoh test case visual regression yang lengkap untuk halaman login:

### 8.1 Login Page (Android)

```heim
# =========================================
# TEST: Visual Regression - Halaman Login Android
# =========================================

# FITUR: Buka Aplikasi
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# FITUR: Visual Check - Halaman Login
VISUAL_MATCH dengan threshold 96%

# FITUR: Input Data
Ketik "user@test.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"

# FITUR: Visual Check - Form Terisi
VISUAL_MATCH dengan threshold 96% {
  ignore_elements: ["cursor"]
}

# FITUR: Submit
Ketuk tombol "Login"
Tunggu sampai muncul teks "Dashboard"

# FITUR: Visual Check - Dashboard
VISUAL_MATCH dengan threshold 95%
```

### 8.2 Login Page (Web)

```heim
# =========================================
# TEST: Visual Regression - Halaman Login Web
# =========================================

# FITUR: Buka Halaman Login
Buka halaman "https://example.com/login"
Tunggu sampai muncul teks "Email"

# FITUR: Visual Check - Halaman Login Web
VISUAL_MATCH dengan threshold 95%

# FITUR: Input Data
Ketik "user@example.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"

# FITUR: Visual Check - Form Terisi
VISUAL_MATCH dengan threshold 95% {
  ignore_elements: ["cursor"]
}

# FITUR: Submit
Ketuk tombol "Login"
Tunggu sampai muncul teks "Dashboard"

# FITUR: Visual Check - Dashboard
VISUAL_MATCH dengan threshold 95% {
  ignore_regions: [
    {x: 0, y: 0, width: 1280, height: 60}
  ]
}
```

---

## Troubleshooting Visual Regression

### Problem: `Baseline not found` atau `Baseline tidak ditemukan`

**Penyebab:** Belum ada baseline yang tersimpan untuk kombinasi test case + platform + device ini.

**Solusi:**

```bash
# Jalankan test dengan flag --save-baseline
heimdall run visual_test.heim --save-baseline

# Atau jalankan test dengan flag untuk membuat baseline baru
heimdall run visual_test.heim --create-baseline
```

---

### Problem: False Positives (Test gagal padahal UI tidak berubah)

**Penyebab:** Perubahan rendering komputer (font, anti-aliasing) atau threshold terlalu tinggi.

**Solusi:**

```heim
# Turunkan threshold
VISUAL_MATCH dengan threshold 95%

# Atau tambahkan masking untuk area bermasalah
VISUAL_MATCH dengan threshold 95% {
  ignore_elements: ["cursor", "timestamp"]
}
```

---

### Problem: Diff image tidak tergenerate

**Penyebab:** Folder output tidak ada atau ada permission error.

**Solusi:**

```bash
# Pastikan folder reports ada
mkdir -p ./reports/diff

# Jalankan dengan output ke folder yang valid
heimdall run visual_test.heim --output ./reports/
```

---

### Problem: `Memory exceeded` atau test crash

**Penyebab:** Screenshot resolusi terlalu tinggi atau baseline terlalu besar.

**Solusi:**

```yaml
# Atur resolusi screenshot di config
screenshot:
  width: 1280
  height: 720
  quality: 85  # JPEG quality untuk mengurangi ukuran
```

Atau gunakan masking yang lebih spesifik untuk area penting saja.

---

### Problem: `Threshold too low` - perubahan tidak terdeteksi

**Penyebab:** Threshold terlalu rendah sehingga perubahan nyata diabaikan.

**Solusi:**

```heim
# Naikkan threshold
VISUAL_MATCH dengan threshold 98%

# Atau gunakan 100% untuk area kritis
VISUAL_MATCH dengan threshold 100% harus gagal
```

---

### Problem: Heatmap tidak berfungsi

**Penyebab:** Heatmap tidak diaktifkan atau format output salah.

**Solusi:**

```bash
# Aktifkan heatmap di config
# visual-regression-config.yml
heatmap:
  enabled: true
  colormap: "jet"  # "jet", "hot", "gray", "hsv"
```

---

## Checklist Visual Regression

- [ ] Baseline berhasil disimpan (`--save-baseline`)
- [ ] Threshold dikonfigurasi sesuai kebutuhan
- [ ] Masking dikonfigurasi untuk konten dinamis
- [ ] Diff image bisa diakses setelah test
- [ ] Changed regions bisa dianalisis via `regions.json`
- [ ] VisualDiffViewer bisa diakses untuk review
- [ ] Baseline bisa diupdate jika UI berubah (`--update-baseline`)

---

## Best Practice Visual Regression

| Best Practice | Penjelasan |
|--------------|------------|
| **Baseline konsisten** | Buat baseline di environment yang sama (device, OS, lighting) |
| **Threshold tidak terlalu rendah** | Gunakan minimal 95%, default 98% |
| **Gunakan masking untuk konten dinamis** | Timestamp, counters, avatars, ads harus di-ignore |
| **Commit baseline ke Git** | Supaya semua tim punya baseline yang sama |
| **Review diff sebelum update** | Jangan update baseline tanpa review dulu |
| **Gunakan perangkat yang sama** | Baseline dari device A tidak bisa dipakai di device B |

---

## Next Steps

- [Data-Driven Testing](../tutorials/advanced-tutorials/data-driven-testing.md) - Jalankan visual test dengan multiple dataset
- [AI Test Generation](../tutorials/advanced-tutorials/ai-test-generation.md) - AI untuk generate visual test
- [Self-Healing Selector](../features/advanced-features/self-healing.md) - Auto-healing jika selector berubah
- [Reporting](../features/reporting/visual-reports.md) - Visual report dan dashboard

