# Action Recording & Auto-Generation

Fitur ini merekam interaksi UI secara **real-time** dan mengonversinya menjadi skrip `.heim` yang siap diedit. Anda dapat merekam alur kerja di perangkat Android maupun aplikasi Web, lalu memutarnya kembali langsung dari timeline atau mengekspor hasilnya sebagai kode otomatisasi.

## Overview

| Aspek | Detail |
|-------|--------|
| **Platform** | Android, Web |
| **Output** | Timeline visual + file `.heim` |
| **Integrasi** | Playback langsung, export `.heim`, TMS |

## Prasyarat

- Heimdall sudah terinstal dan perintah `heimdall` tersedia di PATH.
- Perangkat Android terhubung dan USB debugging aktif (`heimdall devices`).
- Browser untuk Web sudah diinstal (Playwright Chromium/Firefox/WebKit).
- UIAutomator2 sudah diinisialisasi untuk Android (`python -m uiautomator2 init`).

```bash
# Verifikasi perangkat
heimdall devices
```

## Merekam Aksi Android

Android recording memanfaatkan dua sumber event secara bersamaan:

1. **`adb shell getevent`** - menangkap event sentuh dan input hardware.
2. **UIAutomator2 hierarchy inspection** - menangkap konteks elemen UI (`text`, `resource-id`, `content-desc`, `bounds`).

### Event yang Direkam

| Jenis Aksi | Contoh |
|------------|--------|
| Tap | Ketuk tombol "Login" |
| Long Press | Tahan tombol item daftar |
| Swipe | Gulir layar ke bawah |
| Input Teks | Ketik "user@test.com" pada kolom "Email" |
| Scroll | Gulir "Bawah" / "Atas" |
| Navigasi | Buka activity berikutnya |

### Rekam dari CLI

```bash
# Mulai rekaman untuk perangkat tertentu
heimdall record --device emulator-5554 --output ./rekaman-login.json

# Rekam dengan nama file spesifik
heimdall record --device emulator-5554 --output ./rekaman-checkout.heim
```

Saat rekaman berjalan, setiap interaksi ditangkap dan disusun dalam timeline yang menyertakan timestamp, koordinat, dan konteks elemen.

## Merekam Aksi Web

Web recording menggunakan **event listener Playwright** yang terpasang pada konteks browser aktif.

### Event yang Direkam

| Jenis Aksi | Contoh |
|------------|--------|
| Click | Klik tombol "Submit" |
| Type | Ketik "admin" pada input "Username" |
| Select | Pilih opsi "Indonesia" pada dropdown |
| Navigate | Buka URL "/dashboard" |
| Scroll | Gulir halaman ke bawah |

### Rekam dari Browser

```bash
# Rekam sesi browser
heimdall record --platform web --browser chromium --output ./rekaman-web.json
```

Heimdall akan membuka window browser yang dapat dikontrol. Tutup browser atau hentikan rekaman untuk menyelesaikan sesi.

## Timeline Visual

Timeline menampilkan seluruh aksi yang telah direkam secara berurutan beserta screenshot setiap aksi.

### Struktur Timeline

```
[00:00.000] Buka aplikasi "com.example.app"
            Screenshot: screenshot-001.png

[00:02.350] Ketuk tombol "Login"
            Screenshot: screenshot-002.png

[00:04.120] Ketik "user@test.com" pada kolom "Email"
            Screenshot: screenshot-003.png
```

Timeline memudahkan:
- Memverifikasi urutan aksi sebelum playback.
- Menghapus aksi yang tidak diinginkan.
- Mengatur ulang urutan aksi sebelum ekspor.

## Playback

### Playback Langsung

Jalankan ulang aksi dari timeline tanpa mengekspor file.

```bash
# Playback dari file rekaman
heimdall playback ./rekaman-login.json --device emulator-5554

# Playback dengan kecepatan tertentu
heimdall playback ./rekaman-login.json --device emulator-5554 --speed 1.5
```

### Opsi Playback

| Opsi | Fungsi |
|------|--------|
| `--device <serial>` | Target perangkat Android |
| `--browser <name>` | Target browser Web |
| `--speed <factor>` | Kecepatan playback (misal `1.5` = 1.5x lebih cepat) |
| `--stop-on-error` | Hentikan jika aksi gagal |

## Ekspor ke `.heim`

Hasil rekaman dapat diekspor menjadi skrip `.heim` yang siap dijalankan atau diedit.

### Ekspor dari CLI

```bash
heimdall record --device emulator-5554 --output ./rekaman.json --export ./login_test.heim
```

### Contoh Output `.heim`

```heim
# Judul: Login Flow - Recorded

# FITUR: Buka Aplikasi
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# FITUR: Input Kredensial
Ketik "user@test.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"
Ketuk tombol "Masuk"

# FITUR: Validasi Dashboard
Tunggu sampai muncul teks "Dashboard"
Pastikan muncul teks "Saldo Anda"
```

> **Catatan**: Ekspor default menggunakan Keyword DSL Bahasa Indonesia. Anda dapat menyesuaikan selector atau menambahkan assertion setelah ekspor.

## Integrasi TMS

Hasil rekaman dapat ditautkan ke sistemTestCase Management System (TMS) agar jejak automation test tetap terhubung dengan kebutuhan bisnis.

### Workflow Integrasi

1. Rekam aksi dari fitur yang sedang diuji.
2. Ekspor ke `.heim`.
3. Tautkan file keTestCase ID di TMS.
4. TMS menyimpan linkage antara skrip dan kebutuhan yang diuji.

```bash
# Ekspor dan otomatis tautkan ke TMS
heimdall record --device emulator-5554 --output ./rekaman.json \
  --export ./login_test.heim \
  --tms-project "PROJECT-A" \
  --tms-testcase "TC-LOGIN-001"
```

### Informasi yang Disimpan di TMS

| Data | Deskripsi |
|------|-----------|
| Test Case ID | IDTestCase di TMS |
| Platform | Android atau Web |
| Device/Browser | Model perangkat atau browser |
| Script Path | Lokasi file `.heim` |
| Timestamp | Waktu rekaman dibuat |

## Konfigurasi

### File Konfigurasi

```json
{
  "recording": {
    "enabled": true,
    "outputFormat": "heim",
    "defaultSpeed": 1.0,
    "timeline": {
      "screenshotEveryAction": true,
      "screenshotFormat": "png"
    },
    "tms": {
      "enabled": true,
      "autoLink": true
    }
  }
}
```

### Konfigurasi TMS

```json
{
  "tms": {
    "provider": "custom", // atau "jira", "testrail", "xray"
    "baseUrl": "https://tms.example.com",
    "apiKey": "your-api-key",
    "project": "PROJECT-A"
  }
}
```

## Troubleshooting

| Masalah | Kemungkinan Penyebab | Solusi |
|---------|----------------------|--------|
| Rekaman tidak menangkap aksi | ADB belum terhubung atau perintah `getevent` gagal | Pastikan `heimdall devices` menampilkan perangkat, lalu coba `adb shell getevent` secara manual |
| Hierarchy kosong saat rekaman Android | UIAutomator2 belum diinisialisasi | Jalankan `python -m uiautomator2 init` |
| Event Web tidak terdeteksi | Browser tidak dalam mode debugging atau Playwright tidak terpasang | Jalankan `playwright install chromium` dan pastikan browser tidak dikunci session lain |
| Playback tidak konsisten | State layar berbeda antara rekaman dan playback | Pastikan aplikasi dalam state yang sama sebelum playback, tambahkan `Tunggu` jika perlu |
| Ekspor `.heim` kosong | Tidak ada aksi yang berhasil direkam | Cek permission aplikasi dan pastikan interaksi dilakukan saat rekaman aktif |
| TMS gagal menautkan | API key atau project ID salah | Verifikasi konfigurasi TMS di `heimdall config` |
| Timestamp pada timeline tidak akurat | Device sedang hang atau overload | Tutup aplikasi latar yang tidak perlu, reboot perangkat jika perlu |

### Tips Pemecahan Masalah Lanjutan

- Jalankan dengan `--log-level debug` untuk melihat event mentah yang ditangkap:
  ```bash
  heimdall record --device emulator-5554 --log-level debug
  ```
- Log rekaman disimpan di direktori log Heimdall:
  - Path default: `~/.heimdall/logs/recording/`
- Jika aksi tap tidak akurat, pastikan resolusi layar perangkat tetap sama antara rekaman dan playback.
