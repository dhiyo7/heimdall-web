# Performance Optimization

Panduan untuk mempercepat eksekusi test, mengelola resource, dan mengoptimalkan pipeline CI/CD.

---

## Parallel Execution

### Konsep

Eksekusi paralel memungkinkan beberapa test berjalan bersamaan pada device berbeda, mengurangi waktu eksekusi secara signifikan.

### Konfigurasi

```bash
# Jalankan test dengan 5 proses paralel
heimdall run ./tests/ --parallel 5

# Batasi device tertentu
heimdall run ./tests/ --parallel 3 --device "emulator-5554, emulator-5556, emulator-5558"
```

### Konfigurasi di File

```json
{
  "parallel": {
    "maxProcesses": 10,
    "throttle": 1000,
    "deviceManager": {
      "maxDevicesPerProcess": 2
    }
  }
}
```

### Tips

- **Jangan melebihi jumlah device** - Jika punya 3 device, jangan set `--parallel 10`.
- **Gunakan throttle** - Jangan overcrowd device. Tambah jeda antar request jika device lemot.
- **Kelompokkan test berdasar device** - Test yang membutuhkan device spesifik harus dijalankan pada device tersebut.

---

## Caching

### Apa yang Bisa Di-Cache

| Item | Kegunaan Cache | Strategi |
|------|----------------|----------|
| Selector | Menghindari pencarian ulang elemen | Cache per halaman dengan TTL |
| Dataset DDT | Membaca file berulang kali | Cache di memory |
| Baseline visual | Membandingkan screenshot | Simpan di filesystem |
| Token API | Menghindari login berulang | Cache di memory/redis |

### Contoh Caching Dataset

```python
from functools import lru_cache

@lru_cache(maxsize=10)
def load_dataset(dataset_id: str) -> List[dict]:
    """Cache dataset di memory. Hanya baca file sekali."""
    return parse_csv(f"./data/{dataset_id}.csv")
```

### Contoh Caching Selector

```python
class SelectorCache:
    def __init__(self, ttl: int = 300):
        self.cache = {}
        self.ttl = ttl

    def get(self, key: str):
        if key in self.cache:
            value, timestamp = self.cache[key]
            if time.time() - timestamp < self.ttl:
                return value
            del self.cache[key]
        return None

    def set(self, key: str, value):
        self.cache[key] = (value, time.time())

# Penggunaan
cache = SelectorCache(ttl=300)
selector = cache.get("login_page:email_field")
if not selector:
    selector = inspect_and_find("Email")
    cache.set("login_page:email_field", selector)
```

### Best Practice

- **Jangan cache data yang sering berubah** - Data dinamis seperti timestamp atau random value.
- **Bersihkan cache secara periodik** - Cache yang terlalu tua bisa menolak selector yang sudah berubah.
- **Gunakan TTL yang sesuai** - 5-10 menit untuk selector, 1-24 jam untuk dataset statis.

---

## Manajemen Resource

### Device Management

- **Jangan ganggu device yang sedang dipakai** - Alokasikan device khusus untuk automated test.
- **Matikan aplikasi setelah test** - Bersihkan state dengan `driver.app_stop()` atau `driver.app_clear()`.
- **Restart device jika crash** - Device yang sering crash akan memperlambat seluruh pipeline.

### Memory Management

- **Bersihkan screenshot setelah dianalisis** - Jangan simpan screenshot selamanya di disk.
- **Batasi ukuran log** - Rotate log file agar tidak memenuhi disk.
- **Gunakan streaming untuk dataset besar** - Jangan muat seluruh file CSV 100.000 baris ke memory sekaligus.

### Connection Management

```python
# Tutup koneksi setelah selesai
def teardown_module(module):
    for device in connected_devices:
        device.disconnect()
```

---

## Device Throttling

### Konsep

Device throttling memperlambat atau membatasi resource device untuk mensimulasikan kondisi real-world.

### Mengapa Perlu

- Mengungkap bug yang hanya muncul pada device dengan spesifikasi rendah.
- Memastikan aplikasi tetap responsif pada device lambat.
- Menghindari false positive pada test yang terlalu cepat.

### Konfigurasi

```json
{
  "device": {
    "throttle": {
      "enabled": true,
      "cpu": 50,
      "network": "3g",
      "latency": 400
    }
  }
}
```

### Network Throttling

| Kondisi | Kegunaan |
|---------|----------|
| `3g` | Simulasikan koneksi lambat |
| `offline` | Test offline mode |
| `high latency` | Simulasikan jaringan dengan delay tinggi |

### CPU Throttling

- **50%** - Device menengah
- **25%** - Device low-end
- **10%** - Device sangat lambat (stress test)

### Tips

- **Gunakan throttling pada test kritikal** - Tidak perlu men-throttle semua test.
- **Kombinasikan dengan profiling** - Gunakan `adb shell dumpsys cpuinfo` untuk melihat penggunaan CPU.
- **Jangan throttling pada emulator lambat** - Emulator sudah cukup lambat tanpa throttling tambahan.

---

## Optimasi CI/CD

### Prinsip

1. **Jalankan test yang cepat terlebih dahulu** - Unit test dahulu, baru E2E.
2. **Gunakan caching di CI/CD** - Cache dependencies dan dataset.
3. **Batasi paralelisme sesuai resource** - Jangan overload runner CI/CD.

### Contoh GitHub Actions

```yaml
name: Test
on: [push, pull_request]

jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.10'
      - uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
      - run: pip install -r requirements.txt
      - run: pytest tests/unit/ -v

  e2e-test:
    needs: unit-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.10'
      - run: pip install -r requirements.txt
      - run: heimdall run tests/e2e/ --parallel 3 --report junit-xml --output ./reports/
      - uses: actions/upload-artifact@v4
        with:
          name: test-report
          path: ./reports/
```

### Tips CI/CD

- **Gunakan matrix strategy** - Jalankan test di beberapa versi aplikasi atau device.
- **Fail fast** - Hentikan pipeline jika test kritikal gagal.
- **Batasi artifact size** - Hanya simpan screenshot dan report yang relevan.
- **Gunakan self-hosted runner jika perlu** - Runner cloud biasanya tidak punya device fisik.

### Matrix Strategy

```yaml
strategy:
  matrix:
    device: [emulator-5554, emulator-5556]
    app-version: [v1.0.0, v1.1.0]
steps:
  - run: heimdall run tests/e2e/ --device ${{ matrix.device }} --app-version ${{ matrix.app-version }}
```

---

## Metrics

### Metrik yang Perlu Diukur

| Metric | Target | Kegunaan |
|--------|--------|----------|
| Execution time | < 5 menit per test case | Kecepatan feedback |
| Flaky rate | < 5% | Stabilitas test |
| Parallel efficiency | > 80% utilization device | Efisiensi resource |
| Healing rate | < 10% dari total aksi | Kualitas selector |
| Failure rate | < 10% dari total test | Kualitas aplikasi/test |

### Monitoring

- **Track execution time per test** - Identifikasi test yang lambat.
- **Track flaky test** - Test yang gagal secara acak perlu diperbaiki.
- **Track healing rate** - Healing yang terlalu banyak menandakan selector yang buruk.

---

## Checklist Optimasi

- [ ] Eksekusi paralel dikonfigurasi sesuai jumlah device yang tersedia
- [ ] Throttle diaktifkan untuk mencegah overload device
- [ ] Dataset yang sering diakses di-cache
- [ ] Selector di-cache dengan TTL yang sesuai
- [ ] Screenshot dan log dibersihkan secara periodik
- [ ] Aplikasi dimatikan setelah setiap test
- [ ] Device di-restart jika crash atau dalam kondisi tidak stabil
- [ ] CI/CD pipeline menggunakan caching untuk dependencies
- [ ] Test cepat dijalankan sebelum test lambat di CI/CD
- [ ] Metrics dieksekusi dan dimonitor secara berkala

---

## Referensi

- [Testing Strategies](./testing-strategies.md) - Menulis test yang efisien
- [Debugging Tips](./debugging-tips.md) - Mengidentifikasi bottleneck
- [Headless CLI & CI/CD](/features/basic-features/headsless-cli) - Dokumentasi eksekusi CLI
