# Persiapan Web: Install Browser, Playwright Dependencies, Konteks Browser Pertama, Verifikasi, dan Troubleshooting

Tutorial ini memandu Anda menyiapkan lingkungan untuk otomasi web menggunakan Heimdall dengan Playwright sebagai backend. Ikuti langkah-langkah secara berurutan sebelum menjalankan test case web apa pun.

---

## Prasyarat

Pastikan sistem Anda sudah memenuhi persyaratan berikut:

- [ ] Node.js 18+ terinstall (direkomendasikan LTS)
- [ ] Heimdall sudah terinstall (`pip install -r requirements.txt`)
- [ ] Playwright dan dependensi terkait terinstall via CLI Heimdall

Jika belum menginstall Heimdall, ikuti [Installation Guide](../guides/installation.md) terlebih dahulu.

---

## Langkah 1: Instalasi Node.js

Playwright, backend otomasi web Heimdall, membutuhkan Node.js untuk menjalankan driver browser.

### 1.1 Verifikasi Instalasi Node.js

```bash
node --version
npm --version
```

Output yang diharapkan minimal:
```text
v18.17.0
9.6.7
```

### 1.2 Instalasi Node.js (Jika Belum Ada)

<details>
<summary>Ubuntu/Debian</summary>

```bash
# Tambah repository NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```
</details>

<details>
<summary>macOS</summary>

```bash
brew install node
```
</details>

<details>
<summary>Windows</summary>

Download installer dari [nodejs.org](https://nodejs.org/) dan pilih versi LTS.
</details>

### 1.3 Upgrade npm (Opsional tapi Disarankan)

```bash
npm install -g npm@latest
```

---

## Langkah 2: Setup Playwright via Heimdall CLI

Heimdall menyediakan perintah khusus untuk menginstall browser dan dependensi Playwright yang diperlukan.

### 2.1 Install Browser Playwright

```bash
heimdall playwright install
```

Perintah ini akan:

- Menginstall chromium, firefox, dan webkit browsers secara otomatis
- Menginstall dependensi sistem yang diperlukan (seperti libnss3, libatk-bridge2.0-0, dll)
- Membuat konfigurasi Playwright dasar

### 2.2 Install Hanya Browser Tertentu (Opsional)

```bash
# Hanya chromium
heimdall playwright install chromium

# Hanya firefox
heimdall playwright install firefox

# Hanya webkit (Safari-like)
heimdall playwright install webkit
```

> **Catatan:** Untuk testing lingkungan CI/CD, Anda bisa menginstall hanya satu browser untuk menghemat waktu dan ruang disk.

### 2.3 Verifikasi Instalasi Browser

```bash
heimdall playwright list
```

Output yang diharapkan:
```text
Available browsers:
- chromium
- firefox
- webkit
```

---

## Langkah 3: Verifikasi Konteks Browser Pertama

Sebelum menulis test, pastikan Playwright bisa membuka browser dan menavigasi ke halaman web dasar.

### 3.1 Buat Script Sederhana untuk Verifikasi

Buat file bernama `verify_web.heim`:

```heim
# =========================================
# TEST: Verifikasi Setup Web
# =========================================

# Buka halaman contoh
Buka halaman "https://example.com"

# Pastikan judul halaman
Pastikan muncul teks "Example Domain"

# Tunggu sebentar agar bisa melihat
Tunggu 2 detik

# Screenshot untuk konfirmasi visual
# (Opsional, memerlukan konfigurasi visual regression)
```

### 3.2 Jalankan Script Verifikasi

```bash
heimdall run verify_web.heim
```

### 3.3 Output yang Diharapkan

```
╔═══════════════════════════════════════════════════════════════╗
║                    HEIMDALL TEST RUNNER                        ║
╠═══════════════════════════════════════════════════════════════╣
║ Test: verify_web.heim                                          ║
║ Platform: web                                                  ║
║ Started: 2024-01-15 10:30:00                                   ║
╠═══════════════════════════════════════════════════════════════╣
║ ✓ Buka halaman "https://example.com"                           ║
║ ✓ Pastikan muncul teks "Example Domain"                        ║
║ ✓ Tunggu 2 detik                                               ║
╠═══════════════════════════════════════════════════════════════╣
║ RESULT: PASSED                                                 ║
║ Duration: 5.23s                                                ║
╚═══════════════════════════════════════════════════════════════╝
```

Jika script gagal, periksa troubleshooting di bagian bawah.

---

## Langkah 4: Konfigurasi Browser (Opsional)

Anda bisa menyesuaikan perilaku browser melalui file konfigurasi Playwright.

### 4.1 Lokasi File Konfigurasi

Heimdall secara otomatis membuat file `playwright.config.js` di direktori kerja Anda saat menjalankan perintah pertama yang membutuhkan browser.

### 4.2 Contoh Konfigurasi Dasar

```javascript
// playwright.config.js
module.exports = {
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // Opsi browser default
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    timeout: 30000,
  },

  // Konfigurasi per browser
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Folder untuk output
  outputDir: 'test-results/',
};
```

### 4.3 Menggunakan Konfigurasi Kustom

Jika Anda memiliki file `playwright.config.js` di direktori kerja, Heimdall akan menggunakannya secara otomatis.

Untuk menjalankan test dengan konfigurasi spesifik:
```bash
heimdall run test.heim --config=custom-playwright.config.js
```

---

## Langkah 5: Persiapan untuk Multiple Browser

Heimdall mendukung pengujian lintas browser secara paralel atau sekensial.

### 5.1 Jalankan Test di Browser Tertentu

```bash
# Jalankan di chromium saja
heimdall run test.heim --browser chromium

# Jalankan di firefox saja
heimdall run test.heim --browser firefox

# Jalankan di webkit saja
heimdall run test.heim --browser webkit
```

### 5.2 Jalankan Test di Semua Browser (Sekuensial)

```bash
heimdall run test.heim --browser all
```

### 5.3 Jalankan Test Paralel di Browser (Opsional)

```bash
# Jalankan test paralel di semua browser yang tersedia
heimdall run test.heim --parallel --browser all
```

> **Catatan:** Pengujian paralel membutuhkan resource yang lebih banyak (CPU, RAM).

---

## Troubleshooting Web

### Problem: `playwright: command not found`

**Penyebab:** Perintah `heimdall playwright` belum tersedia atau Heimdall tidak terinstall dengan benar.

**Solusi:**

```bash
# Verifikasi Heimdall terinstall
heimdall --help

# Jika tidak ada, install ulang
pip install -r requirements.txt
```

---

### Problem: Browser tidak terinstall atau hilang setelah instalasi

**Penyebab:** Instalasi browser Playwright gagal karena dependency sistem hilang atau tidak cukup ruang disk.

**Solusi:**

```bash
# Install ulang dengan verbose output
heimdall playwright install --verbose

# Atau install dependencies sistem manual (Ubuntu/Debian)
sudo apt-get install -y libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 libcups2 libpangocairo-1.0-0 libpango-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2
```

---

### Problem: `net::ERR_CONNECTION_REFUSED` atau `net::ERR_NAME_NOT_RESOLVED`

**Penyebab:** Browser tidak bisa mengakses internet atau target URL tidak bisa dicapai.

**Solusi:**

1. Periksa koneksi internet komputer Anda.
2. Jika menggunakan proxy, konfigurasikan Playwright untuk menggunakan proxy:
   ```javascript
   // Dalam konfigurasi atau sebelum membuka halaman
   context.setProxy({ server: 'http://proxy.example.com:8080' });
   ```
3. Pastikan URL yang dibuka benar dan bisa diakses dari browser biasa.

---

### Problem: Timeout saat menunggu elemen muncul

**Penyebab:** Elemen target tidak muncul dalam waktu default (30 detik).

**Solusi:**

```heim
# Tambah waktu tunggu eksplisit
Tunggu sampai muncul teks "Loading..." timeout 60 detik

# Atau gunakan step tunggu biasa dengan nilai lebih tinggi
Tunggu 60 detik
```

---

### Problem: `Browser TypeError: Cannot read property 'xxx' of undefined`

**Penyebab:** Driver browser tidak terinisialisasi dengan benar.

**Solusi:**

```bash
# Pastikan Anda menggunakan versi Heimdall terbaru
pip install --upgrade heimdall

# Restart terminal setelah upgrade
```

---

### Problem: Screenshot kosong atau hitam

**Penyebab:** Browser berjalan dalam mode headless tanpa dukungan rendering yang cukup.

**Solusi:**

```bash
# Jalankan dalam mode headed untuk debugging
heimdall run test.heim --headed

# Atau atur headless:false dalam konfigurasi Playwright
```

---

### Problem: `Error: listen EADDRINUSE: address already in use :::9222`

**Penyebab:** Port debugging Chrome/Firefox sudah digunakan oleh proses lain.

**Solusi:**

```bash
# Cari proses yang menggunakan port 9222
lsof -i :9222
# atau
netstat -tulpn | grep :9222

# Bunuh proses tersebut
kill -9 <PID>

# Atau restart komputer
```

---

### Problem: `Failed to move to new namespace: Permission denied`

**Penyebab:** Izinan sandbox Linux tidak cukup (umum di container atau WSL2 tanpa privilegios cukup).

**Solusi:**

```bash
# Tambah argumen --no-sandbox untuk debugging (TIDAK disarankan untuk production)
heimdall run test.heim --args="--no-sandbox"

# Solusi yang lebih baik: jalankan dengan privilegios cukup atau gunakan VM
```

---

### Problem: `ECONNRESET` atau `net::ERR_CONNECTION_RESET`

**Penyebab:** Koneksi ke server terputus secara tidak terduga.

**Solusi:**

1. Periksa stabilitas jaringan.
2. Jika mengakses server lokal, pastikan server berjalan dan tidak overload.
3. Tambah retry atau timeout yang lebih panjang:
   ```heim
   Tunggu sampai muncul teks "Data Loaded" timeout 120 detik
   ```

---

### Problem: `ModuleNotFoundError: No module named 'playwright'` saat menjalankan test

**Penyebab:** Python tidak menemukan modul Playwright karena instalasi tidak lengkap.

**Solusi:**

```bash
# Pastikan Playwright Python binding terinstall
pip install playwright

# Atau install ulang seluruh dependencies
pip install -r requirements.txt
```

---

## Checklist Verifikasi Setup Web

Gunakan checklist ini untuk memastikan setup web Anda benar-benar siap:

- [ ] Node.js 18+ terinstall dan terverifikasi
- [ ] Heimdall terinstall (`heimdall --help` bekerja)
- [ ] `heimdall playwright install` berhasil dijalankan tanpa error
- [ ] `heimdall playwright list` menunjukkan browser tersedia
- [ ] Script verifikasi (`verify_web.heim`) bisa jalan dan menghasilkan PASSED
- [ ] Browser bisa membuka halaman dan melakukan interaksi dasar
- [ ] Screenshot (jika dijalankan) berhasil dihasilkan

Setelah checklist di atas terpenuhi, Anda siap melanjutkan ke:

- [Menulis Test Pertama](../tutorials/getting-started/writing-first-test.md)
- [Menjalankan Test](../tutorials/getting-started/running-tests.md)
- [Tutorial Visual Regression](../tutorials/advanced-tutorials/visual-regression.md)
- [Tutorial Data-Driven Testing](../tutorials/advanced-tutorials/data-driven-testing.md)

---