# Manajemen Selector

Panduan untuk memilih, mengelola, dan menjaga selector agar test tetap stabil dan mudah dipelihara.

---

## Strategi Selector

### Apa itu Selector

Selector adalah cara Heimdall menemukan elemen UI di layar. Pada Android, selector bisa berupa `text`, `resource-id`, `content-desc`, atau `xpath`. Pada Web, selector bisa berupa `text`, `css selector`, `xpath`, atau `role`.

### Prinsip Pemilihan Selector

| Prioritas | Android | Web | Alasan |
|-----------|---------|-----|--------|
| 1 | `text` | `text` | Paling stabil, cocok dengan yang terlihat pengguna |
| 2 | `resource-id` | `css selector` | Unik dan tidak berubah seperti teks |
| 3 | `content-desc` | `role + name` | Aksesibilitas-friendly |
| 4 | `xpath` (by text) | `xpath` (by role) | Fleksibel tapi rapuh |
| 5 | `class` + `bounds` | `class` (partial) | Paling rapuh, gunakan sebagai last resort |

### Tips Pemilihan

- **Gunakan teks yang terlihat** - `Ketuk tombol "Masuk"` lebih baik daripada `Ketuk tombol dengan class "android.widget.Button"`
- **Hindari index hardcoded** - `urutan 1` bergantung pada layout yang bisa berubah. Gunakan hanya sebagai fallback.
- **Gunakan resource-id jika tersedia** - Lebih stabil karena tidak berganti setiap build.
- **Jangan gunakan xpath jika ada alternatif lain** - xpath lebih rapuh dan lambat.

---

## Priority Chain

### Android (UIAutomator2)

Urutan fallback yang digunakan oleh Self-Healing Engine:

```
1. text (exact match)
2. resource-id
3. content-desc
4. xpath (by text)
5. class + bounds (within parent)
```

### Web (Playwright)

Urutan fallback yang digunakan oleh Self-Healing Engine:

```
1. text (exact/partial)
2. css selector
3. xpath (by text/role)
4. role + name
5. class (partial match)
```

### Contoh Fallback Manual

Jika selector utama gagal, Anda bisa menentukan fallback manual menggunakan keyword `GUNAKAN selector alt`:

```heim
# Coba selector utama terlebih dahulu
Ketuk tombol "Lanjutkan"

# Jika gagal, coba alternatif
GUNAKAN selector alt {
  Ketuk tombol "Continue"
}

# Bisa juga dengan batas percobaan
Ketuk tombol "Next"
GUNAKAN selector alt {
  Ketuk tombol "Lanjut" 1
}
```

### Priority Chain di Konfigurasi

```json
{
  "selfHealing": {
    "enabled": true,
    "strategies": {
      "android": ["text", "resource_id", "content_desc", "xpath", "bounds"],
      "web": ["text", "css", "xpath", "role", "class"]
    },
    "globalTolerance": 0.95
  }
}
```

Urutan array menentukan prioritas. Hapus strategi yang tidak ingin digunakan.

---

## Self-Healing Best Practice

Self-healing membantu test tetap berjalan saat selector berubah, tetapi tidak menggantikan praktik selector yang baik.

### Kapan Self-Healing Aktif

- Perubahan UI minor (teks berubah sedikit, class berubah)
- Perubahan device/resolusi (bounds berubah)
- Perubahan versi aplikasi (resource-id tetap sama)

### Kapan Tidak Percaya Self-Healing

- Perubahan besar pada UI (tombol dihapus, layout berubah total)
- Elemen berganti nama sepenuhnya
- Healing terjadi terlalu sering (>20% dari total aksi)

### Monitoring Healing Event

Setiap healing tercatat di database. Pantau healing log untuk mendeteksi masalah:

| Field | Deskripsi |
|-------|-----------|
| `originalSelector` | Selector yang gagal |
| `strategy` | Strategi healing yang berhasil |
| `attemptNumber` | Percobaan ke-berapa yang berhasil |
| `context` | Test case, device, step |

### Best Practice

1. **Jangan terlalu bergantung pada healing** - Perbaiki selector jika healing terjadi lebih dari 10% dari total aksi.
2. **Review healing log secara berkala** - Cari pola: apakah healing terjadi di halaman yang sama?
3. **Gunakan healing sebagai safety net, bukan primary strategy** - Pilih selector yang baik sejak awal.

---

## Kinerja Selector

### Dampak Kinerja

Strategi selector yang berbeda memiliki performa yang berbeda:

| Strategi | Kecepatan | Stabilitas |
|----------|-----------|------------|
| `text` | Cepat | Tinggi |
| `resource-id` / `css selector` | Sangat cepat | Tinggi |
| `xpath` | Lambat | Rendah |
| `class` + `bounds` | Sedang | Sedang |

### Optimasi

- **Gunakan text atau id sebagai primary** - Jangan langsung ke xpath.
- **Batasi panjang fallback chain** - Maksimal 3-5 strategi. Semakin panjang, semakin lama test berjalan.
- **Gunakan caching selector** - Jika halaman diakses berulang kali, simpan selector yang sudah ditemukan.

### Contoh Caching

```python
# Cache selector yang sudah ditemukan
selector_cache = {}

def find_element_with_cache(driver, locator):
    key = f"{driver.serial}:{locator}"
    if key in selector_cache:
        return selector_cache[key]
    element = driver(**locator)
    selector_cache[key] = element
    return element
```

---

## Reuse Selector

### Page Object Pattern

Kelompokkan selector berdasarkan halaman agar mudah dipelihara:

```python
# pages/login_page.py
class LoginPage:
    # Selector untuk halaman login
    EMAIL_FIELD = {"text": "Email"}
    PASSWORD_FIELD = {"text": "Password"}
    LOGIN_BUTTON = {"text": "Masuk"}
    ERROR_MESSAGE = {"resource-id": "com.example:id/error"}

# Test menggunakan Page Object
def test_login_success(driver):
    page = LoginPage()
    driver(**page.EMAIL_FIELD).set_text("user@test.com")
    driver(**page.PASSWORD_FIELD).set_text("pass123")
    driver(**page.LOGIN_BUTTON).click()
```

### Keuntungan Page Object

- **Satu tempat untuk semua selector** - Ganti selector sekali di Page Object, berlaku untuk semua test.
- **Mengurangi duplikasi** - Tidak menulis selector yang sama berulang kali.
- **Mudah dibaca** - Test script fokus pada alur, bukan detail selector.

### Tips

- Jangan expose selector secara langsung jika bisa. Gunakan method seperti `login(email, password)`.
- Bagi halaman besar menjadi komponen (component-based) agar selector tetap manageable.
- Dokumentasikan selector yang tidak jelas - tambahkan komentar tentang elemen apa yang dipilih.

---

## Checklist Manajemen Selector

- [ ] Selector menggunakan teks yang terlihat atau resource-id sebagai prioritas utama
- [ ] Tidak ada xpath sebagai selector utama kecuali diperlukan
- [ ] Tidak ada index hardcoded sebagai selector utama
- [ ] Fallback chain dibatasi maksimal 3-5 strategi
- [ ] Healing log direview secara berkala
- [ ] Selector dikelompokkan menggunakan Page Object atau pattern sejenis
- [ ] Tidak ada duplikasi selector antar test
- [ ] Test tetap stabil setelah perubahan UI minor tanpa perlu update selector

---

## Referensi

- [Self-Healing Selector Engine](/features/advanced-features/self-healing) - Dokumentasi fitur Auto-Healing
- [Debugging Tips](./debugging-tips.md) - Cara menganalisis selector yang gagal
- [Testing Strategies](./testing-strategies.md) - Menulis test yang stabil dan mudah dipelihara
