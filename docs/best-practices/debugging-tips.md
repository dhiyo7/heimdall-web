# Debugging Tips

Panduan untuk men-debug test yang gagal, menganalisis log, dan menggunakan alat bantu untuk mempercepat investigasi.

---

## Debug Mode

### Mengaktifkan Debug Mode

```bash
# Jalankan test dengan log level debug
heimdall run login_test.heim --log-level debug

# Atau lewat environment variable
HEIMDALL_LOG_LEVEL=debug heimdall run login_test.heim
```

### Output Debug

Debug mode menampilkan:
- Perintah DSL yang dieksekusi
- Selector yang dicoba beserta hasilnya
- Healing event yang terjadi
- Snapshot hierarchy UI
- Durasi setiap aksi

### Contoh Output

```
[DEBUG] Executing step 3: Ketuk tombol "Masuk"
[DEBUG] Trying selector: text="Masuk" -> NOT FOUND
[DEBUG] Healing triggered: strategy=resource_id, healed=com.example:id/btn_login
[DEBUG] Element found via healing: com.example:id/btn_login
[DEBUG] Action executed in 1.24s
```

---

## Analisis Log

### Lokasi Log

| Platform | Lokasi |
|----------|--------|
| Linux/macOS | `~/.heimdall/logs/` |
| Windows | `C:\Users\<username>\.heimdall\logs\` |

### Struktur Log

```
heimdall.log          # Log utama
healing_events.log    # Log khusus healing
visual_diff.log       # Log perbandingan visual
```

### Filter Log

```bash
# Cari error saja
grep -i error ~/.heimdall/logs/heimdall.log

# Cari healing event
grep -i healing ~/.heimdall/logs/healing_events.log

# Lihat log per eksekusi (jika ada execution ID)
grep "exec-20240822-001" ~/.heimdall/logs/heimdall.log
```

### Hal yang Perlu Diperiksa

1. **Waktu eksekusi** - Apakah ada delay yang tidak biasa?
2. **Selector yang gagal** - Selector apa yang dicoba sebelum healing?
3. **Strategi healing** - Apakah healing berhasil? Strategi apa yang dipakai?
4. **Screenshot timestamp** - Apakah screenshot diambil saat UI sudah stabil?
5. **Error message** - Pesan error apakah spesifik atau umum?

---

## Bukti Screenshot

### Screenshot Otomatis

Heimdall mengambil screenshot secara otomatis pada momen tertentu:

| Momen | Keterangan |
|-------|------------|
| Before action | Sebelum aksi dieksekusi |
| After action | Setelah aksi selesai |
| On failure | Ketika test gagal |
| Visual diff | Saat perbandingan visual regression |

### Mengambil Screenshot Manual

```bash
# Via CLI
heimdall screenshot --device emulator-5554 --output ./screenshots/

# Via DSL (khusus debugging)
# Tambahkan aksi screenshot di script
```

### Menganalisis Screenshot

1. **Periksa apakah elemen terlihat** - Apakah elemen yang dituju terlihat di layar?
2. **Periksa apakah ada overlay** - Apakah ada dialog, loading spinner, atau keyboard yang menutupi elemen?
3. **Periksa apakah teks sesuai** - Apakah teks di layar sama dengan yang diharapkan?
4. **Periksa apakah ada animasi** - Apakah animasi masih berjalan saat aksi dieksekusi?

---

## Breakpoint Replay

### Konsep

Breakpoint replay memungkinkan Anda menjalankan test dari langkah tertentu, bukan dari awal. Berguna untuk mengisolasi masalah di langkah yang lebih awal.

### Menggunakan Breakpoint

```heim
# Tambahkan breakpoint sebelum langkah yang curiga
# FITUR: Debug Login
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# Breakpoint: hentikan di sini untuk inspection
# DEBUG_BREAKPOINT

Ketik "user@test.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"
Ketuk tombol "Masuk"
```

### Replay dari Langkah Tertentu

```bash
# Jalankan test mulai dari langkah 5
heimdall run login_test.heim --start-step 5

# Jalankan test dengan pause di setiap langkah
heimdall run login_test.heim --step-by-step
```

### Inspector Mode

```bash
# Buka inspector untuk melihat hierarchy UI secara real-time
heimdall inspect --device emulator-5554
```

Inspector menampilkan:
- Hierarchy elemen di layar
- Selector yang tersedia untuk setiap elemen
- Property elemen (text, resource-id, bounds)

---

## Workflow Debugging Umum

### Langkah 1: Identifikasi Masalah

Jalankan test dengan `--log-level debug` dan catat:
- Langkah mana yang gagal?
- Error message apa yang muncul?
- Selector mana yang dicoba?

### Langkah 2: Ambil Bukti

- Ambil screenshot manual dari device/emulator saat gagal
- Lihat hierarchy UI menggunakan `heimdall inspect`
- Cek apakah elemen yang dituju benar-benar ada di layar

### Langkah 3: Isolasi

- Jalankan test mulai dari langkah yang gagal (`--start-step`)
- Atau buat test mini yang hanya menguji langkah tersebut
- Coba selector alternatif secara manual di inspector

### Langkah 4: Perbaiki

- Perbaiki selector jika salah
- Tambahkan `Tunggu` jika elemen belum muncul
- Tambahkan fallback jika selector memang berubah-ubah
- Matikan healing sementara untuk melihat error asli (`--no-healing`)

### Langkah 5: Verifikasi

- Jalankan test lagi dari awal
- Jalankan test paralel untuk memastikan tidak ada race condition
- Jalankan beberapa kali untuk memastikan tidak flaky

---

## Troubleshooting Umum

| Masalah | Kemungkinan Penyebab | Solusi |
|---------|----------------------|--------|
| Element tidak ketemu | Selector salah atau elemen belum muncul | Gunakan `heimdall inspect`, tambah `Tunggu`, atau perbaiki selector |
| Test flaky | Animasi, loading, atau race condition | Tambah `Tunggu`, stabilkan state, atau gunakan explicit wait |
| Healing terlalu sering | Selector utama tidak stabil | Perbaiki selector utama, jangan andalkan healing |
| Screenshot kosong | Device sedang locked atau aplikasi crash | Pastikan device unlocked dan aplikasi berjalan |
| Timeout | Aplikasi lambat atau network issue | Tingkatkan timeout, periksa koneksi device |

---

## Tools Berguna

| Tool | Kegunaan |
|------|----------|
| `heimdall inspect` | Melihat hierarchy UI secara real-time |
| `heimdall devices` | Menghubungkan daftar device yang terdeteksi |
| `heimdall health` | Cek kesehatan sistem (ADB, driver, dll) |
| `adb shell dumpsys window` | Melihat informasi window/activity terbaru |
| `adb logcat` | Melihat log sistem Android |
| `playwright show-trace` | Melihat trace Web test (Playwright) |

---

## Checklist Debugging

- [ ] Log level di-set ke `debug` saat investigasi
- [ ] Screenshot diambil pada saat gagal
- [ ] Hierarchy UI diperiksa menggunakan `heimdall inspect`
- [ ] Selector diverifikasi secara manual
- [ ] Test dijalankan dari langkah yang gagal (`--start-step`)
- [ ] Healing dinonaktifkan sementara untuk melihat error asli
- [ ] Test dijalankan beberapa kali untuk memastikan tidak flaky
- [ ] Perbaikan diverifikasi dengan menjalankan test suite lengkap

---

## Referensi

- [Selector Management](./selector-management.md) - Memilih dan mengelola selector yang baik
- [Performance Optimization](./performance-optimization.md) - Menghindari bottleneck saat debugging
- [Troubleshooting Common Issues](../troubleshooting/common-issues.md) - Masalah umum dan solusinya
