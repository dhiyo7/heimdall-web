# Troubleshooting Web

Panduan pemecahan masalah spesifik untuk otomatisasi Web menggunakan Heimdall dengan Playwright.

---

## Playwright Issues

### Problem: `playwright install` gagal atau lambat

**Penyebab:** Browser Chromium/Firefox/WebKit belum terdownload atau network lambat.

**Solusi:**
```bash
# Install browser secara manual
playwright install chromium

# Install dengan mirror (jika network lambat)
playwright install --with-deps chromium

# Verifikasi instalasi
playwright --version
npx playwright install --help
```

---

### Problem: Browser tidak bisa dijalankan (`Executable doesn't exist`)

**Penyebab:** Browser belum di-install atau path tidak terdeteksi.

**Solusi:**
```bash
# Cek browser yang terinstall
playwright install --help

# Install ulang
playwright install chromium firefox webkit

# Verifikasi
npx playwright install --dry-run
```

---

### Problem: `BrowserContext` error: `Context has been closed`

**Penyebab:** Context browser ditutup secara prematur atau test mengakses context setelah selesai.

**Solusi:**
1. Pastikan context tidak ditutup sebelum test selesai
2. Gunakan `async with` atau try-finally untuk memastikan cleanup:

```python
async with browser.new_context() as context:
    page = await context.new_page()
    # test code
# context otomatis ditutup di sini
```

3. Jangan akses `context` atau `page` setelah `context.close()`

---

### Problem: Test gagal dengan `TimeoutError`

**Penyebab:** Elemen tidak muncul dalam batas waktu default (30 detik).

**Solusi:**
1. Tingkatkan timeout untuk elemen tertentu:

```python
page.wait_for_selector("#login-button", timeout=60000)
```

2. Atau ubah default timeout:

```python
page.set_default_timeout(60000)
```

3. Periksa apakah aplikasi memuat data dari network (gunakan `page.wait_for_load_state()`)

---

### Problem: `Target closed` error

**Penyebab:** Page atau browser ditutup secara tidak sengaja.

**Solusi:**
1. Pastikan tidak ada `page.close()` atau `browser.close()` yang dipanggil terlalu dini
2. Tambahkan logging untuk melacak kapan page ditutup:

```python
page.on("close", lambda: print("Page closed unexpectedly"))
```

---

## Browser Compatibility

### Problem: Test berhasil di Chromium tapi gagal di Firefox

**Penyebab:** Perbedaan implementasi selector atau behavior antar browser.

**Solusi:**
1. Gunakan selector yang cross-browser (hindari CSS selector khusus browser)
2. Gunakan `page.locator()` daripada `page.$()` untuk stabilisasi:

```python
# Lebih stabil antar browser
page.locator("#submit-btn").click()

# Kurang stabil
page.$("#submit-btn").click()
```

3. Jalankan test di semua browser yang didukung:

```bash
npx playwright test --project=chromium --project=firefox --project=webkit
```

---

### Problem: Selector bekerja di lokal tapi gagal di CI/CD

**Penyebab:** Perbedaan resolusi, viewport, atau OS.

**Solusi:**
1. Set viewport yang konsisten:

```python
page.set_viewport_size({"width": 1280, "height": 720})
```

2. Gunakan headless mode yang konsisten:

```bash
npx playwright test --headed  # Untuk debug lokal
npx playwright test            # Headless untuk CI/CD
```

3. Verifikasi environment di CI/CD:

```bash
npx playwright install --with-deps chromium
```

---

### Problem: File upload/download tidak bekerja

**Penyebab:** Path file salah atau permission tidak ada.

**Solusi:**
```python
# Upload file
page.set_input_files('input[type="file"]', '/path/to/file.pdf')

# Download file
async with page.expect_download() as download_info:
    page.click('a#download-link')
download = await download_info.value
await download.save_as('/path/to/save/file.pdf')
```

---

## Selector Issues

### Problem: `Locator.click: Error: Element is not visible`

**Penyebab:** Elemen ada di DOM tapi tidak terlihat (di-hidden, di luar viewport, atau tertutup overlay).

**Solusi:**
1. Scroll ke elemen terlebih dahulu:

```python
page.locator("#submit-btn").scroll_into_view_if_needed()
```

2. Tunggu elemen terlihat:

```python
page.locator("#submit-btn").wait_for(state="visible")
```

3. Cek apakah ada overlay yang menutupi:

```python
# Tutup overlay jika ada
if page.locator(".modal-overlay").is_visible():
    page.locator(".modal-close").click()
```

---

### Problem: Selector mengembalikan elemen yang salah

**Penyebab:** Selector terlalu umum atau ada elemen duplikat.

**Solusi:**
1. Gunakan selector yang lebih spesifik:

```python
# Lebih baik
page.locator("button:has-text('Submit')")

# Daripada
page.locator("button")
```

2. Gunakan `first()`, `last()`, atau `nth()` jika perlu:

```python
page.locator(".item").nth(2).click()
```

3. Verifikasi dengan `page.locator().count()`:

```python
assert page.locator(".item").count() == 3
```

---

### Problem: Selector berubah setiap kali aplikasi di-build

**Penyebab:** Menggunakan selector yang bergantung pada class atau struktur DOM yang berubah.

**Solusi:**
1. Gunakan selector berbasis teks atau role:

```python
page.get_by_role("button", name="Submit").click()
page.get_by_text("Welcome").is_visible()
```

2. Gunakan `data-testid` attribute:

```html
<button data-testid="submit-btn">Submit</button>
```

```python
page.get_by_test_id("submit-btn").click()
```

3. Dokumentasikan selector yang tidak jelas dan gunakan Page Object

---

### Problem: `StaleElementReferenceException` atau `ElementHandle` expired

**Penyebab:** Elemen di-reload atau DOM berubah setelah elemen diambil.

**Solusi:**
1. Jangan simpan `ElementHandle` untuk digunakan nanti. Ambil ulang setiap saat:

```python
# Buruk
button = page.locator("#btn")
# ... beberapa operasi lain ...
button.click()  # Mungkin stale

# Baik
page.locator("#btn").click()
```

2. Gunakan `page.locator()` yang otomatis re-query:

```python
locator = page.locator("#btn")
# Setiap aksi pada locator akan re-query elemen
locator.click()
```

---

## Network / Timeout

### Problem: `Navigation timeout exceeded`

**Penyebab:** Halaman memuat terlalu lama atau network lambat.

**Solusi:**
1. Tingkatkan timeout:

```python
page.goto("https://example.com", timeout=60000)
```

2. Tunggu network idle:

```python
page.goto("https://example.com", wait_until="networkidle")
```

3. Atau gunakan `domcontentloaded` jika network idle terlalu lama:

```python
page.goto("https://example.com", wait_until="domcontentloaded")
```

---

### Problem: API request gagal dengan CORS error

**Penyebab:** Origin yang digunakan oleh Playwright diblokir oleh server.

**Solusi:**
1. Gunakan context dengan origin yang diizinkan:

```python
context = await browser.new_context(
    extra_http_headers={"Origin": "https://allowed-origin.com"}
)
```

2. Atau bypass CORS untuk testing:

```python
context = await browser.new_context(
    ignore_https_errors=True
)
```

---

### Problem: Cookie/session tidak persisten antar test

**Penyebab:** Context browser baru membuat session baru setiap test.

**Solusi:**
1. Simpan dan load auth state:

```python
# Simpan
await context.storage_state(path="auth.json")

# Load di test lain
context = await browser.new_context(storage_state="auth.json")
```

2. Atau reuse context antar test:

```python
# Di fixture conftest.py
@pytest.fixture(scope="session")
async def browser_context():
    context = await browser.new_context()
    yield context
    await context.close()
```

---

## Cookies / Auth State

### Problem: Session expired saat test berjalan

**Penyebab:** Token expired atau cookie dihapus.

**Solusi:**
1. Simpan auth state dan reuse:

```python
# Setup: login sekali, simpan state
await page.goto("/login")
await page.fill("#email", "user@test.com")
await page.fill("#password", "pass123")
await page.click("#login-btn")
await context.storage_state(path="auth.json")
```

2. Di test lain:

```python
context = await browser.new_context(storage_state="auth.json")
page = await context.new_page()
# Sudah login, tidak perlu login ulang
```

---

### Problem: `set-cookie` ditolak oleh browser

**Penyebab:** Domain cookie tidak cocok atau secure flag tidak terpenuhi.

**Solusi:**
1. Pastikan domain dan path cookie sesuai:

```python
await context.add_cookies([
    {
        "name": "session_id",
        "value": "abc123",
        "domain": ".example.com",
        "path": "/",
        "httpOnly": True,
        "secure": True,
        "sameSite": "Lax"
    }
])
```

2. Jika menggunakan HTTP lokal, set `secure: False`

---

### Problem: Lokale/ bahasa browser salah

**Penyebab:** Browser menggunakan bahasa default sistem.

**Solusi:**
```python
context = await browser.new_context(
    locale="id-ID",
    timezone_id="Asia/Jakarta"
)
```

---

## Checklist Web

Gunakan checklist ini saat mengatasi masalah Web:

- [ ] Playwright terinstall dengan browser yang dibutuhkan
- [ ] Browser dalam mode yang benar (headless/headed)
- [ ] Viewport size konsisten antar test
- [ ] Selector menggunakan `get_by_role`, `get_by_text`, atau `get_by_test_id`
- [ ] Timeout di-set sesuai kebutuhan (default 30 detik)
- [ ] Auth state disimpan dan di-reuse jika perlu
- [ ] Network idle di-handle dengan benar
- [ ] File upload/download di-test dengan path yang benar
- [ ] Test berhasil dijalankan di semua browser yang didukung
- [ ] Error handling untuk popup, alert, dan dialog

---

## Referensi

- [Common Issues](../troubleshooting/common-issues.md) - Masalah umum di semua platform
- [Android Specific Troubleshooting](../troubleshooting/android-specific.md) - Masalah spesifik Android
- [Debugging Tips](../best-practices/debugging-tips.md) - Workflow debugging
