# Tutorial Data-Driven Testing (DDT): Persiapan Dataset CSV/Excel/JSON/SQLite, GUNAKAN DATA, ULANGI, Analisa Hasil

Tutorial ini memandu Anda menerapkan Data-Driven Testing (DDT) di Heimdall. DDT memungkinkan satu test case dijalankan berulang kali dengan dataset eksternal sehingga tidak perlu duplikasi script.

---

## Prasyarat

Pastikan Anda sudah memiliki:

- [ ] Heimdall terinstall dan terverifikasi
- [ ] Setup Android selesai ([Setup Android](../tutorials/getting-started/setup-android.md)) **ATAU** Setup Web selesai ([Setup Web](../tutorials/getting-started/setup-web.md))
- [ ] Familiar menulis test dasar ([Menulis Test Pertama](../tutorials/getting-started/writing-first-test.md))
- [ ] Minimal satu test case yang sudah berhasil dijalankan

---

## Langkah 1: Konsep Data-Driven Testing

DDT memisahkan **data test** dari **script test**. Satu script bisa berjalan berkali-kali dengan data berbeda.

### Analogi Sederhana

```text
Tanpa DDT:
Test Case A → Login dengan user1
Test Case B → Login dengan user2
Test Case C → Login dengan user3
Result: 3 file .heim berbeda

Dengan DDT:
Test Case DDT → Login dengan data dari dataset.csv
Result: 1 file .heim, dijalankan 3 kali
```

### Manfaat DDT

| Keuntungan | Penjelasan |
|-----------|------------|
| **Tidak duplikasi** | Satu script untuk banyak kombinasi data |
| **Maintainable** | Ubah data tanpa ubah script |
| **Traceable** | Setiap baris data menghasilkan report tersendiri |
| **Scalable** | Tambah data tanpa tambah script |
| **Cocok untuk regression** | Jalankan banyak kombinasi otomatis |

---

## Langkah 2: Menyiapkan Dataset

Heimdall mendukung format dataset: **CSV**, **Excel (.xlsx)**, **JSON**, dan **SQLite**.

### 2.1 Format CSV

```csv
# user_credentials.csv
Email,Password,ExpectedDashboard
user1@test.com,Pass123,Dashboard User1
user2@test.com,Pass456,Dashboard User2
user3@test.com,Pass789,Dashboard User3
admin@test.com,AdminPass,Dashboard Admin
```

**Aturan CSV:**
- Header harus ada (nama kolom akan jadi variabel)
- Bisa pakai delimiter kustom: `,`, `;`, `|`, atau `tab`
- Encoding: default UTF-8, bisa dikonfigurasi
- Batas maksimal: 10,000 baris per file

### 2.2 Format Excel (.xlsx)

```csv
Sheet "login":
Email,Password,ExpectedDashboard
user1@test.com,Pass123,Dashboard User1
user2@test.com,Pass456,Dashboard User2

Sheet "registration":
Name,Email,ExpectedSuccess
John Doe,john@test.com,Registration Success
Jane Doe,jane@test.com,Registration Success
```

Heimdall bisa membaca sheet tertentu atau semua sheet secara bergantian.

### 2.3 Format JSON

```json
[
  {
    "Email": "user1@test.com",
    "Password": "Pass123",
    "ExpectedDashboard": "Dashboard User1"
  },
  {
    "Email": "user2@test.com",
    "Password": "Pass456",
    "ExpectedDashboard": "Dashboard User2"
  },
  {
    "Email": "admin@test.com",
    "Password": "AdminPass",
    "ExpectedDashboard": "Dashboard Admin"
  }
]
```

> **Catatan:** JSON format harus berupa array of objects.

### 2.4 Format SQLite

Buat file database SQLite:

```sql
-- users.db
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Email TEXT NOT NULL,
    Password TEXT NOT NULL,
    ExpectedDashboard TEXT NOT NULL
);

INSERT INTO users (Email, Password, ExpectedDashboard) VALUES
('user1@test.com', 'Pass123', 'Dashboard User1'),
('user2@test.com', 'Pass456', 'Dashboard User2'),
('user3@test.com', 'Pass789', 'Dashboard User3'),
('admin@test.com', 'AdminPass', 'Dashboard Admin');
```

Jalankan query dari Heimdall:

```heim
GUNAKAN DATA "sqlite:///path/to/users.db?query=SELECT * FROM users" SEBAGAI "row"
...
SELESAI GUNAKAN DATA
```

### 2.5 Lokasi Dataset

Simpan dataset di folder proyek:

```text
my-heidmall-project/
├── datasets/
│   ├── user_credentials.csv
│   ├── products.xlsx
│   ├── user_profiles.json
│   └── users.db
├── tests/
│   ├── login_test.heim
│   └── ...
└── ...
```

---

## Langkah 3: Menggunakan Keyword `GUNAKAN DATA`

Keyword `GUNAKAN DATA` mengulang blok kode untuk setiap baris dataset.

### 3.1 Syntax Dasar

```heim
GUNAKAN DATA "user_credentials" SEBAGAI "row"
Ketik "row.Email" pada kolom "Email"
Ketik "row.Password" pada kolom "Password"
Ketuk tombol "Login"
Tunggu sampai muncul teks "row.ExpectedDashboard"
SELESAI GUNAKAN DATA
```

### 3.2 Aturan Penulisan

| Aturan | Contoh |
|--------|--------|
| Source ID diapit kutip ganda | `"user_credentials"` |
| Alias variabel bebas | `SEBAGAI "row"` atau `SEBAGAI "u"` |
| Akses kolom via dot notation | `"row.Email"`, `"u.Password"` |
| Blok diakhiri `SELESAI GUNAKAN DATA` | Wajib ada |

### 3.3 Contoh Test Login (CSV)

Buat dataset `datasets/user_credentials.csv`:

```csv
Email,Password,ExpectedDashboard
user1@test.com,Pass123,Dashboard User1
user2@test.com,Pass456,Dashboard User2
admin@test.com,AdminPass,Dashboard Admin
```

Buat file `tests/login_ddt.heim`:

```heim
# =========================================
# TEST: Data-Driven Login Test
# Dataset: user_credentials.csv
# =========================================

# FITUR: Login dengan Multiple User
GUNAKAN DATA "datasets/user_credentials.csv" SEBAGAI "row"
Buka aplikasi "com.example.app"
Ketik "row.Email" pada kolom "Email"
Ketik "row.Password" pada kolom "Password"
Ketuk tombol "Login"
Tunggu sampai muncul teks "row.ExpectedDashboard"
Pastikan muncul teks "row.ExpectedDashboard"
SELESAI GUNAKAN DATA
```

Jalankan:

```bash
heimdall run tests/login_ddt.heim
```

Output yang diharapkan:
```
✓ Iterasi 1/3
  row.Email=user1@test.com, row.Password=Pass123
  ✓ Login berhasil → Dashboard User1

✓ Iterasi 2/3
  row.Email=user2@test.com, row.Password=Pass456
  ✓ Login berhasil → Dashboard User2

✓ Iterasi 3/3
  row.Email=admin@test.com, row.Password=AdminPass
  ✓ Login berhasil → Dashboard Admin

RESULT: PASSED (3/3 iterasi)
```

---

## Langkah 4: Menggunakan Keyword `ULANGI`

Keyword `ULANGI` adalah alternatif untuk `GUNAKAN DATA` yang lebih ringkas untuk loop sederhana.

### 4.1 Syntax Dasar

```heim
ULANGI "row" DARI DATA "user_credentials"
Ketik "row.Email" pada kolom "Email"
SELESAI ULANGI
```

### 4.2 Contoh ULANGI untuk Login

```heim
# =========================================
# TEST: Data-Driven Login - ULANGI
# =========================================

# FITUR: Login Iteratif
ULANGI "row" DARI DATA "datasets/user_credentials.csv"
Buka aplikasi "com.example.app"
Ketik "row.Email" pada kolom "Email"
Ketik "row.Password" pada kolom "Password"
Ketuk tombol "Login"
Tunggu sampai muncul teks "row.ExpectedDashboard"
Pastikan muncul teks "row.ExpectedDashboard"
SELESAI ULANGI
```

### 4.3 Perbedaan GUNAKAN DATA vs ULANGI

| Aspek | GUNAKAN DATA | ULANGI |
|--------|-------------|--------|
| Scope | Menutup seluruh blok test | Loop di dalam satu test |
| Result reporting | Setiap iterasi punya report tersendiri | All iterasi dalam satu result |
| Use case | Test case lengkap per data | Reusable step yang diulang |
| Syntax | Lebih formal dan eksplisit | Lebih ringkas |

### 4.4 Contoh ULANGI untuk Web

```heim
# =========================================
# TEST: Data-Driven Web Search
# =========================================

ULANGI "query" DARI DATA "datasets/search_queries.json"
Buka halaman "https://example.com"
Ketik "query" pada kolom "Search"
Ketuk tombol "Search"
Tunggu sampai muncul teks "query"
SELESAI ULANGI
```

Dataset `datasets/search_queries.json`:
```json
["Heimdall", "QA Automation", "Visual Regression", "Data-Driven Testing"]
```

---

## Langkah 5: Format Dataset Lengkap

### 5.1 CSV dengan Multiple Column Types

```csv
# products.csv
Name,Price,InStock,Rating,ReleaseDate
Keyboard Mech,1500000,true,4.8,2024-01-10
Mouse Gaming,850000,true,4.5,2024-02-01
Monitor 4K,4500000,false,4.9,2023-12-15
```

### 5.2 Excel (.xlsx) dengan Multiple Sheets

```csv
Sheet "login_credentials":
Email,Password,Role
admin@test.com,AdminPass,admin
user@test.com,UserPass,user

Sheet "registration_data":
Name,Email,Phone
Alice,alice@test.com,081234567890
Bob,bob@test.com,089876543210
```

### 5.3 JSON Array of Objects

```json
[
  {
    "username": "alice",
    "email": "alice@example.com",
    "age": 28,
    "isActive": true,
    "tags": ["qa", "automation"]
  },
  {
    "username": "bob",
    "email": "bob@example.com",
    "age": 35,
    "isActive": false,
    "tags": ["dev", "lead"]
  }
]
```

### 5.4 SQLite dengan Query Kustom

```heim
# Database dengan query yang kompleks
GUNAKAN DATA "sqlite:///datasets/orders.db?query=SELECT * FROM orders WHERE status='active'" SEBAGAI "order"
Ketik "order.orderId" pada kolom "Order ID"
Ketik "order.customerName" pada kolom "Customer"
SELESAI GUNAKAN DATA
```

---

## Langkah 6: Analisa Hasil DDT

### 6.1 Laporan Iterasi

Setiap iterasi dalam DDT menghasilkan report tersendiri:

```json
{
  "summary": {
    "passed": 2,
    "failed": 1,
    "skipped": 0,
    "total": 3
  },
  "results": [
    {
      "testCase": "login_ddt.heim",
      "dataRow": 1,
      "data": {"Email": "user1@test.com", "Password": "Pass123"},
      "status": "passed",
      "duration": "12.34s"
    },
    {
      "testCase": "login_ddt.heim",
      "dataRow": 2,
      "data": {"Email": "user2@test.com", "Password": "Pass456"},
      "status": "passed",
      "duration": "11.87s"
    },
    {
      "testCase": "login_ddt.heim",
      "dataRow": 3,
      "data": {"Email": "admin@test.com", "Password": "AdminPass"},
      "status": "failed",
      "duration": "15.21s",
      "error": "Expected 'Dashboard Admin' but found 'Login Error'"
    }
  ]
}
```

### 6.2 Kolom Khusus di Report DDT

| Kolom | Deskripsi |
|-------|-----------|
| `testCase` | Nama file test |
| `dataRow` | Nomor baris data (1-based) |
| `data` | Isi data baris tersebut |
| `status` | `passed`/`failed`/`skipped` |
| `duration` | Waktu eksekusi iterasi |
| `error` | Pesan error jika gagal |

### 6.3 Melihat Hasil di Console

```bash
heimdall run login_ddt.heim
```

Output:
```
╔══════════════════════════════════════════════════════════════╗
║ ITERASI 1/3 - Row 1                                          ║
║ Email=user1@test.com, Password=Pass123                       ║
║ ✓ Buka aplikasi                                              ║
║ ✓ Ketik email                                                 ║
║ ✓ Ketik password                                              ║
║ ✓ Ketuk tombol Login                                          ║
║ ✓ Pastikan muncul teks Dashboard User1                        ║
║ → PASSED (4.12s)                                             ║
╠══════════════════════════════════════════════════════════════╣
║ ITERASI 2/3 - Row 2                                          ║
║ Email=user2@test.com, Password=Pass456                       ║
║ → PASSED (3.98s)                                             ║
╠══════════════════════════════════════════════════════════════╣
║ ITERASI 3/3 - Row 3                                          ║
║ Email=admin@test.com, Password=AdminPass                     ║
║ ✗ Pastikan muncul teks Dashboard Admin                        ║
║   Expected: "Dashboard Admin"                                 ║
║   Found: "Login Error"                                        ║
║ → FAILED (5.34s)                                             ║
╠══════════════════════════════════════════════════════════════╣
║ SUMMARY: 2 passed, 1 failed, 0 skipped                       ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Langkah 7: DDT untuk Web dan Android

### 7.1 DDT untuk Web

```heim
# =========================================
# TEST: Data-Driven Web Registration
# Dataset: registrations.csv
# =========================================

# FITUR: Registrasi Multiple User
ULANGI "row" DARI DATA "datasets/registrations.csv"
Buka halaman "https://example.com/register"
Ketik "row.Name" pada kolom "Full Name"
Ketik "row.Email" pada kolom "Email"
Ketik "row.Phone" pada kolom "Phone"
Ketuk tombol "Register"
Tunggu sampai muncul teks "row.ExpectedMessage"
Pastikan muncul teks "row.ExpectedMessage"
SELESAI ULANGI
```

Dataset `datasets/registrations.csv`:
```csv
Name,Email,Phone,ExpectedMessage
Alice,alice@test.com,081234567890,Registration Success
Bob,bob@test.com,089876543210,Registration Success
Charlie,charlie@test.com,087765432100,Email Already Exists
```

### 7.2 DDT untuk Android (dengan Multiple Apps)

```heim
# =========================================
# TEST: Data-Driven Login dengan Multiple Package
# Dataset: app_logins.csv
# =========================================

# FITUR: Login di Berbagai Aplikasi
ULANGI "app" DARI DATA "datasets/app_logins.csv"
Buka aplikasi "row.Package"
Ketik "row.Username" pada kolom "Username"
Ketik "row.Password" pada kolom "Password"
Ketuk tombol "Login"
Tunggu sampai muncul teks "row.HomeIndicator"
Pastikan muncul teks "row.HomeIndicator"
SELESAI ULANGI
```

Dataset `datasets/app_logins.csv`:
```csv
Package,Username,Password,HomeIndicator
com.app1.example,alice,pass123,Home
com.app2.example,bob,pass456,Dashboard
com.app3.example,admin,admin99,Main Menu
```

---

## Langkah 8: Konfigurasi DDT

### 8.1 File Konfigurasi DDT

Buat file `data-driven-config.yml`:

```yaml
# data-driven-config.yml

# Limit baris per file untuk proteksi memori
maxRowsPerFile: 10000

# Format yang didukung
supportedFormats:
  - csv
  - xlsx
  - json
  - sqlite

# Default format
defaultFormat: csv

# Auto detect encoding
autoDetectEncoding: true

# Cache dataset untuk mempercepat load
cache:
  enabled: true
  ttl: 3600  # detik

# CSV Specific
csv:
  delimiter: ","        # auto, comma, semicolon, tab, pipe
  encoding: "utf-8"     # auto-detect jika null
  hasHeader: true        # true untuk CSV dengan header

# Excel Specific
xlsx:
  sheetName: null       # null = sheet pertama, atau "Sheet1"
  headerRow: 1

# JSON Specific
json:
  rootPath: null        # null = array langsung, atau "data.users"

# SQLite Specific
sqlite:
  queryTimeout: 30      # detik
  maxRows: 10000
```

### 8.2 Load Dataset via Config

Buat file `datasets.yml`:

```yaml
datasets:
  - id: "user_credentials"
    source: "datasets/user_credentials.csv"
    format: csv
    delimiter: ","
    hasHeader: true
    encoding: utf-8

  - id: "web_users"
    source: "datasets/users.json"
    format: json

  - id: "sqlite_users"
    source: "datasets/users.db"
    format: sqlite
    query: "SELECT * FROM users WHERE active=1"
```

Gunakan dalam script:
```heim
# Memuat dataset dari datasets.yml
GUNAKAN DATA "user_credentials" SEBAGAI "row"
Ketik "row.Email" pada kolom "Email"
SELESAI GUNAKAN DATA
```

---

## Langkah 9: Conditional Logic dalam DDT

### 9.1 Kondisi Berdasarkan Data

```heim
# =========================================
# TEST: Conditional DDT
# =========================================

# FITUR: Conditional Login
ULANGI "row" DARI DATA "datasets/user_credentials.csv"
Buka aplikasi "com.example.app"

# Jika role adalah admin, lakukan aksi khusus
JIKA "row.Role" SAMA DENGAN "admin" MAKA
  Ketuk tombol "Admin Panel"
SELESAI JIKA

Ketik "row.Email" pada kolom "Email"
Ketik "row.Password" pada kolom "Password"
Ketuk tombol "Login"
SELESAI ULANGI
```

### 9.2 Skip Row Tertentu

```heim
# =========================================
# TEST: Skip Row dengan "skip" flag
# =========================================

ULANGI "row" DARI DATA "datasets/user_credentials.csv"

LEWATI JIKA "row.skip" SAMA DENGAN "true"

Buka aplikasi "com.example.app"
Ketik "row.Email" pada kolom "Email"
Ketuk tombol "Login"
SELESAI ULANGI
```

Dataset:
```csv
Email,Password,skip
user1@test.com,Pass123,false
user2@test.com,Pass456,false
broken@test.com,Pass789,true
admin@test.com,AdminPass,false
```

---

## Langkah 10: DDT dengan Report Export

### 10.1 Export DDT Report

```bash
# Export report JSON dengan detail per iterasi
heimdall run login_ddt.heim --report json --output ./reports/ddt/
```

### 10.2 Export JUnit XML untuk CI/CD

```bash
# Export JUnit XML untuk integrasi CI/CD
heimdall run login_ddt.heim --report junit-xml --output ./reports/ddt/
```

Output `junit-report.xml` akan berisi test case terpisah per iterasi:

```xml
<testsuite name="login_ddt" tests="3" failures="1" errors="0" skipped="0">
  <testcase name="login_ddt.heim [row=1]" classname="login_ddt" time="4.12">
    <passed/>
  </testcase>
  <testcase name="login_ddt.heim [row=2]" classname="login_ddt" time="3.98">
    <passed/>
  </testcase>
  <testcase name="login_ddt.heim [row=3]" classname="login_ddt" time="5.34">
    <failure message="Expected 'Dashboard Admin' but found 'Login Error'">...</failure>
  </testcase>
</testsuite>
```

---

## Troubleshooting Data-Driven Testing

### Problem: `Dataset not found` atau `Dataset tidak ditemukan`

**Penyebab:** Path file dataset salah atau file tidak ada.

**Solusi:**

```bash
# Cek path dataset
ls ./datasets/user_credentials.csv

# Gunakan path absolut jika perlu
heimdall run login_ddt.heim --dataset "/full/path/to/user_credentials.csv"
```

---

### Problem: `Unsupported format` atau `Format tidak didukung`

**Penyebab:** Ekstensi file dataset tidak dikenali.

**Solusi:**

1. Pastikan ekstensi file benar: `.csv`, `.xlsx`, `.json`, atau `.db`
2. Cek `data-driven-config.yml` untuk format yang didukung
3. Gunakan source ID yang benar jika menggunakan datasets.yml

---

### Problem: `Row limit exceeded` atau `Melebihi batas baris`

**Penyebab:** File dataset melebihi batas 10,000 baris.

**Solusi:**

```bash
# Split dataset menjadi lebih kecil
# Atau ubah limit di config (jika mesin punya resource cukup)

# data-driven-config.yml
maxRowsPerFile: 20000
```

Atau split file CSV:

```bash
# Split CSV menjadi 2 file (5000 baris masing-masing)
split -l 5000 large_dataset.csv small_dataset_part_
```

---

### Problem: `Encoding error` atau `Karakter aneh muncul`

**Penyebab:** Encoding dataset tidak sesuai.

**Solusi:**

```yaml
# data-driven-config.yml
csv:
  encoding: "utf-8"  # atau "latin-1", "cp1252", dll
```

Atau convert file:

```bash
# Convert encoding file
iconv -f WINDOWS-1252 -t UTF-8 old_file.csv > new_file.csv
```

---

### Problem: `Header not found` atau `Kolom tidak dikenali`

**Penyebab:** File CSV tidak memiliki header atau format salah.

**Solusi:**

```yaml
# data-driven-config.yml
csv:
  hasHeader: false  # jika tidak ada header, kolom diakses via index: row[0], row[1]
```

Atau perbaiki dataset agar ada header:

```csv
Email,Password,ExpectedDashboard
user1@test.com,Pass123,Dashboard User1
user2@test.com,Pass456,Dashboard User2
```

---

### Problem: `Type mismatch` saat bind data

**Penyebab:** Kolom numerik/boolean dianggap string.

**Solusi:**

```heim
# Cast eksplisit jika perlu
Ketik "row.Age.toString()" pada kolom "Age"
```

Atau perbaiki dataset agar tipe data konsisten.

---

### Problem: Performance lambat untuk dataset besar

**Penyebab:** Dataset besar (> 5000 baris) memakan waktu loading.

**Solusi:**

```yaml
# Aktifkan cache
cache:
  enabled: true
  ttl: 3600

# Batasi dataset per run jika perlu
# Split menjadi chunk kecil dan jalankan per chunk
```

---

## Checklist Data-Driven Testing

- [ ] Dataset disiapkan di format yang didukung (CSV/Excel/JSON/SQLite)
- [ ] Dataset berisi header kolom yang jelas
- [ ] Script test menggunakan `GUNAKAN DATA` atau `ULANGI` dengan benar
- [ ] Akses kolom via dot notation (`row.ColumnName`) sesuai header
- [ ] Test dijalankan dan setiap iterasi menghasilkan report tersendiri
- [ ] Report DDT bisa dibaca dan digunakan untuk analisa
- [ ] Baseline untuk DDT sudah dikonfigurasi jika menggunakan visual regression
- [ ] Konfigurasi DDT sudah sesuai (limit, encoding, delimiter)

---

## Best Practice Data-Driven Testing

| Best Practice | Penjelasan |
|--------------|------------|
| **Nama kolom jelas** | Gunakan nama kolom yang deskriptif (`Email`, bukan `E`) |
| **Validasi data** | Pastikan data valid sebelum dimasukkan ke form |
| **Pisahkan dataset besar** | Jika > 5000 baris, split menjadi beberapa file |
| **Commit baseline data** | Simpan sample dataset di Git untuk reproduktibilitas |
| **Gunakan alias deskriptif** | `SEBAGAI "user"` lebih jelas dari `SEBAGAI "r"` |
| **Abaikan header noise** | Pastikan header hanya satu baris dan sesuai dataset |
| **Document dataset** | Tambahkan komentar di script tentang format dataset |

---

## Next Steps

- [Visual Regression Testing](../tutorials/advanced-tutorials/visual-regression.md) - Jalankan visual check untuk setiap iterasi DDT
- [AI Test Generation](../tutorials/advanced-tutorials/ai-test-generation.md) - AI untuk generate test dari deskripsi natural
- [Self-Healing Selector](../features/advanced-features/self-healing.md) - Auto-healing jika selector berubah
- [Running Tests](../tutorials/getting-started/running-tests.md) - Parallel DDT execution

