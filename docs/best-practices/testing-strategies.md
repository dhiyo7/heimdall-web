# Strategi Testing

Panduan strategi testing untuk Heimdall agar test suite tetap maintainable, andal, dan mudah diperbarui seiring pertumbuhan project.

---

## Tipe Testing

Heimdall mendukung beberapa level testing yang dapat dikombinasikan untuk cakupan maksimal.

| Tipe | Cakupan | Contoh Penggunaan | Tools |
|------|---------|-------------------|-------|
| Unit Test | Satu unit kode/helper | Validasi parser `.heim`, helper transformasi data | pytest |
| Integration Test | Beberapa modul bersama | Driver + DSL engine + healing engine | pytest, uiautomator2, Playwright |
| E2E Test | Seluruh alur aplikasi | Login, checkout, navigasi multi-halaman | Heimdall CLI, .heim script |
| Visual Regression | Perubahan visual UI | Perubahan layout, warna, responsivitas | Visual Regression (SPEC-4) |
| API Test | Endpoint backend | Login API, CRUD data, webhook | API Testing (SPEC-7) |

### Kapan Menggunakan Tiap Tipe

- **Unit Test**: Fokus pada logic yang sering berubah (parser, transformer, helper). Jalankan di setiap commit.
- **Integration Test**: Validasi interaksi antara modul. Jalankan sebelum merge ke branch utama.
- **E2E Test**: Validasi alur end-to-end yang kritikal. Jalankan di pipeline CI/CD.
- **Visual Regression**: Deteksi perubahan visual yang tidak diharapkan. Jalankan setelah perubahan UI.
- **API Test**: Validasi backend secara terisolasi. Jalankan bersamaan dengan E2E atau mandiri.

---

## Organisasi Test

### Struktur Direktori

```
tests/
├── unit/
│   ├── test_parser.py
│   ├── test_healing_engine.py
│   └── test_visual_matcher.py
├── integration/
│   ├── test_driver_android.py
│   ├── test_driver_web.py
│   └── test_dsl_engine.py
├── e2e/
│   ├── android/
│   │   ├── login/
│   │   │   ├── test_login_success.heim
│   │   │   ├── test_login_failed.heim
│   │   │   └── data/
│   │   │       └── credentials.csv
│   │   └── checkout/
│   └── web/
│       ├── auth/
│       └── dashboard/
├── api/
│   └── test_login_api.json
└── conftest.py
```

### Prinsip Organisasi

1. **Satu direktori per tipe test** - Pisahkan unit, integration, dan E2E untuk kejelasan.
2. **Kelompokkan berdasarkan fitur** - Jangan kelompokkan berdasarkan tipe file. Taruh semua test untuk "Login" di satu direktori.
3. **Simpan test data bersama test** - Tempatkan file CSV, JSON, atau baseline gambar di direktori yang sama dengan test yang menggunakannya.
4. **Gunakan `conftest.py` untuk shared fixtures** - Pisahkan setup yang digunakan oleh banyak test.

---

## Naming Convention

### File Test

| Tipe | Format | Contoh |
|------|--------|---------|
| Unit/Integration Python | `test_<modul>.py` | `test_parser.py`, `test_healing_engine.py` |
| E2E .heim | `<nama_test>.heim` | `login_success.heim`, `checkout_flow.heim` |
| API Test JSON | `test_<nama_api>.json` | `test_login_api.json` |
| Test Data | `<dataset_name>.<ext>` | `credentials.csv`, `products.json` |

### Nama Fungsi/Test Case

- **Python**: `test_<aksi>_<skenario>_<hasil_diharapkan>`
  - `test_parse_valid_heim_script`
  - `test_healing_fallback_when_primary_selector_fails`
- **.heim script**: Gunakan komentar `# Judul:` di baris pertama
  - `# Judul: Login dengan kredensial valid`

### Baseline Visual

Format: `baseline_<testcase_id>_<platform>_<device_model>.png`

Contoh: `baseline_TC001_android_pixel_6.png`

---

## Test Data Management

### Prinsip

- **Jangan hardcode data** di dalam test script.
- **Gunakan Data-Driven Testing (SPEC-5)** untuk menjalankan test dengan banyak variasi data.
- **Jaga agar data tidak bocor** - Jangan commit kredensial production ke repository.

### Menggunakan GUNAKAN DATA

```heim
# Test data di file external (credentials.csv):
# email,password,expected_result
# user@test.com,pass123,success
# bad@test.com,wrong,failed

# Di dalam test script:
GUNAKAN DATA "credentials" SEBAGAI "row"
Ketik "row.email" pada kolom "Email"
Ketik "row.password" pada kolom "Password"
Ketuk tombol "Masuk"
Pastikan muncul teks "row.expected_result"
SELESAI GUNAKAN DATA
```

### Jenis Test Data

| Jenis | Kegunaan | Contoh |
|------|----------|--------|
| Fixed Data | Data yang jarang berubah | Daftar negara, mata uang |
| Dynamic Data | Data yang berubah setiap eksekusi | Timestamp, nomor invoice |
| External API | Data diambil dari service | Daftar user dari API |
| Factory/Builder | Data dibuat secara programatik | Faker untuk nama, alamat |

### Best Practice

- Gunakan environment variable untuk kredensial sensitif: `os.getenv("API_TOKEN")`
- Pisahkan test data per lingkungan: `test_data/dev/`, `test_data/staging/`
- Batasi ukuran dataset: maksimal 10.000 baris per file untuk proteksi memori

---

## Independent Test

Prinsip dasar: **Setiap test harus bisa dijalankan sendiri tanpa tergantung pada test lain.**

### Mengapa Penting

- Test yang bergantung pada test lain akan gagal jika test sebelumnya gagal (cascading failure).
- Sulit dijalankan secara paralel.
- Debug menjadi lebih sulit karena tidak tahu test mana yang sebenarnya gagal.

### Aturan

1. **Setup fresh untuk setiap test** - Jangan andalkan state dari test sebelumnya.
2. **Jangan berbagi mutable state** - Setiap test punya scope sendiri.
3. **Bersihkan setelah test** - Hapus data test yang dibuat selama eksekusi.
4. **Urutan eksekusi tidak penting** - Test harus berhasil dalam urutan apapun.

### Contoh Buruk vs Baik

```heim
# BURUK: Test 2 bergantung pada hasil Test 1
# Test 1: Login sebagai admin
Buka aplikasi "com.example.app"
Ketik "admin@test.com" pada kolom "Email"
Ketik "admin123" pada kolom "Password"
Ketuk tombol "Masuk"

# Test 2: Tambah user (bergantung pada session Test 1)
Ketuk tombol "Tambah User"
# ...
```

```heim
# BAIK: Setiap test mandiri
# Test 1: Login sebagai admin
Buka aplikasi "com.example.app"
Ketik "admin@test.com" pada kolom "Email"
Ketik "admin123" pada kolom "Password"
Ketuk tombol "Masuk"
Pastikan muncul teks "Dashboard"

# Test 2: Login sebagai user biasa
Buka aplikasi "com.example.app"
Ketik "user@test.com" pada kolom "Email"
Ketik "user123" pada kolom "Password"
Ketuk tombol "Masuk"
Pastikan muncul teks "Dashboard User"
```

### Fixture di Pytest

```python
import pytest

@pytest.fixture
def fresh_app_session():
    """Fixture yang memberikan session baru untuk setiap test."""
    # Setup
    driver = uiautomator2.connect()
    driver.app_start("com.example.app")
    yield driver
    # Teardown
    driver.app_clear("com.example.app")
    driver.app_stop("com.example.app")

def test_login_success(fresh_app_session):
    driver = fresh_app_session
    # Test berjalan dengan session fresh

def test_logout(fresh_app_session):
    driver = fresh_app_session
    # Test ini juga mendapatkan session fresh, tidak bergantung pada test_login_success
```

---

## Checklist Test Strategy

Gunakan checklist ini untuk mengevaluasi test suite Anda:

- [ ] Setiap test dapat dijalankan sendiri tanpa test lain
- [ ] Tidak ada hardcoded kredensial atau data sensitif di script
- [ ] Test data disimpan di file eksternal (CSV, JSON, Excel)
- [ ] Nama file dan test case mengikuti konvensi yang ditetapkan
- [ ] Unit test menutupi logic yang sering berubah
- [ ] E2E test menutupi alur kritikal yang berisiko tinggi
- [ ] Visual regression dijalankan untuk komponen UI yang sering berubah
- [ ] API test memverifikasi endpoint backend
- [ ] Test dijalankan di CI/CD pipeline
- [ ] Ada cleanup setelah setiap test (hapus data, reset state)

---

## Referensi

- [Self-Healing Selector Engine](./selector-management.md) - Strategi selector yang bisa mengurangi flaky test
- [Performance Optimization](./performance-optimization.md) - Menjalankan test lebih cepat dengan paralel
- [Data-Driven Testing](/features/advanced-features/data-driven-testing) - Dokumentasi fitur DDT
