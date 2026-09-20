# Tutorial AI Test Generation: Setup Provider OpenAI/Gemini/Ollama, Text-to-Script, Smart Suggestions, Error Diagnosis, Best Practice

Tutorial ini memandu Anda menggunakan fitur AI Heimdall untuk otomatisasi pembuatan test, mendapatkan saran langkah cerdas, dan diagnosis error secara otomatis.

---

## Prasyarat

Pastikan Anda sudah memiliki:

- [ ] Heimdall terinstall versi terbaru (`pip install --upgrade heimdall`)
- [ ] Setup Android selesai ([Setup Android](../tutorials/getting-started/setup-android.md)) **ATAU** Setup Web selesai ([Setup Web](../tutorials/getting-started/setup-web.md))
- [ ] Familiar menulis test dasar ([Menulis Test Pertama](../tutorials/getting-started/writing-first-test.md))
- [ ] API key untuk AI provider yang akan digunakan (OpenAI/Gemini/Ollama)

---

## Langkah 1: Konsep Fitur AI di Heimdall

Heimdall memiliki 3 fitur AI utama:

| Fitur | Fungsi |
|-------|--------|
| **Text-to-Script** | Deskripsi natural language → skrip `.heim` |
| **Smart Suggestions** | Saran langkah logis berikutnya saat merekam/inspecting |
| **Error Diagnosis** | Test gagal → AI menganalisis screenshot + log → saran perbaikan |

### Kapan Menggunakan Fitur AI

| Skenario | Fitur yang Cocok |
|----------|-----------------|
| Baru belajar Heimdall | Text-to-Script untuk cepat membuat test |
| Menulis test kompleks | Smart Suggestions untuk langkah berikutnya |
| Test gagal | Error Diagnosis untuk tahu penyebab dan cara perbaiki |
| Regression otomatis | Text-to-Script untuk generate test dari requirement |

---

## Langkah 2: Setup AI Provider

Heimdall mendukung 3 AI provider: **OpenAI**, **Google Gemini**, dan **Ollama** (lokal).

### 2.1 OpenAI (GPT-4/3.5)

#### Langkah 2.1.1: Dapatkan API Key OpenAI

1. Kunjungi [platform.openai.com](https://platform.openai.com/)
2. Buat akun atau login
3. Buka **API Keys** → **Create new secret key**
4. Simpan API key dengan aman

#### Langkah 2.1.2: Konfigurasi OpenAI di Heimdall

```bash
# Via environment variable
export OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"

# Verifikasi koneksi
heimdall ai test-connection --provider openai
```

Atau via config file `heimdall-config.json`:

```json
{
  "ai": {
    "enabled": true,
    "provider": "openai",
    "apiKey": "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

### 2.2 Google Gemini

#### Langkah 2.2.1: Dapatkan API Key Gemini

1. Kunjungi [aistudio.google.com](https://aistudio.google.com/)
2. Login dengan akun Google
3. Buka **Get API Key** → **Create API Key**
4. Pilih project atau buat baru
5. Simpan API key

#### Langkah 2.2.2: Konfigurasi Gemini di Heimdall

```bash
# Via environment variable
export GEMINI_API_KEY="AIzaxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Verifikasi koneksi
heimdall ai test-connection --provider gemini
```

Atau via config file:

```json
{
  "ai": {
    "enabled": true,
    "provider": "gemini",
    "apiKey": "AIzaxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "model": "gemini-pro",
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

### 2.3 Ollama (Model Lokal)

#### Langkah 2.3.1: Install Ollama

<details>
<summary>Ubuntu/Debian</summary>

```bash
curl -fsSL https://ollama.com/install.sh | sh
```
</details>

<details>
<summary>macOS</summary>

```bash
brew install ollama
```
</details>

<details>
<summary>Windows</summary>

Download installer dari [ollama.com](https://ollama.com/) dan install.
</details>

#### Langkah 2.3.2: Pull Model

```bash
# Pull model yang direkomendasikan
ollama pull llama3
ollama pull mistral
ollama pull codellama

# Verifikasi model terinstall
ollama list
```

#### Langkah 2.3.3: Jalankan Ollama Server

```bash
# Jalankan Ollama server
ollama serve

# Di terminal terpisah, test model
ollama run llama3 "Hello, can you help me write test scripts?"
```

#### Langkah 2.3.4: Konfigurasi Ollama di Heimdall

```bash
# Via environment variable (default URL: http://localhost:11434)
export OLLAMA_URL="http://localhost:11434"

# Verifikasi koneksi
heimdall ai test-connection --provider ollama
```

Atau via config file:

```json
{
  "ai": {
    "enabled": true,
    "provider": "ollama",
    "url": "http://localhost:11434",
    "model": "llama3",
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

### 2.4 Verifikasi Koneksi AI

```bash
# Test koneksi dengan provider yang dikonfigurasi
heimdall ai test-connection

# Test dengan provider spesifik
heimdall ai test-connection --provider openai
heimdall ai test-connection --provider gemini
heimdall ai test-connection --provider ollama
```

Output yang diharapkan:
```
✓ OpenAI connection successful
Model: gpt-4
Latency: 1.2s
```

---

## Langkah 3: Text-to-Script

Fitur ini mengubah deskripsi natural language menjadi skrip `.heim` yang siap dijalankan.

### 3.1 Basic Text-to-Script

```bash
# Convert deskripsi menjadi script
heimdall ai text-to-script "Login ke aplikasi dengan email dan password, lalu cek dashboard"

# Output berupa skrip .heim
```

Output contoh:
```heim
# =========================================
# TEST: Generated - Login dan Cek Dashboard
# =========================================

# FITUR: Buka Aplikasi
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# FITUR: Input Login
Ketik "user@example.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"

# FITUR: Submit
Ketuk tombol "Login"
Tunggu sampai muncul teks "Dashboard"

# FITUR: Validasi
Pastikan muncul teks "Dashboard"
```

### 3.2 Text-to-Script dengan Detail Lebih Banyak

```bash
# Deskripsi yang lebih spesifik
heimdall ai text-to-script "
  Buka aplikasi com.example.app,
  tunggu sampai halaman login muncul,
  masukkan email test@example.com di kolom email,
  masukkan password123 di kolom password,
  tekan tombol login,
  tunggu 3 detik,
  verifikasi bahwa halaman dashboard muncul
"
```

### 3.3 Simpan Script Langsung ke File

```bash
# Simpan hasil generate ke file
heimdall ai text-to-script "Test login aplikasi" --output tests/generated_login.heim
```

### 3.4 Text-to-Script untuk Web

```bash
# Generate test web
heimdall ai text-to-script "
  Buka halaman https://example.com/login,
  tunggu sampai form login muncul,
  isi email user@test.com,
  isi password Test123!,
  klik tombol Sign In,
  pastikan halaman dashboard muncul
" --browser chromium --output tests/generated_web_login.heim
```

### 3.5 Text-to-Script dengan Konteks Tambahan

```bash
# Berikan context tentang aplikasi target
heimdall ai text-to-script "
  Target: aplikasi Android com.shop.example
  Task: Test flow checkout produk
  Steps: buka aplikasi, cari produk 'Headphone', tambahkan ke cart, buka cart, checkout, verifikasi order success
" --context "android" --output tests/generated_checkout.heim
```

---

## Langkah 4: Smart Suggestions

Fitur ini memberikan saran langkah logis berikutnya saat merekam atau inspecting elemen.

### 4.1 Smart Suggestions saat Recording

Saat merekam aksi, AI akan menganalisis konteks dan menyarankan langkah selanjutnya:

```bash
# Start recording dengan smart suggestions
heimdall record --smart-suggestions --output recording.json
```

Contoh saran yang muncul:
```
Detected: Login form visible
Suggestions:
  1. Ketik "email" pada kolom "Email"  (confidence: 95%)
  2. Ketuk tombol "Sign In"            (confidence: 92%)
  3. Tunggu sampai muncul teks "Dashboard" (confidence: 88%)
```

### 4.2 Smart Suggestions saat Inspecting Element

Saat memilih elemen di Inspector, AI memberikan saran interaksi:

| Element Terdeteksi | Saran | Confidence |
|-------------------|-------|-----------|
| Tombol "Login" | Ketuk tombol "Login" | 95% |
| Input field "Email" | Ketik "..." pada kolom "Email" | 98% |
| Checkbox "Remember me" | Centang "Remember me" | 85% |
| Dropdown "Role" | Pilih "..." dari dropdown "Role" | 82% |

### 4.3 Konfigurasi Smart Suggestions

```json
{
  "ai": {
    "enabled": true,
    "provider": "openai",
    "apiKey": "sk-...",
    "smartSuggestions": {
      "enabled": true,
      "minConfidence": 0.7,
      "maxSuggestions": 5,
      "contextAware": true
    }
  }
}
```

| Konfigurasi | Fungsi |
|-------------|--------|
| `minConfidence` | Ambang batas minimum confidence untuk menampilkan saran |
| `maxSuggestions` | Maksimal jumlah saran yang ditampilkan |
| `contextAware` | Gunakan konteks sebelumnya untuk saran yang lebih relevan |

---

## Langkah 5: Error Diagnosis

Fitur ini menganalisis kegagalan test dan memberikan diagnosis serta saran perbaikan.

### 5.1 Menjalankan Error Diagnosis

Ketika test gagal:

```bash
# Jalankan test dengan error diagnosis otomatis
heimdall run login_test.heim --diagnose-errors

# Atau diagnosis test yang sudah gagal
heimdall ai diagnose --test-result reports/report.json
```

### 5.2 Output Error Diagnosis

```
╔══════════════════════════════════════════════════════════════╗
║ ERROR DIAGNOSIS                                               ║
╠══════════════════════════════════════════════════════════════╣
║ Test: login_test.heim                                        ║
║ Step: 3 - Ketuk tombol "Login"                               ║
║ Error: Element not found: "Login"                            ║
╠══════════════════════════════════════════════════════════════╣
║ Analysis:                                                     ║
║ - Element visibility: false                                   ║
║ - Possible causes:                                            ║
║   1. Text changed from "Login" to "Masuk"                    ║
║   2. Element hidden by loading overlay                        ║
║   3. Wrong screen state                                       ║
╠══════════════════════════════════════════════════════════════╣
║ Recommendations:                                              ║
║ 1. Tunggu sampai muncul teks "Login" timeout 30 detik (HIGH)  ║
║ 2. Gunakan selector alternatif: "Masuk" (MEDIUM)              ║
║ 3. Cek apakah ada loading overlay sebelum klik (LOW)          ║
╠══════════════════════════════════════════════════════════════╣
║ Suggested Fix:                                                ║
║ Tunggu sampai muncul teks "Masuk" timeout 30 detik            ║
║ Ketuk tombol "Masuk"                                          ║
╚══════════════════════════════════════════════════════════════╝
```

### 5.3 Jenis Analisis

| Jenis | Deskripsi |
|-------|-----------|
| **Visibility** | Apakah elemen terlihat di layar |
| **Text match** | Apakah teks elemen cocok |
| **Selector strategy** | Strategi selector yang tersedia |
| **Context check** | Apakah di halaman/screen yang benar |
| **Loading state** | Apakah ada loading/overlay yang menghalangi |

### 5.4 Auto-Fix Suggestion

```bash
# Terapkan saran perbaikan otomatis (dengan konfirmasi)
heimdall ai diagnose --test-result reports/report.json --auto-fix
```

Output:
```
Applying fix #1: Tunggu sampai muncul teks "Masuk" timeout 30 detik
Fix applied to login_test.heim line 15
Re-running test...
✓ Step 3 passed after fix
```

### 5.5 Konfigurasi Error Diagnosis

```json
{
  "ai": {
    "enabled": true,
    "provider": "openai",
    "errorDiagnosis": {
      "enabled": true,
      "autoFix": false,
      "maxRecommendations": 5,
      "includeScreenshot": true,
      "includeLogs": true,
      "confidenceThreshold": 0.7
    }
  }
}
```

---

## Langkah 6: Best Practice AI Test Generation

### 6.1 Pilih Provider yang Tepat

| Provider | Kelebihan | Kekurangan | Cocok Untuk |
|----------|----------|-----------|-------------|
| **OpenAI GPT-4** | Paling akurat, konteks besar | Berbayar, perlu API key | Production, kompleks test |
| **OpenAI GPT-3.5** | Cepat, murah | Kurang akurat untuk kompleks | Simple test, iterasi cepat |
| **Gemini Pro** | Gratis tier, bagus untuk reasoning | Rate limit | Testing regular |
| **Ollama Llama3** | Gratis, privat, offline | Resource intensif, lebih lambat | Privacy-sensitive, offline |

### 6.2 Tulis Deskripsi yang Baik untuk Text-to-Script

| Baik | Buruk |
|------|-------|
| "Buka aplikasi com.example.app, tunggu halaman login, masukkan email user@test.com, masukkan password Test123, tekan tombol Login, verifikasi halaman dashboard muncul" | "Test login" |
| "Cari produk 'Headphone' di halaman search, tekan tombol Add to Cart, buka cart, tekan Checkout, isi alamat, submit order" | "Test checkout" |
| "Registrasi user baru dengan nama Alice, email alice@test.com, password Pass123, verifikasi success message" | "Test register" |

### 6.3 Review dan Verifikasi Hasil AI

AI menghasilkan kode yang perlu diverifikasi:

```heim
# Hasil AI
Buka aplikasi "com.example.app"
Ketik "user@example.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"
Ketuk tombol "Login"

# Verifikasi manual
# - Apakah package name benar?
# - Apakah label kolom sesuai?
# - Apakah teks tombol benar?
```

### 6.4 Gunakan AI untuk Debugging, Bukan Pengganti Pemahaman

AI adalah alat bantu, bukan pengganti:
- Pahami script yang dihasilkan AI
- Review setiap baris sebelum commit
- Jangan gunakan AI untuk logic bisnis yang kritis tanpa review

### 6.5 Jaga API Key Aman

```bash
# Jangan commit API key ke Git
# Gunakan environment variable
export OPENAI_API_KEY="sk-..."

# Atau file .env yang di-ignore
echo "OPENAI_API_KEY=sk-..." >> .env
echo ".env" >> .gitignore

# Atau gunakan Ollama (lokal) untuk data sensitif
```

---

## Langkah 7: Integrasi AI dengan Fitur Lain

### 7.1 Text-to-Script + Data-Driven Testing

```bash
# Generate test dari deskripsi, lalu tambahkan DDT
heimdall ai text-to-script "
  Login dengan multiple user dari dataset user_credentials
" --output tests/generated_ddt.heim

# Edit manual untuk tambahkan GUNAKAN DATA
```

Hasil edit:
```heim
GUNAKAN DATA "datasets/user_credentials.csv" SEBAGAI "row"
Buka aplikasi "com.example.app"
Ketik "row.Email" pada kolom "Email"
Ketuk tombol "Login"
SELESAI GUNAKAN DATA
```

### 7.2 Smart Suggestions + Visual Regression

```bash
# Record dengan smart suggestions dan visual capture
heimdall record --smart-suggestions --visual-capture --output recording.json
```

### 7.3 Error Diagnosis + Self-Healing

```bash
# Jika test gagal, diagnosis dan auto-heal
heimdall run test.heim --diagnose-errors --auto-heal
```

---

## Langkah 8: Troubleshooting AI

### Problem: `AI provider not responding` / `Provider tidak merespons`

**Penyebab:** API key salah, network issue, atau provider down.

**Solusi:**

```bash
# Verifikasi koneksi
heimdall ai test-connection --provider openai

# Cek API key
echo $OPENAI_API_KEY

# Test manual dengan curl
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

---

### Problem: `Rate limit exceeded` / `Terlalu banyak request`

**Penyebab:** Melebihi batas request API provider.

**Solusi:**

```bash
# Tunggu beberapa menit lalu coba lagi
# Atau gunakan Ollama (lokal) untuk menghindari rate limit
# Atau upgrade plan OpenAI/Gemini
```

---

### Problem: `Model not found` / `Model tidak ditemukan`

**Penyebab:** Nama model salah atau model belum di-pull (untuk Ollama).

**Solusi:**

```bash
# Cek model yang tersedia
heimdall ai list-models

# Pull model Ollama
ollama pull llama3

# Atau ganti model di config
# "model": "gpt-3.5-turbo" jika gpt-4 tidak tersedia
```

---

### Problem: `Response too slow` / `Respons lambat`

**Penyebab:** Model besar atau network lambat.

**Solusi:**

```bash
# Gunakan model yang lebih kecil
# OpenAI: gpt-3.5-turbo (vs gpt-4)
# Gemini: gemini-pro (vs gemini-ultra)
# Ollama: mistral (vs llama3 70b)

# Atau tingkatkan timeout
# heimdall-config.json
"timeout": 60
```

---

### Problem: `Low confidence suggestions` / `Saran kurang relevan`

**Penyebab:** Deskripsi input terlalu samar atau konteks kurang.

**Solusi:**

```bash
# Berikan deskripsi yang lebih detail
heimdall ai text-to-script "
  Buka aplikasi com.shop.example,
  cari produk 'Wireless Headphone' dengan harga di bawah 500 ribu,
  tambahkan ke cart,
  buka halaman cart,
  tekan tombol Checkout,
  isi alamat pengiriman: 'Jl. Merdeka No. 1, Jakarta',
  pilih metode pembayaran 'Transfer Bank',
  submit order,
  verifikasi muncul pesan 'Order berhasil dengan ID #12345'
"

# Atau tingkatkan temperature untuk lebih kreatif
# "temperature": 0.9
```

---

### Problem: `Sensitive data leak` / `Data sensitif bocor`

**Penyebab:** Mengirim data sensitif ke API eksternal.

**Solusi:**

```bash
# Gunakan Ollama (lokal) untuk data sensitif
export AI_PROVIDER=ollama
export OLLAMA_URL=http://localhost:11434

# Atau disable AI untuk test dengan data sensitif
heimdall run sensitive_test.heim --no-ai
```

---

### Problem: `Token limit exceeded` / `Melebihi batas token`

**Penyebab:** Input terlalu panjang untuk context window model.

**Solusi:**

```bash
# Persingkat deskripsi
# Atau gunakan model dengan context lebih besar
# gpt-4-32k, gemini-ultra, atau llama3 dengan context panjang

# Atau split menjadi beberapa test kecil
```

---

## Checklist AI Test Generation

- [ ] AI provider sudah dikonfigurasi (OpenAI/Gemini/Ollama)
- [ ] API key valid dan koneksi teruji (`heimdall ai test-connection`)
- [ ] Text-to-Script berhasil menghasilkan skrip `.heim`
- [ ] Smart Suggestions aktif saat merekam/inspecting
- [ ] Error Diagnosis bisa menganalisis kegagalan test
- [ ] Best practice keamanan API key diterapkan
- [ ] Hasil AI sudah direview sebelum dijalankan

---

## Best Practice AI Test Generation

| Best Practice | Penjelasan |
|--------------|------------|
| **Review hasil AI** | Jangan jalankan hasil generate tanpa review |
| **Gunakan provider lokal untuk data sensitif** | Ollama menghindari kirim data ke cloud |
| **Tulis prompt yang detail** | Semakin detail deskripsi, semakin akurat hasil |
| **Jaga API key aman** | Gunakan env var, jangan commit ke Git |
| **Combine dengan fitur lain** | AI + DDT + Self-Healing + Visual Regression |
| **Iterasi dan perbaiki** | Hasil AI bisa di-refine manual |
| **Monitor usage** | Pantau biaya API jika menggunakan OpenAI/Gemini berbayar |

---

## Next Steps

- [Visual Regression Testing](../tutorials/advanced-tutorials/visual-regression.md) - Generate visual test dengan AI
- [Data-Driven Testing](../tutorials/advanced-tutorials/data-driven-testing.md) - Generate DDT test dari requirement
- [Self-Healing Selector](../features/advanced-features/self-healing.md) - AI-powered auto-healing
- [Running Tests](../tutorials/getting-started/running-tests.md) - Run AI-generated tests in CI/CD

