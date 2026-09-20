# Keyword DSL

Keyword DSL adalah cara menulis skrip automation test Heimdall dengan perintah Bahasa Indonesia yang mudah dibaca dan dipelihara.

## Dasar-Dasar Keyword

| Keyword | Parameter | Fungsi |
|---------|-----------|--------|
| `Buka` | Package Name | Membuka aplikasi target. |
| `Ketik` | `"Teks"` pada `"Label"` | Mengisi form input. |
| `Ketik URUTAN` | `"Teks"` pada `"urutan X"` | Mengisi form berdasarkan urutan kolom di layar. |
| `Ketuk` | `"Teks Tombol"` | Menekan tombol atau elemen yang dapat diklik. |
| `Ketuk FAB` | `tombol "FAB"` | Menekan Floating Action Button. |
| `Tunggu` | `"Teks Indikator"` | Menunggu sampai teks indikator muncul. |
| `Pastikan` | `"Teks Validasi"` | Melakukan assertion atau validasi. |
| `Gulir` | `"Bawah"` / `"Atas"` | Men-scroll layar. |

## Struktur Script `.heim`

```heim
# Komentar diawali tanda pagar dan tidak dieksekusi.
# Judul: Login Skenario Positif

# FITUR: Buka Aplikasi
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# FITUR: Input Data
Ketik "user@test.com" pada kolom "Email"
Ketik "123456" pada kolom "Password"
Ketuk tombol "Masuk"

# FITUR: Validasi Dashboard
Tunggu sampai muncul teks "Halo User"
Pastikan muncul teks "Saldo Anda"
```

## Contoh Script Lengkap

```heim
# Judul: Skenario Login dengan Validasi

# FITUR: Buka Aplikasi
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# FITUR: Input Kredensial
Ketik "user@test.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"
Ketuk tombol "Masuk"

# FITUR: Validasi Hasil Login
Tunggu sampai muncul teks "Dashboard"
Pastikan muncul teks "Transaksi Terakhir"
Pastikan muncul teks "Saldo Anda"

# FITUR: Navigasi ke Profil
Ketuk tombol "Profil"
Pastikan muncul teks "Edit Profil"

# FITUR: Scroll dan Validasi Konten
Gulir "Bawah"
Pastikan muncul teks "Log Aktivitas"
```

## Tips Penulisan

- Gunakan teks yang terlihat di layar untuk `Ketuk` dan `Pastikan`.
- Jika label form tidak terdeteksi, gunakan `Ketik URUTAN` sebagai alternatif.
- Pisahkan setiap alur utama dengan tag `# FITUR:` agar lebih mudah dibaca dan dipelihara.
- Tambahkan `# Judul:` di bagian paling atas untuk identifikasi skrip.

## Troubleshooting

| Masalah | Kemungkinan Penyebab | Solusi |
|---------|----------------------|--------|
| Keyboard tidak muncul | Heimdall menggunakan FastInputIME; keyboard bawaan disembunyikan | Jalankan ulang skrip sampai selesai atau matikan FastInputIME via ADB |
| Element tidak ketemu | Label di UI berbeda dengan teks yang terlihat | Gunakan `urutan 1`, `urutan 2`, dst untuk menembak kolom input berdasarkan posisi di layar |
| Flaky selector | UI berubah-ubah atau animasi belum selesai | Tambahkan `Tunggu` sebelum aksi atau stabilkan state aplikasi sebelum eksekusi |
