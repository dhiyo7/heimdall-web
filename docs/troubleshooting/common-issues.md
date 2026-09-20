# Masalah Umum

Kumpulan masalah yang sering muncul saat menggunakan Heimdall beserta solusi langkah demi langkah.

---

## Instalasi

### Problem: `python: command not found`

**Penyebab:** Python tidak terinstall atau belum ada di PATH.

**Solusi:**
1. Install Python 3.10+ dari [python.org](https://www.python.org/downloads/)
2. Pastikan mencentang **"Add Python to PATH"** saat instalasi
3. Restart terminal setelah instalasi
4. Verifikasi dengan `python --version` atau `python3 --version`

---

### Problem: `adb: command not found`

**Penyebab:** ADB tidak terinstall atau belum ada di PATH.

**Solusi:**
1. Install [Android Platform Tools](https://developer.android.com/studio/releases/platform-tools)
2. Tambahkan lokasi ADB ke environment variable PATH
3. Restart terminal
4. Verifikasi dengan `adb version`

<details>
<summary>Instalasi ADB per OS</summary>

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install android-tools-adb android-tools-fastboot
```

**macOS:**
```bash
brew install android-platform-tools
```

**Windows:**
Download [Platform Tools](https://developer.android.com/studio/releases/platform-tools), ekstrak, dan tambahkan ke PATH.

</details>

---

### Problem: `dot: command not found`

**Penyebab:** Graphviz tidak terinstall.

**Solusi:**
1. Install Graphviz sesuai panduan di bawah
2. Verifikasi dengan `dot -V`

<details>
<summary>Instalasi Graphviz per OS</summary>

**Ubuntu/Debian:**
```bash
sudo apt install graphviz
```

**macOS:**
```bash
brew install graphviz
```

**Windows:**
Download dari [graphviz.org](https://graphviz.org/download/) dan pastikan mencentang **"Add to PATH"**.

</details>

---

### Problem: `uiautomator2 init` gagal

**Penyebab:** Device tidak terdeteksi atau USB Debugging tidak aktif.

**Solusi:**
1. Pastikan USB Debugging aktif di Developer Options device
2. Sambungkan device via USB atau jalankan emulator
3. Jalankan `adb devices` untuk cek koneksi
4. Jika menggunakan emulator, pastikan emulator berjalan sebelum `uiautomator2 init`
5. Izinkan instalasi aplikasi ATX di device jika diminta

---

### Problem: `Permission denied` saat install package

**Penyebab:** Tidak memiliki permission yang cukup atau menggunakan system Python.

**Solusi:**
- Gunakan virtual environment (direkomendasikan)
- Atau gunakan `--user` flag: `pip install --user -r requirements.txt`
- Jangan install package menggunakan `sudo` dengan system Python

---

### Problem: `ModuleNotFoundError` meskipun sudah install

**Penyebab:** Virtual environment tidak aktif atau PATH belum di-set.

**Solusi:**
```bash
# Aktifkan virtual environment terlebih dahulu
source venv/bin/activate  # Linux/macOS
# atau
.\venv\Scripts\activate   # Windows

# Kemudian coba lagi
pip install -r requirements.txt
```

---

### Problem: Instalasi `uiautomator2` lambat/stuck

**Penyebab:** Network lambat atau mirror PyPI tidak optimal.

**Solusi:**
```bash
# Gunakan mirror yang lebih cepat (opsional)
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# Atau dengan timeout lebih panjang
pip install -r requirements.txt --timeout 120
```

---

## Koneksi Device

### Problem: Device tidak terdeteksi (`adb devices` kosong)

**Penyebab:** Kabel USB rusak, driver tidak terinstall, atau USB Debugging tidak aktif.

**Solusi:**
1. Coba ganti kabel USB
2. Pastikan USB Debugging aktif di Developer Options
3. Unlock device sebelum menghubungkan
4. Jalankan `adb kill-server && adb start-server`
5. Pada Windows, install driver yang sesuai
6. Jika menggunakan emulator, pastikan AVD berjalan

---

### Problem: `adb devices` menunjukkan `unauthorized`

**Penyebab:** RSA key belum di-accept di device.

**Solusi:**
1. Lepas dan sambungkan kembali kabel USB
2. Di device, muncul dialog prompt untuk allow USB debugging - tekan "OK"
3. Jika dialog tidak muncul, matikan dan aktifkan kembali USB Debugging

---

### Problem: Device terhubung tapi test gagal dengan `connection refused`

**Penyebab:** Port yang digunakan oleh driver tertutup atau diblokir.

**Solusi:**
1. Cek apakah ada proses lain yang menggunakan port yang sama: `adb forward --list`
2. Hapus forwarding yang tertahan: `adb forward --remove-all`
3. Restart ADB: `adb kill-server && adb start-server`
4. Restart device jika perlu

---

### Problem: Device sering disconnected saat test berjalan

**Penyebab:** Kabel USB longgar, battery low, atau USB debugging terputus.

**Solusi:**
1. Gunakan kabel USB yang berkualitas baik
2. Matikan screen lock agar device tidak sleep
3. Pastikan battery di atas 20%
4. Gunakan emulator jika device fisik tidak stabil

---

## Eksekusi Test

### Problem: Test berjalan lambat

**Penyebab:** Device lambat, animasi aktif, atau selector terlalu rapuh.

**Solusi:**
1. Matikan animasi di Developer Options: `Animation scale` = `0.5x` atau `Off`
2. Gunakan selector yang lebih stabil (text atau resource-id)
3. Kurangi `--parallel` jika terlalu banyak proses bersamaan
4. Aktifkan device throttling untuk simulasi kondisi standar

---

### Problem: Test flaky (kadang berhasil, kadang gagal)

**Penyebab:** Race condition, animasi, atau selector yang tidak stabil.

**Solusi:**
1. Tambahkan `Tunggu` sebelum aksi yang membutuhkan elemen muncul
2. Gunakan explicit wait daripada sleep: `Tunggu sampai muncul teks "Loading" selesai`
3. Stabilkan state aplikasi sebelum test dimulai
4. Perbaiki selector yang bergantung pada posisi atau index
5. Gunakan `--retry` untuk menjalankan ulang test yang gagal:

```bash
heimdall run tests/ --retry 2
```

---

### Problem: `Element tidak ketemu` meskipun elemen terlihat di layar

**Penyebab:** Selector salah atau aplikasi sedang dalam transisi.

**Solusi:**
1. Gunakan `heimdall inspect` untuk melihat selector yang tersedia
2. Gunakan teks yang persis seperti di layar (case-sensitive)
3. Tambahkan `Tunggu` sebelum aksi
4. Jika label form tidak terdeteksi, gunakan `Ketik URUTAN`:

```heim
# Alternatif jika selector teks tidak bekerja
Ketik "user@test.com" pada kolom "urutan 1"
```

---

### Problem: Keyboard tidak muncul

**Penyebab:** Heimdall menggunakan FastInputIME (Ghost Keyboard) untuk input cepat.

**Solusi:**
1. Tunggu sampai skrip selesai - keyboard akan kembali normal
2. Atau matikan FastInputIME via ADB:

```bash
adb shell ime set com.android.inputmethod.latin/.LatinIME
```

3. Jika keyboard muncul tapi tidak bisa diketik, restart aplikasi

---

### Problem: Timeout saat menunggu elemen

**Penyebab:** Elemen tidak muncul dalam batas waktu yang ditentukan.

**Solusi:**
1. Tingkatkan timeout di konfigurasi:

```json
{
  "timeout": {
    "default": 30,
    "waitForElement": 15
  }
}
```

2. Periksa apakah aplikasi sedang loading atau freeze
3. Periksa network koneksi jika aplikasi memuat data dari internet
4. Gunakan `Tunggu sampai muncul teks` dengan timeout lebih panjang:

```heim
Tunggu 30 detik sampai muncul teks "Dashboard"
```

---

## Report

### Problem: Report tidak terbuat atau kosong

**Penyebab:** Permission direktori output tidak cukup atau test tidak ada yang dijalankan.

**Solusi:**
1. Pastikan direktori output ada dan bisa ditulis:

```bash
mkdir -p ./reports/
chmod 755 ./reports/
```

2. Verifikasi ada test yang dijalankan: `heimdall run tests/ --report json`
3. Cek apakah ada error selama eksekusi

---

### Problem: Report format tidak sesuai ekspektasi

**Penyebab:** Flag atau format yang digunakan salah.

**Solusi:**
- Gunakan flag yang benar: `--report junit-xml`, `--report allure`, atau `--report json`
- Periksa dokumentasi format untuk struktur yang diharapkan
- Gunakan `--output` untuk menentukan lokasi penyimpanan:

```bash
heimdall run tests/ --report allure --output ./allure-report/
```

---

### Problem: Visual regression baseline tidak ditemukan

**Penyebab:** Baseline belum diupload atau path salah.

**Solusi:**
1. Upload baseline menggunakan BaselineManager atau API
2. Pastikan nama file mengikuti format: `baseline_<testcase_id>_<platform>_<device>.png`
3. Verifikasi baseline tersimpan di direktori yang benar

---

## Masalah Lainnya

### Problem: Aplikasi crash saat test berjalan

**Penyebab:** Aplikasi memiliki bug atau tidak stabil pada kondisi tertentu.

**Solusi:**
1. Ambil log dari aplikasi: `adb logcat | grep <package_name>`
2. Cek apakah crash terjadi pada langkah tertentu
3. Jalankan aplikasi secara manual untuk reproduce crash
4. Laporkan bug ke tim development dengan menyertakan log dan screenshot

---

### Problem: Test gagal di CI/CD tapi berhasil di lokal

**Penyebab:** Perbedaan lingkungan (device, resolusi, OS version, data).

**Solusi:**
1. Gunakan emulator dengan konfigurasi yang sama di lokal dan CI/CD
2. Jangan gunakan data lokal - gunakan test data yang di-commit ke repository
3. Pastikan versi aplikasi yang diuji sama
4. Tambahkan cleanup step di CI/CD pipeline untuk reset state

---

### Problem: `heimdall` command tidak ditemukan setelah install

**Penyebab:** Script entry point belum di-install atau PATH belum di-set.

**Solusi:**
```bash
# Install ulang dalam editable mode
pip install -e .

# Atau gunakan python module
python -m heimdall --help

# Verifikasi instalasi
which heimdall  # Linux/macOS
where heimdall  # Windows
```

---

## Checklist Umum

- [ ] Python 3.10+ terinstall
- [ ] ADB terinstall dan terdeteksi (`adb devices`)
- [ ] Device terhubung dan dalam keadaan unlocked
- [ ] USB Debugging aktif
- [ ] uiautomator2 sudah diinit (`python -m uiautomator2 init`)
- [ ] Virtual environment aktif
- [ ] Semua dependencies terinstall
- [ ] Aplikasi target terinstall di device
- [ ] Healt check berjalan (`heimdall health`)

---

## Referensi

- [Android Specific Troubleshooting](../troubleshooting/android-specific.md) - Masalah spesifik Android
- [Web Specific Troubleshooting](../troubleshooting/web-specific.md) - Masalah spesifik Web
- [Persistent Issues](../troubleshooting/persistent-issues.md) - Bug yang sudah diketahui
