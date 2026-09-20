# Persistent Issues

Daftar bug yang sudah diketahui, workaround yang tersedia, dan informasi untuk melaporkan issue baru.

---

## Known Bugs

Bug yang sudah diidentifikasi tapi belum diperbaiki di rilis terbaru. Cek halaman ini secara berkala.

### BUG-001: Elemen tidak terdeteksi setelah perubahan orientasi layar

**Platform**: Android
**Severity**: Medium
**Status**: Known, workaround tersedia
**Deskripsi**: Setelah merotasi layar (landscape ↔ portrait), beberapa elemen tidak terdeteksi oleh UIAutomator2 sampai hierarchy di-refresh manual.

**Workaround**:
```bash
# Paksa refresh hierarchy
adb shell am force-stop com.example.app
adb shell am start -n com.example.app/.MainActivity
```
Atau tambahkan `Tunggu` setelah rotasi:
```heim
Ketuk tombol "Rotate"
Tunggu 2 detik
Tunggu sampai muncul teks "Dashboard"
```

---

### BUG-002: FastInputIME keyboard tidak muncul di aplikasi tertentu

**Platform**: Android
**Severity**: Low
**Status**: Known, workaround tersedia
**Deskripsi**: Beberapa aplikasi dengan custom input method tidak merespons FastInputIME.

**Workaround**: Matikan FastInputIME sementara dan gunakan keyboard bawaan:
```bash
adb shell ime set com.android.inputmethod.latin/.LatinIME
```

---

### BUG-003: Screenshot di Web terkadang kosong pada headless mode

**Platform**: Web
**Severity**: Medium
**Status**: Known, workaround tersedia
**Deskripsi**: Pada beberapa setup headless Chromium, screenshot diambil sebelum halaman selesai render.

**Workaround**: Tunggu `networkidle` sebelum screenshot:
```python
await page.goto(url, wait_until="networkidle")
await page.screenshot(path="evidence.png")
```

---

### BUG-004: Healing tidak ter-trigger pada selector class yang berubah

**Platform**: Web
**Severity**: Low
**Status**: Known, workaround tersedia
**Deskripsi**: Jika selector hanya mengandalkan `class` yang berubah setiap build, healing chain terkadang gagal menemukan alternatif.

**Workaround**: Gunakan `data-testid` atau teks yang stabil:
```heim
# Gunakan teks atau data-testid alih-alih class
Ketuk tombol "Submit"  # text-based
# Atau
Ketuk tombol dengan data-testid "submit-btn"
```

---

### BUG-005: Parallel execution mengabaikan batas `--parallel` pada em >10

**Platform**: All
**Severity**: Low
**Status**: Known, workaround tersedia
**Deskripsi**: Jika `--parallel` diset lebih dari 10, sistem membatasi otomatis ke 10 tetapi ada warning yang kadang tidak muncul.

**Workaround**: Batasi `--parallel` ke maksimal 10 sesuai dokumentasi:
```bash
heimdall run tests/ --parallel 10
```

---

## Workarounds

### Fallback Chain untuk Selector

Jika self-healing tidak berfungsi, gunakan fallback manual eksplisit:

```heim
# Coba selector utama
Ketuk tombol "Lanjutkan"

# Fallback eksplisit jika gagal
GUNAKAN selector alt {
  Ketuk tombol "Continue"
}
```

### Restart ADB saat connection unstable

```bash
adb kill-server
adb start-server
adb devices
```

### Clear App Data untuk reset state

```bash
adb shell pm clear com.example.app
```

### Reuse Auth State di Web

```python
await context.storage_state(path="auth.json")
# Di test lain
context = await browser.new_context(storage_state="auth.json")
```

---

## Fallback Chain

Saat test gagal karena masalah environment (bukan bug aplikasi), ikuti fallback chain berikut:

```
1. Coba jalankan ulang test (flaky detection)
   → heimdall run tests/ --retry 2

2. Jika masih gagal, jalankan dengan debug log
   → heimdall run tests/ --log-level debug

3. Periksa log untuk error spesifik
   → grep -i error ~/.heimdall/logs/heimdall.log

4. Periksa health device/sistem
   → heimdall health

5. Jika device bermasalah, restart ADB atau device
   → adb kill-server && adb start-server

6. Jika masalah persisten, cek Known Bugs di halaman ini

7. Jika belum terdaftar, laporkan bug (lihat Issue Template)
```

---

## Issue Template

Gunakan template ini saat melaporkan bug baru ke [GitHub Issues](https://github.com/dhiyo7/heimdall/issues).

### Bug Report Template

```markdown
## Deskripsi Bug
[Jelaskan apa yang terjadi dengan singkat dan jelas]

## Langkah Reproduksi
1. [Langkah pertama]
2. [Langkah kedua]
3. [Langkah ketiga]

## Hasil yang Diharapkan
[Jelaskan apa yang seharusnya terjadi]

## Hasil Aktual
[Jelaskan apa yang benar-benar terjadi]

## Environment
- OS: [Ubuntu 22.04 / macOS 13 / Windows 11]
- Python version: [3.10.x]
- Heimdall version: [x.y.z]
- Platform: [Android / Web]
- Device: [Pixel 6 / emulator-5554 / Chrome 115]
- App version: [1.2.3]

## Log & Bukti
[Sertakan log relevan dan screenshot]

## Healing Event (jika relevan)
[Output dari healing_events.log]

## Apakah sudah dicoba workaround?
- [ ] Restart ADB
- [ ] Clear app data
- [ ] Re-run dengan --retry
- [ ] Periksa Known Bugs

## Additional Context
[Informasi tambahan yang relevan]
```

### Feature Request Template

```markdown
## Masalah yang Diinginkan
[Jelaskan masalah yang ingin diselesaikan]

## Solusi yang Diusulkan
[Jelaskan fitur atau perubahan yang diinginkan]

## Alternatif yang Dipertimbangkan
[Jelaskan alternatif lain jika ada]

## Additional Context
[Screenshot, mockup, atau referensi lain]
```

---

## Before Reporting

Sebelum melaporkan bug, pastikan Anda sudah:

- [ ] Membaca [Common Issues](../troubleshooting/common-issues.md) untuk solusi yang sudah ada
- [ ] Mencoba [Android Specific](../troubleshooting/android-specific.md) atau [Web Specific](../troubleshooting/web-specific.md) troubleshooting
- [ ] Menjalankan test dengan `--log-level debug` dan memeriksa log
- [ ] Menjalankan `heimdall health` untuk cek sistem
- [ ] Mencoba workaround yang relevan
- [ ] Memastikan masalah bukan flaky test (jalankan 3x)
- [ ] Mencari di [GitHub Issues](https://github.com/dhiyo7/heimdall/issues) apakah sudah dilaporkan

---

## Referensi

- [Common Issues](../troubleshooting/common-issues.md) - Masalah umum dan solusi
- [Android Specific](../troubleshooting/android-specific.md) - Masalah spesifik Android
- [Web Specific](../troubleshooting/web-specific.md) - Masalah spesifik Web
- [Debugging Tips](../best-practices/debugging-tips.md) - Workflow debug yang sistematis
