# Mulai Cepat: Test Pertama dalam 5 Menit

Panduan cepat untuk membuat dan menjalankan test pertama Anda langsung dari **aplikasi desktop Heimdall**. Ikuti langkah-langkah berurutan.

::: tip Prasyarat
- Heimdall sudah terinstall (ikuti [Instalasi](./installation.md))
- Minimal satu perangkat **Online** di menu **Devices** (HP Android atau browser Web)
:::

---

## Langkah 1: Buka Editor (1 Menit)

1. Buka aplikasi **Heimdall**.
2. Di layar utama, pilih menu **Editor** (atau klik tombol **New Test**).
3. Editor skrip `.heim` akan terbuka dengan file kosong.

---

## Langkah 2: Tulis Test Case (2 Menit)

Ketik skenario login berikut ke dalam editor:

```heim
# TEST CASE: Login Berhasil

# FITUR: Buka Aplikasi
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# FITUR: Input Data Login
Ketik "user@test.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"

# FITUR: Submit Login
Ketuk tombol "Login"

# FITUR: Validasi Dashboard
Tunggu sampai muncul teks "Dashboard"
Pastikan muncul teks "Selamat Datang"
```

### Penjelasan Singkat Setiap Perintah

| Perintah | Fungsi |
|----------|--------|
| `Buka aplikasi "..."` | Membuka aplikasi target berdasarkan package name |
| `Tunggu sampai muncul teks "..."` | Menunggu elemen muncul (menangani loading) |
| `Ketik "..." pada kolom "..."` | Mengisi form berdasarkan label/placeholder |
| `Ketuk tombol "..."` | Menekan tombol berdasarkan teks yang terlihat |
| `Pastikan muncul teks "..."` | Validasi — test **gagal** jika teks tidak ditemukan |

> Tip: Gunakan `# FITUR:` untuk mengelompokkan langkah-langkah agar tersusun rapi di laporan.

---

## Langkah 3: Jalankan Test (1 Menit)

1. Di Editor, klik tombol **Run** (atau **▶**).
2. Pilih perangkat target dari daftar yang muncul (HP Android atau browser Web).
3. Klik **Start**.

Heimdall akan:
- Membuka aplikasi di perangkat yang dipilih
- Menjalankan setiap langkah secara berurutan
- Menampilkan **progress** dan **screenshot** tiap langkah secara real-time

---

## Langkah 4: Lihat Hasil (1 Menit)

Setelah test selesai:

1. Buka menu **Reports** untuk melihat ringkasan hasil.
2. Setiap langkah ditandai **Pass** (hijau) atau **Fail** (merah).
3. Klik sebuah langkah untuk melihat **screenshot** dan detail eksekusinya.
4. Ekspor laporan jika diperlukan:
   - **JSON** — untuk diproses lebih lanjut
   - **JUnit XML** — untuk integrasi CI/CD
   - **Allure** — untuk laporan Allure yang kaya

---

## Selamat! 🎉

Anda telah berhasil:
- ✅ Menulis test case pertama dalam Bahasa Indonesia
- ✅ Menjalankannya langsung dari aplikasi desktop
- ✅ Melihat laporan hasil pengujian

---

## Next Steps

| Tujuan | Link |
|--------|------|
| Pelajari lebih banyak perintah | [Keyword DSL](../features/basic-features/keyword-DSL.md) |
| Rekam interaksi jadi skrip | [Action Recording](../features/advanced-features/action-recording.md) |
| Pakai banyak data sekaligus | [Data-Driven Testing](../features/advanced-features/data-driven-testing.md) |
| Bandingkan tampilan visual | [Visual Regression](../features/advanced-features/visual-regression.md) |
| Jalankan tanpa buka aplikasi | [Headless CLI](../features/basic-features/headsless-cli.md) |

---

## Troubleshooting Cepat

| Masalah | Solusi |
|---------|--------|
| Perangkat tidak muncul | Cek koneksi USB & USB Debugging; lihat menu **Devices** |
| Elemen tidak ditemukan | Gunakan `Ketik "..." pada kolom "urutan 1"` jika label tidak terdeteksi |
| Test gagal di tengah jalan | Tambahkan `Tunggu sampai muncul teks "..."` sebelum langkah yang gagal |
| Keyboard tidak muncul | Jalankan ulang test sekali; ini efek *Ghost Keyboard* |

---

## Cheat Sheet

Simpan sebagai referensi cepat:

```heim
# Buka aplikasi
Buka aplikasi "package.name"

# Tunggu loading
Tunggu sampai muncul teks "Indikator"

# Isi form
Ketik "teks" pada kolom "Label"
Ketik "teks" pada kolom "urutan 1"   # fallback by position

# Tekan tombol
Ketuk tombol "Teks Tombol"
Ketuk tombol "FAB"                   # Floating Action Button

# Validasi
Pastikan muncul teks "Teks Validasi"

# Scroll
Gulir ke "Bawah"
Gulir ke "Atas"
```
