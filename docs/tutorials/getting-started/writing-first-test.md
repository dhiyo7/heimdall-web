# Menulis Test Pertama: Struktur `.heim`, Keyword Dasar, Run via CLI, Membaca Hasil

Tutorial ini memandu Anda menulis test case pertama menggunakan Heimdall DSL (Bahasa Indonesia). Ikuti langkah-langkah secara berurutan, dari struktur file `.heim` sampai membaca hasil eksekusi.

---

## Prasyarat

Sebelum memulai, pastikan:

- [ ] Setup Android selesai ([Setup Android](../tutorials/getting-started/setup-android.md)) **ATAU** Setup Web selesai ([Setup Web](../tutorials/getting-started/setup-web.md))
- [ ] Heimdall terinstall dan terverifikasi (`heimdall --help`)
- [ ] Device/emulator terhubung (untuk Android) atau browser terinstall (untuk Web)
- [ ] Text editor ringan (VS Code, Sublime, atau Notepad++) terinstall

---

## Langkah 1: Memahami Struktur File `.heim`

File `.heim` adalah skrip test case Heimdall yang ditulis dalam Bahasa Indonesia. Struktur dasarnya terdiri dari:

1. **Komentar** (`#`) - Penjelasan atau metadata, tidak dieksekusi
2. **Tag `# FITUR:`** - Pengelompokan langkah-langkah untuk visualisasi Mindmap
3. **Keyword perintah** - Instruksi yang dieksekusi baris per baris

### Contoh Struktur Dasar

```heim
# =========================================
# TEST CASE: Login Berhasil
# Author: QA Team
# Platform: Android
# =========================================

# FITUR: Buka Aplikasi
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# FITUR: Input Data Login
Ketik "user@test.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"

# FITUR: Submit Login
Ketuk tombol "Login"

# FITUR: Validasi Dashboard
Tunggu sampai muncul teks "Dashboard"
Pastikan muncul teks "Selamat Datang"
```

### Anatomi Baris Perintah

| Komponen | Contoh | Penjelasan |
|----------|--------|------------|
| Keyword utama | `Buka aplikasi` | Tindakan yang dilakukan |
| Parameter teks | `"com.example.app"` | Target/value dalam tanda kutip |
| Kata penghubung | `pada kolom` | Konjungsi opsional untuk keterbacaan |
| Parameter kedua | `"Email"` | Label elemen target |

---

## Langkah 2: Keyword Dasar yang Perlu Diketahui

Berikut adalah keyword utama yang akan Anda gunakan di test pertama:

| Keyword | Format | Fungsi |
|---------|--------|--------|
| `Buka aplikasi` | `Buka aplikasi "package.name"` | Membuka aplikasi Android via package name |
| `Buka halaman` | `Buka halaman "https://..."` | Membuka URL di browser (Web) |
| `Ketik` | `Ketik "teks" pada kolom "Label"` | Mengisi form input berdasarkan label |
| `Ketik URUTAN` | `Ketik "teks" pada kolom "urutan 1"` | Mengisi form berdasarkan urutan posisi |
| `Ketuk` | `Ketuk tombol "Teks Tombol"` | Menekan tombol berdasarkan teks |
| `Ketuk FAB` | `Ketuk tombol "FAB"` | Menekan Floating Action Button |
| `Tunggu` | `Tunggu sampai muncul teks "Teks"` | Menunggu elemen muncul (handle loading) |
| `Pastikan` | `Pastikan muncul teks "Teks Validasi"` | Assertion - test gagal jika teks tidak ada |
| `Gulir` | `Gulir ke "Bawah"` / `Gulir ke "Atas"` | Scroll layar |

### Contoh Penggunaan per Platform

**Android:**
```heim
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"
Ketik "user@test.com" pada kolom "Email"
Ketuk tombol "Login"
Pastikan muncul teks "Dashboard"
```

**Web:**
```heim
Buka halaman "https://example.com/login"
Tunggu sampai muncul teks "Email"
Ketik "user@test.com" pada kolom "Email"
Ketuk tombol "Login"
Pastikan muncul teks "Dashboard"
```

---

## Langkah 3: Menulis Test Pertama Anda

### 3.1 Buat Folder Project

```bash
mkdir my-first-heimdall-test
cd my-first-heimdall-test
```

### 3.2 Buat File Test `.heim`

Buat file bernama `login_test.heim` menggunakan editor Anda:

```heim
# =========================================
# TEST CASE: Login Berhasil - Skenario Positif
# =========================================

# FITUR: Buka Aplikasi
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# FITUR: Input Data Login
Ketik "user@test.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"

# FITUR: Submit Login
Ketuk tombol "Login"

# FITUR: Validasi Dashboard
Tunggu sampai muncul teks "Dashboard"
Pastikan muncul teks "Selamat Datang"
```

### 3.3 Penjelasan Script Baris per Baris

| Baris | Keyword | Penjelasan |
|-------|---------|------------|
| 1-3 | Komentar | Metadata test case (tidak dieksekusi) |
| 5 | `# FITUR: Buka Aplikasi` | Tag grup untuk Mindmap |
| 6 | `Buka aplikasi "..."` | Membuka aplikasi target via package name |
| 7 | `Tunggu sampai muncul teks "..."` | Menunggu elemen login muncul (handle loading) |
| 9 | `# FITUR: Input Data Login` | Tag grup untuk Mindmap |
| 10 | `Ketik "..." pada kolom "..."` | Mengisi form input "Email" dengan value |
| 11 | `Ketik "..." pada kolom "..."` | Mengisi form input "Password" dengan value |
| 13 | `# FITUR: Submit Login` | Tag grup untuk Mindmap |
| 14 | `Ketuk tombol "..."` | Menekan tombol "Login" |
| 16 | `# FITUR: Validasi Dashboard` | Tag grup untuk Mindmap |
| 17 | `Tunggu sampai muncul teks "..."` | Menunggu dashboard muncul |
| 18 | `Pastikan muncul teks "..."` | Assertion - test gagal jika "Selamat Datang" tidak muncul |

---

## Langkah 4: Menjalankan Test via CLI

### 4.1 Eksekusi Test Dasar

```bash
# Jalankan test dengan device default
heimdall run login_test.heim
```

### 4.2 Eksekusi dengan Device Spesifik (Android)

```bash
# Jalankan dengan serial number device tertentu
heimdall run login_test.heim --device <serial_number>
```

### 4.3 Eksekusi dengan Browser Spesifik (Web)

```bash
# Jalankan di browser tertentu
heimdall run login_test.heim --browser chromium
```

### 4.4 Eksekusi dengan Log Level Debug

```bash
# Tampilkan log detail untuk debugging
heimdall run login_test.heim --log-level debug
```

---

## Langkah 5: Membaca Hasil Eksekusi

### 5.1 Output Konsol yang Diharapkan

```
╔══════════════════════════════════════════════════════════════╗
║                    HEIMDALL TEST RUNNER                        ║
╠══════════════════════════════════════════════════════════════╣
║ Test: login_test.heim                                          ║
║ Platform: android                                              ║
║ Device: emulator-5554                                          ║
║ Started: 2024-01-15 10:30:00                                   ║
╠══════════════════════════════════════════════════════════════╣
║ ✓ Buka aplikasi "com.example.app"                              ║
║ ✓ Tunggu sampai muncul teks "Sign In"                          ║
║ ✓ Ketik "user@test.com" pada kolom "Email"                     ║
║ ✓ Ketik "password123" pada kolom "Password"                   ║
║ ✓ Ketuk tombol "Login"                                         ║
║ ✓ Tunggu sampai muncul teks "Dashboard"                        ║
║ ✓ Pastikan muncul teks "Selamat Datang"                        ║
╠══════════════════:══════════════════════════════════════════╣
║ RESULT: PASSED                                                 ║
║ Duration: 12.34s                                               ║
╚══════════════════════════════════════════════════════════════╝
```

### 5.2 Memahami Status Tiap Langkah

| Simbol | Arti |
|--------|------|
| `✓` | Langkah berhasil dieksekusi |
| `✗` | Langkah gagal (test akan ditandai FAILED) |
| `⚠` | Langkah berhasil tapi dengan peringatan |
| `→` | Langkah dilewati (skipped) |

### 5.3 Memahami Hasil Akhir

| Status | Arti |
|--------|------|
| `PASSED` | Semua langkah berhasil, test case lolos |
| `FAILED` | Satu atau lebih langkah gagal, test case tidak lolos |
| `SKIPPED` | Test tidak dijalankan (misal: dependency tidak tersedia) |
| `ERROR` | Error sistem (bukan kegagalan assertion) |

### 5.4 Membaca Laporan Detail (JSON)

```bash
# Generate report JSON
heimdall run login_test.heim --report json --output ./reports/
```

Buka `./reports/report.json` untuk melihat detail:

```json
{
  "summary": {
    "passed": 1,
    "failed": 0,
    "skipped": 0,
    "total": 1
  },
  "results": [
    {
      "testCase": "login_test.heim",
      "status": "passed",
      "duration": "12.34s",
      "steps": [
        {"step": "Buka aplikasi", "status": "passed"},
        {"step": "Tunggu sampai muncul teks Sign In", "status": "passed"}
      ]
    }
  ]
}
```

---

## Langkah 6: Contoh Lengkap Test Case Web

Berikut adalah contoh test case web lengkap untuk latihan:

```heim
# =========================================
# TEST CASE: Web Login - Skenario Positif
# =========================================

# FITUR: Buka Halaman Login
Buka halaman "https://example.com/login"
Tunggu sampai muncul teks "Email"

# FITUR: Input Kredensial
Ketik "user@example.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"

# FITUR: Submit Form
Ketuk tombol "Login"

# FITUR: Validasi Berhasil
Tunggu sampai muncul teks "Dashboard"
Pastikan muncul teks "Selamat Datang"
```

Jalankan:

```bash
heimdall run web_login_test.heim --browser chromium
```

---

## Troubleshooting Menulis Test

### Problem: `Syntax error` atau `Command not recognized`

**Penyebab:** Keyword salah tulis atau format parameter salah.

**Solusi:**
1. Pastikan keyword menggunakan huruf kapital di awal (contoh: `Buka`, bukan `buka`).
2. Pastikan teks parameter diapit tanda kutip `"`.
3. Cek kembali penulisan `pada kolom` atau `tombol` sesuai format.
4. Lihat [Keyword DSL Reference](../features/basic-features/keyword-DSL.md) untuk daftar lengkap.

---

### Problem: `Element not found` / `Element tidak ketemu`

**Penyebab:** Label di UI berbeda dengan teks yang terlihat, atau elemen belum termuat.

**Solusi:**

```heim
# Tambah waktu tunggu sebelum interaksi
Tunggu sampai muncul teks "Sign In" timeout 30 detik

# Atau gunakan urutan jika label tidak terdeteksi
Ketik "user@test.com" pada kolom "urutan 1"
Ketik "password123" pada kolom "urutan 2"
```

---

### Problem: `App tidak kebuka` / `Package not found`

**Penyebab:** Package name salah.

**Solusi:**

```bash
# Cek package name aplikasi yang terinstall
adb shell pm list packages | grep nama_aplikasi
```

Kemudian perbarui `Buka aplikasi "package.benar.name"`.

---

### Problem: `Test timeout` sebelum elemen muncul

**Penyebab:** Loading lebih lama dari default timeout.

**Solusi:**

```heim
# Tambah timeout eksplisit
Tunggu sampai muncul teks "Dashboard" timeout 60 detik
```

---

### Problem: Keyboard tidak muncul saat `Ketik` (Android)

**Penyebab:** FastInputIME belum aktif.

**Solusi:**

```bash
# Aktifkan FastInputIME
adb shell ime set com.github.uiautomator2/.FastInputIME
```

Atau jalankan script dummy satu kali lagi sampai keyboard muncul.

---

### Problem: Test FAILED padahal langkah benar

**Penyebab:** Assertion `Pastikan` gagal karena teks tidak persis sama (case-sensitive, spasi).

**Solusi:**
1. Periksa kembali teks di `Pastikan muncul teks "..."`.
2. Pastikan teks persis sama dengan yang tampil di UI (termasuk spasi akhir).
3. Gunakan `Tunggu sampai muncul teks` sebelum `Pastikan` untuk memastikan elemen sudah termuat.

---

### Problem: `heimdall: command not found`

**Penyebab:** Heimdall tidak terinstall atau virtual environment tidak aktif.

**Solusi:**

```bash
# Aktifkan venv
source venv/bin/activate  # Linux/macOS
# atau
.\venv\Scripts\activate   # Windows

# Install Heimdall jika belum
pip install -r requirements.txt
```

---

### Problem: `Report file not generated`

**Penyebab:** Path output tidak valid atau tidak ada permission.

**Solusi:**

```bash
# Pastikan folder output ada
mkdir -p ./reports

# Jalankan dengan path absolut
heimdall run login_test.heim --report json --output /full/path/to/reports/
```

---

## Checklist Menulis Test Pertama

Gunakan checklist ini untuk memastikan test Anda benar:

- [ ] File `.heim` dibuat dengan ekstensi benar
- [ ] Struktur: komentar + tag `# FITUR:` + keyword perintah
- [ ] Keyword menggunakan huruf kapital di awal
- [ ] Parameter teks diapit tanda kutip `"`
- [ ] Setiap interaksi didahului `Tunggu sampai muncul teks` untuk handle loading
- [ ] Ada assertion `Pastikan muncul teks` di akhir untuk validasi
- [ ] Test dijalankan via `heimdall run <file>.heim`
- [ ] Status akhir menunjukkan `PASSED`
- [ ] (Opsional) Report JSON dihasilkan di folder output

Setelah test pertama berhasil, lanjutkan ke:

- [Menjalankan Test (Single/Suite/Parallel/CI)](../tutorials/getting-started/running-tests.md)
- [Visual Regression Testing](../tutorials/advanced-tutorials/visual-regression.md)
- [Data-Driven Testing](../tutorials/advanced-tutorials/data-driven-testing.md)
- [AI Test Generation](../tutorials/advanced-tutorials/ai-test-generation.md)
