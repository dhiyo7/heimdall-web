# FAQ

Halaman ini menjawab pertanyaan umum tentang **Heimdall**. Jika pertanyaan Anda belum terjawab, buka [GitHub Issues](https://github.com/dhiyo7/heimdall/issues) atau [Discussions](https://github.com/dhiyo7/heimdall/discussions).

---

## Pertanyaan Umum

### Apa itu Heimdall?

**Heimdall** adalah tool otomatisasi QA berbasis keyword-driven testing yang dirancang untuk Android dan Web. Pengguna dapat menulis skrip test dalam Bahasa Indonesia (Keyword DSL) atau Inggris (English DSL), merekam aksi UI secara otomatis, dan menjalankannya via CLI untuk integrasi CI/CD.

### Bagaimana cara kerja Heimdall?

Heimdall bekerja dengan 3 komponen utama:
1. **Keyword DSL Engine** — Menerjemahkan perintah seperti `Ketuk tombol "Login"` menjadi aksi otomatisasi.
2. **Automation Driver** — Menjalankan aksi di device Android (UIAutomator2) atau browser (Playwright).
3. **Headless CLI** — Menyediakan interface command-line untuk eksekusi tanpa GUI.

### Apakah Heimdall gratis?

Ya, Heimdall adalah proyek open-source yang dilisensikan di bawah [MIT License](https://opensource.org/licenses/MIT). Anda bebas menggunakannya untuk proyek komersial maupun non-komersial.

### Platform apa saja yang didukung?

| Platform | Status | Driver |
|----------|--------|--------|
| Android | ✅ Stable | UIAutomator2 |
| Web (Chromium) | ✅ Stable | Playwright |
| Web (Firefox) | ✅ Beta | Playwright |
| Web (WebKit) | 🟡 Experimental | Playwright |
| iOS | 📋 Planned | XCUITest (2025) |

### Bahasa apa yang didukung untuk skrip?

- **Bahasa Indonesia** (default) — `Ketuk tombol "Login"`
- **Bahasa Inggris** — `Click "Login"`
- Kedua mode menghasilkan command dict yang identik secara internal.

---

## Pertanyaan Teknis

### Apa saja prasyarat instalasi?

| Komponen | Versi Minimum | Catatan |
|----------|---------------|---------|
| Python | 3.10+ | Wajib |
| ADB | Terbaru | Untuk Android testing |
| Graphviz | 2.42+ | Wajib untuk Mindmap |
| Node.js | 18.x | Opsional, untuk web testing |

### Bagaimana cara instal Heimdall?

```bash
# Clone repository
git clone https://github.com/dhiyo7/heimdall.git
cd heimdall

# Install dependensi
pip install -r requirements.txt

# Inisialisasi driver Android
python -m uiautomator2 init

# Verifikasi instalasi
heimdall --help
```

### Bagaimana cara menulis test pertama?

Buat file `login_test.heim`:

```heim
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"
Ketik "user@test.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"
Ketuk tombol "Login"
Pastikan muncul teks "Dashboard"
```

Jalankan:

```bash
heimdall run login_test.heim
```

### Apa itu Keyword DSL?

Keyword DSL adalah bahasa scripting khusus Heimdall yang menggunakan kata-kata Bahasa Indonesia atau Inggris untuk mendeskripsikan aksi otomatisasi.

**Contoh Bahasa Indonesia:**
```heim
Buka aplikasi "com.example.app"
Ketik "user@test.com" pada kolom "Email"
Ketuk tombol "Login"
Pastikan muncul teks "Dashboard"
```

**Contoh Bahasa Inggris:**
```heim
Open "com.example.app"
Type "user@test.com" on field "Email"
Click "Login"
ASSERT "Dashboard"
```

### Bagaimana cara menggunakan Data-Driven Testing (DDT)?

```heim
GUNAKAN DATA "user_credentials" SEBAGAI "row"
Ketik "row.Email" pada kolom "Email"
Ketik "row.Password" pada kolom "Password"
Ketuk tombol "Login"
Pastikan muncul teks "Dashboard"
SELESAI GUNAKAN DATA
```

Data disimpan di file CSV, Excel, JSON, atau SQLite.

### Bagaimana cara menjalankan test secara paralel?

```bash
# Jalankan 5 proses paralel
heimdall run ./tests/ --parallel 5

# Target device spesifik
heimdall run ./tests/ --parallel 5 --device "emulator-5554,emulator-5556"
```

### Apa itu Self-Healing Selector?

Self-Healing Selector adalah fitur otomatis yang mencari alternatif selector ketika primary selector gagal menemukan elemen. Contoh:

```heim
# Normal mode
Ketuk tombol "Login"

# Fallback manual jika selector utama gagal
GUNAKAN selector alt {
  Ketuk tombol "Masuk"
}
```

### Bagaimana cara integrasi dengan CI/CD?

Lihat panduan lengkap di [CI/CD Integration](./ci-cd.md).

Contoh singkat GitHub Actions:

```yaml
name: Heimdall Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Heimdall
        run: heimdall run ./tests/ --parallel 3 --report junit-xml --output ./reports/
```

---

## Pertanyaan Instalasi

### Error: `python: command not found`

**Penyebab:** Python tidak terinstall atau belum ada di PATH.

**Solusi:**
```bash
# Verifikasi instalasi Python
python --version

# Jika tidak ada, install Python 3.10+ dari python.org
# Pastikan mencentang "Add Python to PATH"
```

### Error: `adb: command not found`

**Penyebab:** Android SDK Platform-Tools tidak terinstall.

**Solusi:**
```bash
# Ubuntu/Debian
sudo apt install android-tools-adb

# macOS
brew install android-platform-tools

# Windows
# Download dari developer.android.com/studio/releases/platform-tools
```

### Error: `uiautomator2 init` gagal

**Penyebab:** Device tidak terdeteksi atau USB Debugging tidak aktif.

**Solusi:**
```bash
# Pastikan device terhubung
adb devices

# Aktifkan USB Debugging di Developer Options
# Izinkan instalasi ATX di device
```

### Error: `ModuleNotFoundError` meskipun sudah install

**Penyebab:** Virtual environment tidak aktif.

**Solusi:**
```bash
source venv/bin/activate  # Linux/macOS
# atau
.\venv\Scripts\activate   # Windows
```

---

## Pertanyaan Troubleshooting

### Test flaky (kadang berhasil, kadang gagal)

**Penyebab:** Race condition, animasi, atau selector yang tidak stabil.

**Solusi:**
- Tambahkan `Tunggu` sebelum aksi yang membutuhkan elemen muncul
- Gunakan explicit wait: `Tunggu sampai muncul teks "Loading" selesai`
- Gunakan `--retry 2` untuk menjalankan ulang test yang gagal

### `Element tidak ketemu` meskipun elemen terlihat

**Penyebab:** Selector salah atau aplikasi sedang transisi.

**Solusi:**
- Gunakan `heimdall inspect` untuk melihat selector yang tersedia
- Gunakan teks yang persis seperti di layar
- Tambahkan `Tunggu` sebelum aksi
- Gunakan `Ketik "text" pada kolom "urutan 1"` sebagai fallback

### Keyboard tidak muncul setelah test

**Penyebab:** Heimdall menggunakan FastInputIME (Ghost Keyboard).

**Solusi:**
- Tunggu sampai skrip selesai — keyboard akan kembali normal
- Atau matikan FastInputIME via ADB:
  ```bash
  adb shell ime set com.android.inputmethod.latin/.LatinIME
  ```

### Browser process failed to start (Web)

**Penyebab:** Dependensi sistem browser belum terpasang.

**Solusi:**
```bash
heimdall playwright install-deps chromium
heimdall playwright install chromium

# Jika di-container
heimdall run test.heim --args="--no-sandbox"
```

### Parallel execution flaky

**Penyebab:** Resource terbatas atau race condition.

**Solusi:**
```bash
# Kurangi jumlah proses paralel
heimdall run ./tests/ --parallel 2

# Batasi device
heimdall run ./tests/ --parallel 2 --device "emulator-5554"
```

---

## Pertanyaan License

### Apakah Heimdall gratis untuk komersial?

Ya, Heimdall dilisensikan di bawah MIT License. Anda bebas menggunakannya untuk proyek komersial tanpa biaya.

### Apa syarat penggunaan?

- Cantumkan copyright notice di produk Anda
- Jangan menghapus atau mengubah lisensi
- Tidak ada jaminan dari penulis

### Bisakah saya memodifikasi Heimdall?

Ya, Anda bebas memodifikasi source code sesuai kebutuhan Anda, selama tetap mematuhi syarat MIT License.

---

## Pertanyaan Support

### Bagaimana cara mendapatkan bantuan?

1. **Dokumentasi** — Baca dokumentasi di folder `docs/`
2. **GitHub Issues** — Cari solusi atau buat issue baru
3. **GitHub Discussions** — Tanya komunitas
4. **Email** — Kirim email ke support@heimdall.qa

### Apakah ada support berbayar?

Saat ini kami hanya menyediakan support komunitas. Untuk dukungan enterprise, hubungi kami di enterprise@heimdall.qa.

### Berapa lama respons untuk issue?

- Bug report: 2-3 hari kerja
- Feature request: 1 minggu (untuk evaluasi)
- Security issue: 24 jam

---

## Pertanyaan Pricing

### Apakah Heimdall berbayar?

Tidak, Heimdall sepenuhnya gratis untuk open-source dan komersial.

### Apakah ada versi enterprise?

Ya, kami sedang mengembangkan **Heimdall Enterprise** dengan fitur tambahan:
- Cloud execution
- Advanced analytics
- Team collaboration
- Priority support

Untuk informasi lebih lanjut, hubungi enterprise@heimdall.qa.

---

## Pertanyaan Community

### Bagaimana cara berkontribusi?

1. Fork repository
2. Buat branch baru: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -m "Add feature: ..."`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request

### Apakah ada pedoman kontribusi?

Ya, baca [Contributing Guide](../../guides/contributing.md) untuk detailnya.

### Bisakah saya menjadi maintainer?

Kami selalu terbuka untuk kontributor aktif. Jika Anda konsisten berkontribusi selama 3+ bulan, Anda dapat diundang menjadi maintainer.

---

## Troubleshooting FAQ

### Q: Test berjalan lambat

**A:** 
- Matikan animasi di Developer Options: `Animation scale` = `Off`
- Kurangi `--parallel` jika terlalu banyak proses bersamaan
- Gunakan selector yang lebih stabil (text atau resource-id)

### Q: Device sering disconnected

**A:**
- Gunakan kabel USB yang berkualitas baik
- Matikan screen lock agar device tidak sleep
- Pastikan battery di atas 20%
- Gunakan emulator jika device fisik tidak stabil

### Q: `heimdall` command tidak ditemukan setelah install

**A:**
```bash
# Install dalam editable mode
pip install -e .

# Atau gunakan python module
python -m heimdall --help
```

### Q: Test gagal di CI/CD tapi berhasil di lokal

**A:**
- Gunakan emulator dengan konfigurasi yang sama di lokal dan CI/CD
- Jangan gunakan data lokal — gunakan test data yang di-commit
- Pastikan versi aplikasi yang diuji sama
- Tambahkan cleanup step di CI/CD pipeline

### Q: `Permission denied` saat install package

**A:**
```bash
# Gunakan virtual environment (direkomendasikan)
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Atau gunakan --user flag (jangan pakai sudo)
pip install -r requirements.txt --user
```

### Q: Report tidak terbuat atau kosong

**A:**
```bash
# Buat folder output
mkdir -p ./reports
chmod 755 ./reports

# Jalankan dengan output path yang benar
heimdall run login_test.heim --report json --output ./reports/
```

### Q: `JUnit merge failed` / duplikat test case

**A:**
- Gunakan `classname` unik per file
- Merge hanya `testsuite`, bukan `testcase` yang duplikat
- Gunakan tool `junit-xml-merger` di GitLab CI

### Q: `Browser process failed to start`

**A:**
```bash
# Install browser dependencies
heimdall playwright install-deps chromium
heimdall playwright install chromium

# Jika di-container, tambahkan --no-sandbox
heimdall run test.heim --args="--no-sandbox"
```

---

## Kontak

Jika Anda memiliki pertanyaan lain:

- **GitHub Issues**: https://github.com/dhiyo7/heimdall/issues
- **GitHub Discussions**: https://github.com/dhiyo7/heimdall/discussions
- **Email**: support@heimdall.qa
- **Enterprise**: enterprise@heimdall.qa

---

## Referensi Terkait

- [Headless CLI](../../features/basic-features/headsless-cli.md)
- [Menjalankan Test](../../tutorials/getting-started/running-tests.md)
- [CI/CD Integration](./ci-cd.md)
- [Pytest Integration](./pytest.md)
- [TMS Integration](./tms.md)
- [Changelog](./changelog.md)
- [Roadmap](./roadmap.md)