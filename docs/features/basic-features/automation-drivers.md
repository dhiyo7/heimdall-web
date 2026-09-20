# Automation Drivers

Automation driver adalah lapisan yang menghubungkan Heimdall dengan platform target. Pada dasarnya ada dua platform utama: **Android** dan **Web**. Keduanya dapat dijalankan secara paralel dengan pengaturan yang sesuai.

## Android Driver

Android driver menggunakan **UIAutomator2** sebagai backend otomatisasi.

### Setup
```bash
# Inisialisasi UIAutomator2
python -m uiautomator2 init
```

Verifikasi perangkat:
```bash
heimdall devices
```

### Capabilities Dasar
```json
{
  "platformName": "Android",
  "automationName": "UiAutomator2",
  "deviceName": "emulator-5554",
  "appPackage": "com.example.app",
  "appActivity": "com.example.app.MainActivity",
  "noReset": true
}
```

### Strategi Find Element
Heimdall memprioritaskan selector yang lebih stabil terlebih dahulu sebelum turun ke selector yang lebih rapuh.

| Prioritas | Strategi | Catatan |
|-----------|----------|---------|
| 1 | `text` exact match | Paling stabil jika teks unik |
| 2 | `resource-id` | Cocok untuk elemen yang punya ID tetap |
| 3 | `content-desc` | Berguna untuk aksesibilitas |
| 4 | `xpath` by text | Fleksibel, tapi lebih rapuh |
| 5 | `class + bounds` within parent | Digunakan sebagai fallback terakhir |

## Web Driver

Web driver menggunakan **Playwright** untuk otomatisasi browser.

### Setup
```bash
# Instal browser Playwright
playwright install chromium
```

Verifikasi browser:
```bash
heimdall devices
```

### Browser Contexts
```json
{
  "platformName": "Web",
  "automationName": "Playwright",
  "browserName": "chromium",
  "headless": true,
  "viewport": {
    "width": 1280,
    "height": 720
  }
}
```

### Selector Strategies
| Prioritas | Strategi | Catatan |
|-----------|----------|---------|
| 1 | `text` exact/partial | Lebih kuat untuk konten dinamis |
| 2 | `css selector` | Pilihan utama untuk styling tetap |
| 3 | `xpath` by text/role | Fleksibel untuk traversal DOM |
| 4 | `role + name` | Aksesibilitas-friendly |
| 5 | `class` partial match | Fallback terakhir |

## Device Management

Daftarkan dan pilih perangkat dengan perintah berikut:

```bash
# Lihat daftar perangkat
heimdall devices
```

Contoh output:
```
List Devices
- emulator-5554 | Android 13 | Online
- emulator-5556 | Android 13 | Online
```

Targetkan perangkat tertentu:
```bash
heimdall run tests/ --device emulator-5554
heimdall run tests/ --device "emulator-5554,emulator-5556"
```

## Parallel Execution

Eksekusi paralel dapat dilakukan di Android maupun Web.

### Contoh Eksekusi Paralel
```bash
# Android multi-device
heimdall suite ./tests/ --parallel 4 --device "emulator-5554,emulator-5556"

# Web multi-context
heimdall suite ./web-tests/ --parallel 3
```

### Aturan dan Batasan
- Maksimum 10 proses paralel.
- Kombinasi `--parallel` dengan `--device` disarankan agar alokasi perangkat tetap aman.
- Tambahkan throttle jika perlu mencegah overload pada device atau browser.

```json
{
  "parallel": {
    "maxProcesses": 10,
    "throttle": 1000,
    "deviceManager": {
      "maxDevicesPerProcess": 2
    }
  }
}
```

## Troubleshooting

| Masalah | Platform | Kemungkinan Penyebab | Solusi |
|---------|----------|----------------------|--------|
| `ADB not found` | Android | Platform-Tools belum diinstal | Instal Android SDK Platform-Tools |
| `UIAutomator2 init error` | Android | Paket `uiautomator2` belum siap | Jalankan `python -m uiautomator2 init` |
| `Browser not found` | Web | Browser Playwright belum diinstal | Jalankan `playwright install` |
| `Device busy` | Kedua | Proses paralel terlalu banyak | Turunkan `--parallel` atau batasi `--device` |
| `Element not found` | Kedua | Selector tidak cocok dengan state UI | Gunakan strategi fallback atau stabilkan screen state |
