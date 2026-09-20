# Overview Fitur Heimdall

Heimdall adalah aplikasi desktop untuk otomatisasi QA yang berjalan di **Windows**, **macOS**, dan **Linux**. Halaman ini merangkum seluruh fitur yang bisa Anda gunakan untuk menguji aplikasi **Android** dan **Web** — ditulis dalam bahasa yang mudah dipahami, tanpa perlu coding.

## Daftar Fitur

| Fitur | Untuk Apa? | Cara Pakai |
|------|-----------|-----------|
| **Keyword DSL** | Menulis skenario test dalam Bahasa Indonesia (atau Inggris) | Tulis perintah seperti `Buka aplikasi`, `Ketuk tombol`, `Pastikan` di Editor → [Pelajari](./basic-features/keyword-DSL.md) |
| **Automation Drivers** | Mengotomatisasi Android (UIAutomator2) & Web (Playwright) | Sambungkan perangkat di menu **Devices** → [Pelajari](./basic-features/automation-drivers.md) |
| **Headless CLI** | Menjalankan test tanpa membuka aplikasi (cocok untuk CI/CD) | Jalankan lewat command line → [Pelajari](./basic-features/headsless-cli.md) |
| **Action Recording** | Rekam tap & input di layar, lalu ubah otomatis jadi skrip `.heim` | Klik tombol **Record** di toolbar → [Pelajari](./advanced-features/action-recording.md) |
| **Self-Healing Selector** | Heimdall otomatis cari elemen pengganti jika selector gagal | Otomatis aktif; pakai `GUNAKAN selector alt` bila perlu → [Pelajari](./advanced-features/self-healing.md) |
| **Visual Regression** | Bandingkan tampilan sekarang vs baseline untuk cek perubahan UI | Buat baseline, lalu jalankan visual match → [Pelajari](./advanced-features/visual-regression.md) |
| **Data-Driven Testing** | Jalankan test berulang dengan banyak data (CSV/Excel/JSON) | Gunakan keyword `GUNAKAN DATA` & `ULANGI` → [Pelajari](./advanced-features/data-driven-testing.md) |
| **English DSL + AI** | Tulis skrip dalam Bahasa Inggris & generate otomatis via AI | Aktifkan English mode atau AI Test Generation → [Pelajari](./ai-features/english-dsl.md) |
| **API Testing** | Uji REST API (GET/POST/…) dan gabungkan dengan test UI | Tulis perintah API di skrip `.heim` → [Pelajari](./advanced-features/api-testing.md) |
| **Visual Reports** | Lihat hasil test lengkap dengan screenshot & ekspor laporan | Buka menu **Reports** → [Pelajari](./reporting/visual-reports.md) |

## Alur Kerja Recommended

Cara paling umum menggunakan Heimdall:

1. **Siapkan** perangkat di menu **Devices** ([Instalasi](/guides/installation.md)).
2. **Tulis** skenario di **Editor** ([Mulai Cepat](/guides/quick-start.md)).
3. **Rekam** interaksi kalau malas mengetik manual ([Action Recording](./advanced-features/action-recording.md)).
4. **Jalankan** test dan pantau progress real-time.
5. **Lihat** laporan & screenshot di menu **Reports** ([Visual Reports](./reporting/visual-reports.md)).
6. **Kembangkan** ke Visual Regression, Data-Driven, atau API Testing sesuai kebutuhan.

## Rekomendasi Berdasarkan Peran

- **Pemula / QA Manual**: Mulai dari [Keyword DSL](./basic-features/keyword-DSL.md) → [Mulai Cepat](/guides/quick-start.md).
- **Ingin cepat**: Pakai [Action Recording](./advanced-features/action-recording.md) untuk membuat skrip dari rekaman.
- **Tim CI/CD**: Lanjut ke [Headless CLI](./basic-features/headsless-cli.md) & [Integrasi CI/CD](/ecosystem/integrations/ci-cd.md).
- **Jaga stabilitas test**: Pelajari [Self-Healing](./advanced-features/self-healing.md).
- **Cek regresi visual**: Tambahkan [Visual Regression](./advanced-features/visual-regression.md).
- **Uji API + UI sekaligus**: Gabungkan dengan [API Testing](./advanced-features/api-testing.md).
