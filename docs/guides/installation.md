# Instalasi Aplikasi Heimdall

Panduan ini menjelaskan cara mengunduh, menginstal, dan menyiapkan **aplikasi desktop Heimdall** di komputer Anda. Heimdall tersedia untuk **Windows**, **macOS**, dan **Linux**.

::: tip Tujuan Panduan Ini
Panduan ini untuk **pengguna akhir (QA Engineer)** yang ingin menggunakan aplikasi Heimdall. Jika Anda ingin menjalankan test lewat command line (CLI) atau berkontribusi ke kode, lihat [Fitur Headless CLI](../features/basic-features/headsless-cli.md) dan [Contributing](../guides/contributing.md).
:::

---

## 1. Unduh Heimdall

Buka halaman unduhan resmi dan pilih installer sesuai sistem operasi Anda:

| Sistem Operasi | Format Installer | Catatan |
|---------------|-----------------|--------|
| **Windows**   | `.exe` / `.msi` | Jalankan sebagai Administrator saat instalasi |
| **macOS**     | `.dmg`          | Didukung Intel & Apple Silicon (M1/M2/M3) |
| **Linux**     | `.AppImage` / `.deb` | `.AppImage` tidak perlu instalasi; cukup jadikan executable |

::: warning Verifikasi Keamanan
Selalu unduh dari situs resmi atau rilis GitHub Heimdall. Jangan mengunduh installer dari sumber pihak ketiga.
:::

---

## 2. Instalasi per Sistem Operasi

### Windows
1. Klik dua kali file `Heimdall-Setup.exe` (atau `.msi`).
2. Ikuti wizard instalasi.
3. Jika muncul peringatan SmartScreen, pilih **"Tetap jalankan"** (karena aplikasi baru/indie).
4. Setelah selesai, buka Heimdall dari Start Menu.

### macOS
1. Buka file `.dmg`.
2. Seret ikon **Heimdall** ke folder `Applications`.
3. Saat pertama kali membuka, macOS mungkin menampilkan *"App dari developer tidak teridentifikasi"*. Buka dengan cara: **Klik kanan → Open**, lalu pilih **Open** pada dialog.
4. Heimdall siap digunakan dari Launchpad.

### Linux
- **`.AppImage`**: Berikan izin executable lalu jalankan:
  ```bash
  chmod +x Heimdall-*.AppImage
  ./Heimdall-*.AppImage
  ```
- **`.deb`** (Debian/Ubuntu):
  ```bash
  sudo dpkg -i Heimdall-*.deb
  ```

---

## 3. Siapkan Perangkat Android

Heimdall mengotomatisasi aplikasi Android melalui koneksi USB. Lakukan langkah berikut **sekali saja** per komputer:

### 3.1 Aktifkan USB Debugging di HP
1. Buka **Settings → About Phone**.
2. Tap **Build Number** sebanyak 7 kali untuk mengaktifkan *Developer Options*.
3. Buka **Settings → System → Developer Options**.
4. Aktifkan **USB Debugging**.
5. (Opsional) Aktifkan **USB Debugging (Security Settings)** agar input teks lebih lancar.

### 3.2 Hubungkan HP ke Komputer
1. Sambungkan HP via kabel USB.
2. Pada HP, pilih mode **"Transfer File (MTP)"** (bukan "Charge only").
3. Izinkan dialog **"Allow USB debugging?"** dan centang *"Always allow from this computer"*.

### 3.3 Verifikasi di Heimdall
1. Buka aplikasi Heimdall.
2. Masuk ke menu **Devices**.
3. HP Anda akan muncul dengan status **Online** jika berhasil terdeteksi.

::: tip Tidak terdeteksi?
Lihat [Troubleshooting: Android Specific](../troubleshooting/android-specific.md).
:::

---

## 4. Siapkan untuk Pengujian Web

Heimdall menggunakan browser berbasis Chromium untuk mengotomatisasi aplikasi web.

1. Pastikan **Google Chrome** atau **Microsoft Edge** terinstall di komputer.
2. Buka menu **Devices** di Heimdall.
3. Pada tab **Web**, klik **Connect Browser** untuk mendeteksi browser yang tersedia.
4. Browser akan muncul sebagai perangkat bertipe **Web** dengan status **Online**.

---

## 5. Verifikasi Instalasi

Setelah instalasi dan koneksi perangkat berhasil:

1. Buka Heimdall.
2. Di menu **Dashboard**, pastikan perangkat Anda muncul dengan status **Online**.
3. Lanjut ke [Mulai Cepat](./quick-start.md) untuk membuat test pertama Anda.

---

## Langkah Selanjutnya

- [Mulai Cepat](./quick-start.md) — buat dan jalankan test pertama dalam 5 menit
- [Menulis Test Pertama](../tutorials/getting-started/writing-first-test.md) — panduan menulis skrip `.heim`
- [Overview Fitur](../features/overview.md) — lihat semua fitur Heimdall

---

## Checklist Instalasi

Gunakan checklist ini untuk memastikan instalasi Anda berhasil:

- [ ] Heimdall terinstall di Windows / macOS / Linux
- [ ] Aplikasi Heimdall bisa dibuka
- [ ] USB Debugging aktif di HP Android
- [ ] HP terhubung via USB dan muncul **Online** di menu Devices
- [ ] Browser (Chrome/Edge) terdeteksi untuk pengujian Web
