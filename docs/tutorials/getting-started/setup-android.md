# Persiapan Android: USB Debugging, uiautomator2 Init, Koneksi Device, Verifikasi, dan Troubleshooting

Tutorial ini memandu Anda menyiapkan perangkat Android agar bisa diotomasi oleh Heimdall. Ikuti langkah-langkah secara berurutan sebelum menjalankan test case apa pun.

---

## Prasyarat

Pastikan sistem Anda sudah memenuhi persyaratan berikut:

- [ ] Python 3.10+ terinstall
- [ ] ADB (Android Debug Bridge) terinstall dan sudah ada di PATH
- [ ] USB debugging diaktifkan di perangkat Android
- [ ] Heimdall sudah terinstall (`pip install -r requirements.txt`)

Jika belum menginstall Heimdall, ikuti [Installation Guide](../guides/installation.md) terlebih dahulu.

---

## Langkah 1: Aktifkan USB Debugging

USB Debugging adalah fitur Developer yang memungkinkan komputer/komando seperti ADB dan uiautomator2 mengontrol device dari PC.

### 1.1 Buka Developer Options

1. Buka **Settings** di perangkat Android.
2. Buka **About Phone** (atau **About Device**).
3. Cari **Build Number**.
4. Ketuk **Build Number** sebanyak **7 kali**.
5. Muncul pesan **"You are now a developer!"**.

### 1.2 Aktifkan USB Debugging

1. Buka **Settings** → **System** → **Developer Options**.
2. Aktifkan **USB Debugging**.
3. Aktifkan **USB Debugging (Security Settings)** jika tersedia. Ini sangat disarankan agar Heimdall bisa input teks dengan cepat.

> **Catatan keamanan:** USB Debugging hanya boleh diaktifkan saat development. Matikan kembali jika tidak digunakan untuk menghindari akses tidak sah.

---

## Langkah 2: Sambungkan Device ke Komputer

Gunakan kabel USB untuk menghubungkan perangkat Android ke komputer.

### 2.1 Verifikasi Deteksi Device

```bash
# Lihat daftar device yang terhubung
adb devices
```

Output yang diharapkan:

```text
List of devices attached
emulator-5554   device
```

Atau untuk device fisik:

```text
List of devices attached
a1b2c3d4e5f6    device
```

Jika status muncul `unauthorized`, cek layar device dan izinkan koneksi USB Debugging.

### 2.2 Troubleshooting Koneksi

| Status | Arti | Solusi |
|--------|------|--------|
| `device` | Terhubung dan siap | OK, lanjut ke langkah berikut |
| `unauthorized` | Belum diizinkan | Izinkan USB debugging di popup device |
| `offline` | Koneksi terputus | Cabut dan colok kembali kabel USB |
| Tidak muncul | Tidak terdeteksi | Pastikan USB debugging aktif dan driver terinstall |

---

## Langkah 3: Inisialisasi uiautomator2

uiautomator2 adalah automation driver yang digunakan Heimdall untuk berinteraksi dengan UI Android. Perintah `init` menginstall aplikasi pendukung **ATX** di device.

```bash
python -m uiautomator2 init
```

Proses ini akan:

1. Mengirim APK ATX ke device.
2. Menginstall aplikasi **ATX**.
3. Mengonfigurasi aksesibilitas otomatis.

> **Penting:** Izinkan instalasi aplikasi **ATX** di layar device saat diminta. Jika ada notifikasi **"Install via USB"**, aktifkan juga opsi tersebut di Developer Options.

### Verifikasi uiautomator2

Setelah `init`, pastikan ATX terinstall:

```bash
# Cek package ATX
adb shell pm list packages | grep atx
```

Output yang diharapkan:

```text
package:com.github.uiautomator2
package:com.github.uiautomator2.test
```

---

## Langkah 4: Persiapan Tambahan untuk Device Fisik

Jika Anda menggunakan perangkat fisik, ada beberapa tambahan yang perlu diperiksa.

### 4.1 Install Driver (Windows)

Jika device tidak terdeteksi di Windows:

1. Download driver Google USB Driver.
2. Atau gunakan driver khusus vendor device Anda.
3. Restart ADB server setelah install driver:

```bash
adb kill-server
adb start-server
adb devices
```

### 4.2 Matikan Keyboard Bawaan (Opsional tapi Disarankan)

Heimdall menggunakan **FastInputIME** untuk input teks yang cepat. Keyboard bawaan bisa disembunyikan otomatis, tetapi jika muncul gangguan:

```bash
# Matikan keyboard bawaan (jika mengganggu)
adb shell settings put secure show_ime_with_hard_keyboard 0
```

Jika keyboard FastInputIME tidak muncul dan input gagal:

```bash
# Aktifkan FastInputIME
adb shell ime set com.github.uiautomator2/.FastInputIME
```

### 4.3 Unlock Screen dan Matikan Lock Pattern

Pastikan device tidak terkunci saat test dijalankan:

- Matikan **screen lock** (PIN/pattern/password).
- Atau pastikan script memiliki step `unlock` sebelum interaksi.

---

## Langkah 5: Verifikasi Koneksi Penuh

Jalankan seluruh verifikasi berikut untuk memastikan setup Android berhasil.

```bash
# 1. Cek ADB bisa mendeteksi device
adb devices

# 2. Cek uiautomator2 terinstall
python -c "import uiautomator2; print(uiautomator2.__version__)"

# 3. Cek koneksi ATX
python -m uiautomator2 init

# 4. Test koneksi dasar via Python
python -c "import uiautomator2 as u2; d = u2.connect(); print(d.info)"
```

Output yang diharapkan dari langkah 4:

```text
{'displayWidth': 1080, 'displayHeight': 2340, 'displayRotation': 0, 'displaySizeDpX': 411, 'displaySizeDpY': 896, 'currentPackageName': 'com.android.launcher', 'sdkInt': 33, 'naturalOrientation': 'portrait', ...}
```

---

## Langkah 6: Persiapan untuk Menggunakan Emulator (Opsional)

Jika tidak memiliki device fisik, Anda bisa menggunakan emulator Android.

### 6.1 Buat AVD (Android Virtual Device)

```bash
# Install Android Studio atau hanya commandline tools
# Buat AVD baru
avdmanager create avd -n heimdall-avd -k "system-images;android-33;google_apis;x86_64"
```

### 6.2 Jalankan Emulator

```bash
# Jalankan emulator
emulator -avd heimdall-avd -no-snapshot -no-window
```

### 6.3 Sambungkan ke Emulator

```bash
# Cek emulator terdeteksi
adb devices

# Output yang diharapkan:
# List of devices attached
# emulator-5554   device
```

### 6.4 Inisialisasi uiautomator2

```bash
python -m uiautomator2 init
```

> **Catatan:** Pastikan emulator sudah fully boot sebelum menjalankan `uiautomator2 init`.

---

## Troubleshooting Android

### Problem: `adb: command not found`

**Penyebab:** ADB tidak terinstall atau belum ada di PATH.

**Solusi:**

<details>
<summary>Ubuntu/Debian</summary>

```bash
sudo apt update
sudo apt install android-tools-adb android-tools-fastboot
```
</details>

<details>
<summary>macOS</summary>

```bash
brew install android-platform-tools
```
</details>

<details>
<summary>Windows</summary>

Download [Platform Tools](https://developer.android.com/studio/releases/platform-tools), ekstrak ke folder mudah diakses, lalu tambahkan ke **PATH**.
</details>

---

### Problem: `uiautomator2 init` gagal atau lambat

**Penyebab:** Device tidak terdeteksi, USB debugging tidak aktif, atau network lambat saat download APK.

**Solusi:**

1. Pastikan USB debugging aktif.
2. Sambungkan device via USB.
3. Jalankan `adb devices` untuk cek koneksi.
4. Jika menggunakan emulator, pastikan emulator berjalan sepenuhnya.
5. Izinkan instalasi aplikasi ATX di device jika diminta.
6. Cek network atau gunakan mirror yang lebih cepat:

```bash
# Set mirror pip jika install package lambat
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

---

### Problem: Device muncul `unauthorized`

**Penyebab:** USB debugging belum diizinkan di layar device.

**Solusi:**

1. Cabut dan colok kembali kabel USB.
2. Lihat layar device, akan muncul dialog **"Allow USB debugging?"**.
3. Centang **Always allow from this computer**.
4. Tap **OK**.

---

### Problem: Device muncul `offline`

**Penyebab:** Koneksi USB terganggu.

**Solusi:**

```bash
# Restart ADB server
adb kill-server
adb start-server
adb devices
```

Jika masih offline, coba ganti kabel USB atau port USB.

---

### Problem: `Permission denied` saat install uiautomator2 / ATX

**Penyebab:** Device belum mengizinkan instalasi dari PC.

**Solusi:**

1. Aktifkan **Install via USB** di Developer Options.
2. Aktifkan **USB debugging (Security Settings)**.
3. Restart device jika perlu.

---

### Problem: `uiautomator2` module tidak ditemukan

**Penyebab:** Python environment salah atau virtual environment tidak aktif.

**Solusi:**

```bash
# Pastikan virtual environment aktif
source venv/bin/activate  # Linux/macOS
# atau
.\venv\Scripts\activate   # Windows (Git Bash/PowerShell)

# Install ulang jika perlu
pip install -r requirements.txt
```

---

### Problem: Keyboard bawaan muncul dan mengganggu input

**Penyebab:** FastInputIME belum aktif sebagai default input method.

**Solusi:**

```bash
# Set FastInputIME sebagai default
adb shell ime set com.github.uiautomator2/.FastInputIME
```

Jika perlu kembalikan ke keyboard bawaan:

```bash
adb shell ime reset
```

---

### Problem: `No devices/emulators found` saat test dijalankan

**Penyebab:** ADB tidak bisa menemukan device saat runtime.

**Solusi:**

```bash
# Cek ulang device
adb devices

# Restart ADB
adb kill-server
adb start-server
```

---

### Problem: Screen mati saat test berjalan lama

**Penyebab:** Screen timeout mematikan layar, interaksi jadi gagal.

**Solusi:**

```bash
# Matikan screen timeout
adb shell settings put system screen_off_timeout 1800000

# Atau pastikan device dicolok ke charger agar tidak sleep
```

---

### Problem: uiautomator2 init bekerja tapi screenshot hitam

**Penyebab:** Permission display atau secure flag.

**Solusi:**

```bash
# Pastikan tidak ada secure flag yang memblokir screenshot
adb shell settings put global policy_control immersive.full=*
```

---

## Checklist Verifikasi Setup Android

Gunakan checklist ini untuk memastikan setup Anda benar-benar siap:

- [ ] USB debugging aktif di Developer Options
- [ ] Device terdeteksi oleh `adb devices`
- [ ] Status device adalah `device` (bukan `unauthorized` atau `offline`)
- [ ] `python -m uiautomator2 init` berhasil dijalankan
- [ ] Aplikasi **ATX** terinstall di device
- [ ] FastInputIME aktif dan siap pakai
- [ ] `python -c "import uiautomator2 as u2; d = u2.connect(); print(d.info)"` menampilkan info device

Setelah checklist di atas terpenuhi, Anda siap melanjutkan ke:

- [Setup Web](../tutorials/getting-started/setup-web.md)
- [Menulis Test Pertama](../tutorials/getting-started/writing-first-test.md)
- [Menjalankan Test](../tutorials/getting-started/running-tests.md)
