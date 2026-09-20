# Troubleshooting Android

Panduan pemecahan masalah spesifik untuk otomatisasi Android menggunakan Heimdall.

---

## ADB Issues

### Problem: `adb: command not found`

**Penyebab:** Android SDK Platform-Tools tidak terinstall atau tidak ada di PATH.

**Solusi:**
```bash
# Ubuntu/Debian
sudo apt install android-tools-adb android-tools-fastboot

# macOS
brew install android-platform-tools

# Windows
# Download dari developer.android.com, ekstrak, tambahkan ke PATH
```

Verifikasi instalasi:
```bash
adb version
```

---

### Problem: `adb devices` menampilkan `List of devices attached` tapi kosong

**Penyebab:** Device tidak terhubung, USB debugging tidak aktif, atau driver bermasalah.

**Solusi:**
1. Coba ganti kabel USB
2. Pastikan USB Debugging aktif (Settings > Developer Options > USB Debugging)
3. Unlock device sebelum menghubungkan
4. Restart ADB:

```bash
adb kill-server
adb start-server
adb devices
```

5. Jika menggunakan emulator, pastikan AVD berjalan:

```bash
adb devices
# Harus menampilkan emulator-5554 device
```

---

### Problem: `adb devices` menampilkan `unauthorized`

**Penyebab:** RSA key belum di-accept di device.

**Solusi:**
1. Lepas dan sambungkan kembali kabel USB
2. Di device, akan muncul dialog "Allow USB debugging?" - tekan **OK**
3. Jika tidak muncul dialog, matikan dan aktifkan kembali USB Debugging
4. Restart device jika perlu

---

### Problem: ADB lambat atau timeout

**Penyebab:** Kabel USB rusak, USB mode salah, atau device overloaded.

**Solusi:**
1. Ganti kabel USB ke kabel berkualitas
2. Ubah USB mode ke **File Transfer** atau **PTP** (jika tidak membutuhkan MTP)
3. Tutup aplikasi berat di device
4. Restart ADB:

```bash
adb kill-server
adb start-server
```

5. Periksa apakah ada proses ADB lain yang menggantung:

```bash
ps aux | grep adb
```

---

### Problem: `adb forward` gagal dengan `already registered`

**Penyebab:** Port forwarding sebelumnya masih tertahan.

**Solusi:**
```bash
# Hapus semua forwarding
adb forward --remove-all

# Verifikasi
adb forward --list

# Coba lagi
adb forward tcp:7912 tcp:7912
```

---

### Problem: ADB over WiFi tidak stabil

**Penyebab:** Koneksi wireless tidak stabil atau device masuk sleep.

**Solusi:**
1. Pastikan device dan komputer di jaringan WiFi yang sama
2. Matikan screen lock agar device tidak sleep
3. Pertahankan koneksi dengan menjalankan periodic ping:

```bash
adb shell svc wifi disable && adb shell svc wifi enable
```

---

## Device Problems

### Problem: Device sering disconnected saat test

**Penyebab:** Kabel USB longgar, battery low, atau USB debugging terputus.

**Solusi:**
1. Gunakan kabel USB berkualitas
2. Matikan screen lock agar device tidak sleep
3. Pastikan battery di atas 20%
4. Gunakan emulator jika device fisik tidak stabil

---

### Problem: Device lambat, test timeout

**Penyebab:** Device dengan spesifikasi rendah atau terlalu banyak proses berjalan.

**Solusi:**
1. Matikan aplikasi lain di device: `adb shell am force-stop <package>`
2. Bersihkan cache: `adb shell pm clear <package>`
3. Aktifkan developer options > limit background processes
4. Gunakan device dengan spesifikasi lebih tinggi untuk test
5. Restart device untuk membersihkan memory

---

### Problem: Emulator lambat atau crash

**Penyebab:** Hardware acceleration tidak aktif atau resource komputer tidak cukup.

**Solusi:**
1. Aktifkan hardware acceleration:

```bash
# Intel HAXM (Windows/macOS)
# Install dari SDK Manager Android Studio

# KVM (Linux)
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients
sudo adduser $USER kvm
```

2. Gunakan emulator dengan resolusi rendah untuk kecepatan
3. Tutup aplikasi lain yang menggunakan banyak memory
4. Gunakan cold boot daripada quick boot:

```bash
emulator -avd <avd_name> -no-snapshot-load
```

---

### Problem: Device dalam keadaan `offline`

**Penyebab:** Device tidak merespons ADB karena sleep atau proses ADB menggantung.

**Solusi:**
```bash
# Restart ADB
adb kill-server
adb start-server

# Jika masih offline, restart device
adb reboot
```

---

## App Problems

### Problem: Aplikasi tidak terinstall

**Penyebab:** APK rusak, signature mismatch, atau storage penuh.

**Solusi:**
1. Cek storage device: `adb shell df /data`
2. Uninstall aplikasi sebelumnya:

```bash
adb uninstall com.example.app
```

3. Install ulang:

```bash
adb install path/to/app.apk
```

4. Jika masih gagal, coba dengan `-r` flag (replace):

```bash
adb install -r path/to/app.apk
```

---

### Problem: Aplikasi crash saat dibuka

**Penyebab:** APK corrupt, incompatible dengan OS version, atau bug di aplikasi.

**Solusi:**
1. Cek log aplikasi:

```bash
adb logcat | grep <package_name>
```

2. Bersihkan data aplikasi:

```bash
adb shell pm clear com.example.app
```

3. Uninstall dan install ulang
4. Cek compatibility APK dengan OS version device

---

### Problem: Aplikasi tidak muncul di launcher

**Penyebab:** Activity utama tidak terdaftar atau launchMode salah.

**Solusi:**
1. Cek activity yang tersedia:

```bash
adb shell cmd package resolve-activity -c android.intent.category.LAUNCHER com.example.app
```

2. Jalankan langsung activity:

```bash
adb shell am start -n com.example.app/.MainActivity
```

3. Jika activity tidak ditemukan, periksa `AndroidManifest.xml`

---

### Problem: Data aplikasi tidak ter-reset antar test

**Penyebab:** Aplikasi tidak di-clear setelah test sebelumnya.

**Solusi:**
1. Clear data sebelum test dimulai:

```bash
adb shell pm clear com.example.app
```

2. Atau uninstall dan install ulang:

```bash
adb uninstall com.example.app
adb install app.apk
```

3. Tambahkan cleanup di test script atau fixture

---

## Permission

### Problem: Permission tidak di-grant secara otomatis

**Penyebab:** Android 6.0+ memerlukan runtime permission untuk beberapa akses.

**Solusi:**
```bash
# Grant permission secara manual
adb shell pm grant com.example.app android.permission.CAMERA
adb shell pm grant com.example.app android.permission.READ_CONTACTS

# Atau gunakan auto-grant (butuh root)
adb shell pm grant com.example.app android.permission.POST_NOTIFICATIONS
```

### Problem: Permission di-revoke saat test berjalan

**Penyebab:** Aplikasi di-reinstall atau clear data.

**Solusi:**
- Grant ulang permission setelah clear data
- Atau gunakan `adb install -g` untuk auto-grant all permissions:

```bash
adb install -g app.apk
```

---

## FastInputIME / Keyboard

### Problem: Keyboard tidak muncul saat input

**Penyebab:** Heimdall menggunakan FastInputIME (Ghost Keyboard) untuk input cepat, keyboard bawaan disembunyikan.

**Solusi:**
1. Tunggu sampai skrip selesai - keyboard akan kembali normal
2. Atau matikan FastInputIME via ADB:

```bash
adb shell ime set com.android.inputmethod.latin/.LatinIME
```

3. Set default keyboard kembali:

```bash
adb shell ime set com.android.inputmethod.latin/.LatinIME
```

---

### Problem: FastInputIME tidak terinstall

**Penyebab:** APK FastInputIME belum diinstall di device.

**Solusi:**
```bash
# Install FastInputIME APK
adb install -r path/to/FastInputIME.apk

# Set sebagai default IME
adb shell ime set com.github.uiautomator/.FastInputIME
```

---

### Problem: Input tidak bekerja di某些 aplikasi

**Penyebab:** Beberapa aplikasi menggunakan custom input method yang tidak kompatibel.

**Solusi:**
1. Coba gunakan `Ketik` dengan input method bawaan (matikan FastInputIME sementara)
2. Atau gunakan ADB input command:

```bash
adb shell input text "hello world"
```

3. Gunakan `Ketik URUTAN` jika input field tidak terdeteksi

---

## Performance

### Problem: UIAutomator2 lambat

**Penyebab:** Hierarchy UI besar atau device lambat.

**Solusi:**
1. Gunakan selector yang spesifik, jangan dump seluruh hierarchy:

```python
# Jangan
driver.dump_hierarchy()

# Lakukan
driver(text="Login").exists
```

2. Gunakan `resource-id` untuk akses cepat
3. Cache selector yang sering digunakan

---

### Problem: Screenshot lambat atau kosong

**Penyebab:** Device overloaded atau permission tidak ada.

**Solusi:**
```bash
# Cek apakah screenshot berfungsi
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png .

# Jika berhasil, masalah di sisi Heimdall
# Cek permission storage
adb shell pm grant com.example.app android.permission.WRITE_EXTERNAL_STORAGE
```

---

### Problem: Touch event tidak terdaftar dengan benar

**Penyebab:** Koordinat salah atau layar dalam keadaan scaled.

**Solusi:**
```bash
# Cek resolusi layar
adb shell wm size

# Jika ada scaling
adb shell wm density

# Reset density jika perlu
adb shell wm density reset
```

---

## Checklist Android

Gunakan checklist ini saat mengatasi masalah Android:

- [ ] ADB terinstall dan terdeteksi (`adb devices`)
- [ ] Device terhubung dan dalam keadaan unlocked
- [ ] USB Debugging aktif
- [ ] uiautomator2 sudah diinit
- [ ] Aplikasi target terinstall
- [ ] Permission yang dibutuhkan sudah di-grant
- [ ] FastInputIME terinstall dan aktif (jika digunakan)
- [ ] Device tidak dalam keadaan low battery
- [ ] Hardware acceleration aktif untuk emulator
- [ ] Log diperiksa untuk error spesifik

---

## Referensi

- [Common Issues](../troubleshooting/common-issues.md) - Masalah umum di semua platform
- [Web Specific Troubleshooting](../troubleshooting/web-specific.md) - Masalah spesifik Web
- [Debugging Tips](../best-practices/debugging-tips.md) - Workflow debugging
