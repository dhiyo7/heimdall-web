# Integrasi Pytest

Heimdall mendukung integrasi dengan **pytest** sebagai framework test runner alternatif. Dokumen ini menjelaskan setup, cara menjalankan Heimdall dari Pytest melalui subprocess, parsing report, combining UI + API tests, fixtures, serta troubleshooting.

---

## Mengapa Menggunakan Pytest?

| Keuntungan | Deskripsi |
|------------|-----------|
| 🔧 **Fixture Management** | Manajemen state test yang lebih baik dengan fixtures |
| 📊 **Rich Reporting** | Integrasi dengan Allure, HTML, dan JUnit XML |
| 🔄 **Parallel Execution** | Dukungan paralel test dengan `pytest-xdist` |
| 🧪 **Parameterization** | Test case parameterization built-in |
| 🔗 **Plugin Ecosystem** | Banyak plugin untuk coverage, profiling, mocking |

---

## Setup Awal

### 1. Instalasi Dependensi

```bash
pip install pytest pytest-xdist pytest-cov allure-pytest
pip install heimdall
```

### 2. Struktur Project

```
my-project/
├── tests/
│   ├── conftest.py          # Fixtures Pytest
│   ├── test_android/
│   │   ├── test_login.py
│   │   └── test_dashboard.py
│   └── test_api/
│       └── test_api_endpoints.py
├── requirements.txt
└── pytest.ini
```

### 3. Konfigurasi Pytest (`pytest.ini`)

```ini
[pytest]
addopts = 
    --strict-markers
    --strict-config
    --cov=heimdall
    --cov-report=html
    --cov-report=term-missing
    --allure-dir=./allure-results
    --junit-xml=./reports/junit-report.xml
    --log-cli-level=INFO
    --log-file=./reports/pytest.log

testpaths = tests/

markers =
    android: mark test as Android test
    web: mark test as Web test
    api: mark test as API test
    slow: mark test as slow test
    integration: mark test as integration test
```

---

## Menjalankan Heimdall dari Pytest

### Cara Dasar

```python
# test_android/test_login.py
import pytest
import subprocess
import json
import os
from pathlib import Path

def run_heimdall(test_file: str, output_dir: str = "./reports") -> dict:
    """Jalankan heimdall test dan return JSON report."""
    os.makedirs(output_dir, exist_ok=True)
    
    # Command untuk menjalankan heimdall
    cmd = [
        "heimdall", "run", test_file,
        "--report", "json",
        "--output", output_dir
    ]
    
    # Jalankan subprocess
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        check=True
    )
    
    # Baca JSON report
    report_path = Path(output_dir) / "report.json"
    with open(report_path) as f:
        return json.load(f)

def test_login_success():
    """Test login berhasil menggunakan Heimdall CLI."""
    report = run_heimdall("./tests/login_test.heim")
    
    assert report["summary"]["passed"] == 3
    assert report["summary"]["failed"] == 0
    assert "Login sukses" in [r["case"] for r in report["results"]]

def test_login_failure():
    """Test login gagal menggunakan Heimdall CLI."""
    report = run_heimdall("./tests/login_failure_test.heim")
    
    assert report["summary"]["passed"] == 0
    assert report["summary"]["failed"] == 1
```

### Parameterized Tests

```python
import pytest
import subprocess
import json

@pytest.mark.parametrize("test_file,expected_passed,expected_failed", [
    ("./tests/login_test.heim", 3, 0),
    ("./tests/dashboard_test.heim", 5, 0),
    ("./tests/payment_test.heim", 4, 1),
])
def test_multiple_scenarios(test_file, expected_passed, expected_failed):
    """Jalankan berbagai skenario test dengan parameterization."""
    cmd = [
        "heimdall", "run", test_file,
        "--report", "json",
        "--output", "./reports"
    ]
    
    subprocess.run(cmd, check=True)
    
    with open("./reports/report.json") as f:
        report = json.load(f)
    
    assert report["summary"]["passed"] == expected_passed
    assert report["summary"]["failed"] == expected_failed
```

---

## Fixtures Pytest untuk Heimdall

### Fixture untuk Session Android

```python
# conftest.py
import pytest
import subprocess
import json
import time
from pathlib import Path

@pytest.fixture(scope="session")
def heimdall_android_session():
    """Setup session Android untuk seluruh test session."""
    # Inisialisasi device
    subprocess.run(["heimdall", "devices"], check=True)
    
    # Health check
    subprocess.run(["heimdall", "health", "--check", "adb", "--check", "drivers"], check=True)
    
    yield "android_session"
    
    # Cleanup
    subprocess.run(["heimdall", "devices", "--cleanup"], check=True)

@pytest.fixture(scope="function")
def run_heimdall_test(heimdall_android_session, request):
    """Fixture untuk menjalankan test Heimdall individual."""
    test_file = request.param
    output_dir = f"./reports/{request.node.name}"
    os.makedirs(output_dir, exist_ok=True)
    
    def _run(test_file=test_file, output_dir=output_dir):
        cmd = [
            "heimdall", "run", test_file,
            "--report", "json",
            "--output", output_dir
        ]
        
        subprocess.run(cmd, check=True)
        
        report_path = Path(output_dir) / "report.json"
        with open(report_path) as f:
            return json.load(f)
    
    return _run

# Contoh penggunaan
@pytest.mark.android
@pytest.mark.parametrize("run_heimdall_test", ["./tests/login_test.heim"], indirect=True)
def test_login_with_fixture(run_heimdall_test):
    report = run_heimdall_test()
    assert report["summary"]["passed"] == 3
```

### Fixture untuk Web Tests

```python
@pytest.fixture(scope="session")
def heimdall_web_session():
    """Setup session Web untuk seluruh test session."""
    # Install browser dependencies
    subprocess.run(["heimdall", "playwright", "install", "chromium"], check=True)
    subprocess.run(["heimdall", "playwright", "install-deps", "chromium"], check=True)
    
    yield "web_session"
    
    # Cleanup
    subprocess.run(["heimdall", "playwright", "cleanup"], check=True)

@pytest.fixture(scope="function")
def run_heimdall_web_test(heimdall_web_session, request):
    """Fixture untuk menjalankan test Heimdall Web."""
    test_file = request.param
    output_dir = f"./reports/{request.node.name}"
    os.makedirs(output_dir, exist_ok=True)
    
    def _run(test_file=test_file, output_dir=output_dir, browser="chromium"):
        cmd = [
            "heimdall", "run", test_file,
            "--browser", browser,
            "--report", "json",
            "--output", output_dir
        ]
        
        subprocess.run(cmd, check=True)
        
        report_path = Path(output_dir) / "report.json"
        with open(report_path) as f:
            return json.load(f)
    
    return _run

# Contoh penggunaan
@pytest.mark.web
@pytest.mark.parametrize("run_heimdall_web_test", ["./tests/web/dashboard_test.heim"], indirect=True)
def test_web_dashboard(run_heimdall_web_test):
    report = run_heimdall_web_test(browser="chromium")
    assert report["summary"]["passed"] == 5
```

---

## Combining UI + API Tests

### Test Case yang Menggabungkan UI dan API

```python
import pytest
import subprocess
import json
import requests

@pytest.mark.integration
def test_full_login_flow():
    """Test alur login lengkap: UI + API."""
    
    # 1. Jalankan UI test untuk login
    ui_report = run_heimdall_test("./tests/login_test.heim")
    assert ui_report["summary"]["passed"] == 3
    
    # 2. Ambil token dari API (jika tersedia di report)
    token = None
    for result in ui_report["results"]:
        if "Login sukses" in result["case"]:
            # Asumsikan token disimpan di environment atau file
            token = get_token_from_ui_result(result)
            break
    
    # 3. Jalankan API test dengan token
    if token:
        api_report = run_heimdall_api_test("./tests/api/verify_token.json", token)
        assert api_report["summary"]["passed"] == 1

def run_heimdall_api_test(test_file: str, token: str) -> dict:
    """Jalankan API test dengan token autentikasi."""
    cmd = [
        "heimdall", "api-test", test_file,
        "--token", token,
        "--report", "json",
        "--output", "./reports"
    ]
    
    subprocess.run(cmd, check=True)
    
    with open("./reports/report.json") as f:
        return json.load(f)

def get_token_from_ui_result(ui_result: dict) -> str:
    """Ekstrak token dari hasil UI test (contoh)."""
    # Implementasi spesifik untuk aplikasi Anda
    return "your-auth-token-here"
```

### Test Case Parameterized dengan Data Dari API

```python
@pytest.mark.api
@pytest.mark.parametrize("user_data", get_users_from_api())
def test_user_profile(user_data):
    """Test profil user dengan data dari API."""
    test_file = f"./tests/web/user_profile_{user_data['id']}.heim"
    report = run_heimdall_web_test(test_file, browser="chromium")
    assert report["summary"]["passed"] > 0

def get_users_from_api() -> list:
    """Ambil data user dari API untuk parameterization."""
    response = requests.get("https://api.example.com/users")
    return response.json()
```

---

## Running Tests

### Command Dasar

```bash
# Jalankan semua test
pytest

# Jalankan test dengan mark tertentu
pytest -m android
pytest -m web
pytest -m api

# Jalankan test paralel
pytest -n auto  # otomatis gunakan semua core
pytest -n 4     # gunakan 4 proses

# Jalankan dengan coverage
pytest --cov=heimdall

# Jalankan dengan Allure
pytest --allure-dir=./allure-results
```

### Workflow CI/CD dengan Pytest

```yaml
# .github/workflows/pytest-ci.yml
name: Pytest CI

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Install dependencies
        run: |
          pip install pytest pytest-xdist pytest-cov allure-pytest heimdall
          pip install -r requirements.txt
      
      - name: Run Pytest
        run: |
          pytest --cov=heimdall --cov-report=html --allure-dir=./allure-results
      
      - name: Upload Coverage Report
        uses: codecov/codecov-action@v3
      
      - name: Publish Allure Report
        uses: actions/upload-artifact@v4
        with:
          name: allure-report
          path: ./allure-results
```

---

## Parsing Report Heimdall

### Mengonversi JSON Report ke Format Pytest

```python
import json
import pytest

def pytest_collect_file(parent, path):
    """Kolektor custom untuk file .heim."""
    if path.endswith(".heim"):
        return HeimdallFile(path, parent)

class HeimdallFile(pytest.File):
    def collect(self):
        with open(self.fspath, "r") as f:
            content = f.read()
        
        # Parse .heim file dan buat test items
        yield HeimdallItem("test_case_1", self, content)
        yield HeimdallItem("test_case_2", self, content)

class HeimdallItem(pytest.Item):
    def __init__(self, name, parent, content):
        super().__init__(name, parent)
        self.content = content
    
    def runtest(self):
        # Jalankan heimdall test dan verifikasi hasil
        result = subprocess.run(
            ["heimdall", "run", self.fspath, "--report", "json"],
            capture_output=True,
            text=True,
            check=True
        )
        
        report = json.loads(result.stdout)
        if report["summary"]["failed"] > 0:
            raise pytest.fail(f"Test failed: {report['summary']['failed']} failures")
    
    def repr_failure(self, excinfo):
        return f"Heimdall test failed: {excinfo.value}"
```

### Custom Plugin untuk Heimdall

```python
# conftest.py atau plugin kustom
def pytest_configure(config):
    config.pluginmanager.register(HeimdallPlugin(), "heimdall")

class HeimdallPlugin:
    def pytest_addoption(self, parser):
        parser.addoption("--heimdall-output", action="store", default="./reports")
    
    def pytest_sessionstart(self, session):
        self.output_dir = session.config.getoption("--heimdall-output")
        os.makedirs(self.output_dir, exist_ok=True)
    
    def pytest_runtest_logreport(self, report):
        if report.when == "call":
            # Simpan hasil test ke JSON
            test_name = report.nodeid
            result = {
                "test_name": test_name,
                "outcome": "passed" if report.passed else "failed",
                "duration": report.duration
            }
            
            with open(f"{self.output_dir}/{test_name}.json", "w") as f:
                json.dump(result, f)
```

---

## Troubleshooting

### 1. Error: `heimdall command not found`

**Penyebab:** Heimdall tidak terinstall atau tidak ada di PATH.

**Solusi:**
```bash
# Install heimdall
pip install heimdall

# Atau gunakan path lengkap
python -m heimdall run test.heim

# Tambahkan ke PATH
export PATH="$PATH:$(python -m site --user-base)/bin"
```

### 2. Error: `Device not found` saat menjalankan test Android

**Penyebab:** Device tidak terhubung atau ADB tidak berjalan.

**Solusi:**
```python
@pytest.fixture(scope="session", autouse=True)
def ensure_android_device():
    """Pastikan device Android tersedia sebelum test."""
    import subprocess
    result = subprocess.run(["heimdall", "devices"], capture_output=True, text=True)
    if "device" not in result.stdout:
        pytest.skip("No Android device available")
```

### 3. Error: `Browser not installed` saat Web test

**Penyebab:** Browser (Playwright) belum terinstall.

**Solusi:**
```python
@pytest.fixture(scope="session", autouse=True)
def install_playwright_browsers():
    """Install browser sebelum test session."""
    subprocess.run(["heimdall", "playwright", "install", "chromium"], check=True)
    subprocess.run(["heimdall", "playwright", "install-deps", "chromium"], check=True)
```

### 4. Error: `JSON report not found`

**Penyebab:** Command `heimdall run` gagal atau output tidak sesuai.

**Solusi:**
```python
def run_heimdall_safely(test_file: str) -> dict:
    """Jalankan heimdall dengan error handling."""
    try:
        result = subprocess.run(
            ["heimdall", "run", test_file, "--report", "json"],
            capture_output=True,
            text=True,
            check=True
        )
        
        report_path = "./reports/report.json"
        with open(report_path) as f:
            return json.load(f)
            
    except subprocess.CalledProcessError as e:
        print(f"Error running heimdall: {e.stderr}")
        raise
    except FileNotFoundError:
        print("Report file not found")
        raise
```

### 5. Error: `Parallel execution flaky`

**Penyebab:** Race condition saat menjalankan test paralel.

**Solusi:**
- Gunakan `pytest-xdist` dengan batasan:
  ```bash
  pytest -n 4 --dist=loadscope
  ```
- Tambahkan `time.sleep()` di fixture untuk memastikan state stabil
- Gunakan `pytest-randomly` untuk menjalankan test dalam urutan acak

### 6. Error: `Allure report generation failed`

**Penyebab:** Allure tidak terinstall atau hasil test tidak lengkap.

**Solusi:**
```bash
# Install Allure
pip install allure-pytest

# Generate report
pytest --allure-dir=./allure-results
allure generate ./allure-results -o ./allure-report
allure open ./allure-report
```

---

## Best Practices

### 1. Organisasi Test

| Jenis Test | Folder | Contoh |
|------------|--------|--------|
| Android UI | `tests/android/` | `test_login.py`, `test_dashboard.py` |
| Web UI | `tests/web/` | `test_homepage.py`, `test_forms.py` |
| API | `tests/api/` | `test_endpoints.py`, `test_authentication.py` |
| Integration | `tests/integration/` | `test_full_flow.py` |
| Fixtures | `tests/conftest.py` | Session fixtures |

### 2. Naming Convention

- Gunakan `test_` prefix untuk test functions
- Gunakan `Test` prefix untuk test classes
- Gunakan `pytest.mark` untuk categorization
- Gunakan descriptive names: `test_login_with_valid_credentials`

### 3. Fixtures

- Gunakan scope yang tepat: `session`, `module`, `class`, `function`
- Isolate test dengan cleanup yang baik
- Share state melalui fixtures bukan global variables

### 4. Reporting

- Selalu gunakan `--junit-xml` untuk CI/CD
- Gunakan `--cov` untuk coverage reporting
- Integrasikan dengan Allure untuk report visual
- Simpan log dan artefak test

---

## Checklist Integrasi Pytest

- [ ] `pytest` dan `pytest-xdist` terinstall
- [ ] `conftest.py` dengan fixtures yang tepat
- [ ] `pytest.ini` dengan konfigurasi yang benar
- [ ] Test functions menggunakan `pytest.mark` untuk categorization
- [ ] Fixtures untuk setup/teardown session dan test function
- [ ] Error handling untuk `heimdall run` command
- [ ] Reporting setup (Allure, JUnit XML, coverage)
- [ ] Parallel execution diaktifkan dengan `pytest-xdist`
- [ ] Cleanup yang tepat setelah setiap test

---

## Referensi Terkait

- [Headless CLI](../features/basic-features/headsless-cli.md) — Perintah CLI Heimdall
- [Menjalankan Test](../../tutorials/getting-started/running-tests.md) — Panduan dasar
- [CI/CD Integration](./ci-cd.md) — Integrasi dengan pipeline CI/CD
- [TMS Integration](./tms.md) — Sinkronisasi hasil ke sistem manajemen test
- [API Testing](../../features/advanced-features/api-testing.md) — Panduan API testing