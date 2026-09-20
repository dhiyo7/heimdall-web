# Menjalankan Test: Run Single/Suite, Parallel, Report Export, CI/CD Dasar

Tutorial ini memandu Anda menjalankan test case Heimdall dengan berbagai cara: single execution, suite, parallel execution, export laporan, dan integrasi CI/CD dasar.

---

## Prasyarat

Sebelum memulai, pastikan:

- [ ] Setup Android selesai ([Setup Android](../tutorials/getting-started/setup-android.md)) **ATAU** Setup Web selesai ([Setup Web](../tutorials/getting-started/setup-web.md))
- [ ] Minimal satu file test `.heim` sudah ada
- [ ] Device/Emulator terhubung (Android) **ATAU** browser terinstall (Web)

---

## Langkah 1: Run Single Test Case

Menjalankan satu file test secara langsung.

### 1.1 Perintah Dasar

```bash
# Jalankan satu file test
heimdall run login_test.heim

# Dengan device/browser tertentu
heimdall run login_test.heim --device emulator-5554
heimdall run login_test.heim --browser chromium
```

### 1.2 Options Penting

| Option | Format | Fungsi |
|--------|--------|--------|
| `--device` | `<serial>` | Target device tertentu (Android) |
| `--browser` | `chromium/firefox/webkit/all` | Target browser tertentu (Web) |
| `--headed` | flag | Jalankan browser tidak headless (lihat UI) |
| `--log-level` | `debug/info/warn/error` | Level logging |
| `--no-retry` | flag | Nonaktifkan retry otomatis |

### 1.3 Contoh Penggunaan

```bash
# Jalankan dengan log debug
heimdall run login_test.heim --log-level debug

# Jalankan dengan browser headed untuk debugging
heimdall run login_test.heim --browser chromium --headed

# Jalankan tanpa retry otomatis
heimdall run login_test.heim --no-retry
```

---

## Langkah 2: Running Test Suite (Folder/Batch)

Menjalankan multiple test case sekaligus.

### 2.1 Jalankan Semua File di Folder

```bash
# Jalankan semua .heim di folder tests/
heimdall suite --dir ./tests/

# Atau dengan path spesifik
heimdall suite --dir ./tests/android/
```

### 2.2 Target Spesifik File

```bash
# Jalankan multiple file spesifik
heimdall suite login_test.heim register_test.heim dashboard_test.heim

# Atau dengan wildcard (shell support)
heimdall suite ./tests/*.heim
```

### 2.3 Exclude File Tertentu

```bash
# Jalankan suite kecuali file tertentu
heimdall suite --dir ./tests/ --exclude "*_slow.heim"
```

---

## Langkah 3: Parallel Execution (Eksekusi Paralel)

Menjalankan test secara paralel untuk mengurangi waktu eksekusi.

### 3.1 Konfigurasi Dasar

```bash
# Jalankan dengan 4 proses paralel
heimdall run ./tests/ --parallel 4

# Jalankan suite dengan paralel
heimdall suite --dir ./tests/ --parallel 5
```

### 3.2 Parallel di CI/CD

Di lingkungan CI/CD, gunakan flag `--parallel` bersama dengan konfigurasi yang tepat:

```bash
# Di GitHub Actions
heimdall run ./tests/ --parallel 3 --report junit-xml --output ./reports/
```

### 3.3 Batasan Parallel

| Batasan | Nilai |
|---------|-------|
| Maksimum proses | 10 |
| Maksimum device per proses | 2 |
| Thread manager | Semaphore-based |

### 3.4 Contoh Parallel Multi-Device

```bash
# Jalankan pada multiple device secara paralel
heimdall run ./tests/ --parallel --device "emulator-5554, emulator-5556, emulator-5558"
```

---

## Langkah 4: Report Export (Ekspor Laporan)

Menghasilkan laporan dalam berbagai format untuk analisis dan CI/CD.

### 4.1 Supported Report Formats

| Format | Ekstensi | Digunakan untuk |
|--------|----------|-----------------|
| JSON | `.json` | Analisis manual, integrasi dashboard |
| JUnit XML | `.xml` | CI/CD (GitHub Actions, GitLab CI, Jenkins) |
| Allure | HTML | Reporting visual, timeline, screenshot |

### 4.2 Export JSON Report

```bash
# Generate JSON report
heimdall run login_test.heim --report json --output ./reports/

# Output: ./reports/report.json
```

### 4.3 Export JUnit XML Report

```bash
# Generate JUnit XML report (untuk CI/CD)
heimdall run login_test.heim --report junit-xml --output ./reports/

# Output: ./reports/junit-report.xml
```

### 4.4 Export Allure Report

Allure membutuhkan instalasi terpisah:

```bash
# Install Allure commandline tool (opsional)

# Ubuntu/Debian
sudo apt install allure

# macOS
brew install allure

# Windowsto download dari https://docs.qameta.io/allure/#_installorupdatethetools
```

Generate Allure results:

```bash
# Generate Allure results
heimdall run login_test.heim --report allure --output ./allure-results/

# Generate HTML report
allure generate ./allure-results/ -o ./allure-report/

# Buka di browser
allure open ./allure-report/
```

### 4.5 JSON Report Structure

File `report.json` memiliki struktur:

```json
{
  "summary": {
    "passed": 12,
    "failed": 2,
    "skipped": 1,
    "total": 15,
    "duration": "00:05:23"
  },
  "results": [
    {
      "testCase": "login_test.heim",
      "status": "passed",
      "duration": "12.34s",
      "steps": [
        {"step": "Buka aplikasi", "status": "passed"},
        {"step": "Tunggu sampai muncul teks Sign In", "status": "passed"}
      ],
      "screenshots": {...},
      "logs": {...}
    }
  ],
  "deviceDetails": {
    "model": "emulator-5554",
    "osVersion": "13",
    "appPackage": "com.example.app"
  }
}
```

---

## Langkah 5: Integrasi CI/CD Dasar

Berikut contoh konfigurasi CI/CD untuk Heimdall.

### 5.1 GitHub Actions

Buat file `.github/workflows/heimdall-ci.yml`:

```yaml
name: Heimdall Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-android:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install Dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Setup Android SDK
        uses: android-actions/setup-android@v2

      - name: Start Emulator
        run: |
          echo "avd_hardware_acceleration = true" >> $ANDROID_HOME/avd/avd.ini
          $ANDROID_HOME/emulator/emulator -avd pixel_4_api_33 -no-snapshot -no-window -no-audio -no-boot-anim -accel on &

      - name: Wait for Emulator
        run: adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed 2>/dev/null | tr -d '\r') ]]; do sleep 1; done'

      - name: Initialize uiautomator2
        run: python -m uiautomator2 init

      - name: Run Tests
        run: |
          heimdall run ./tests/ --parallel 2 --report junit-xml --output ./reports/

      - name: Upload Test Report
        uses: actions/upload-artifact@v4
        with:
          name: android-test-report
          path: ./reports/
          retention-days: 30

  test-web:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18.x'

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install Dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          heimdall playwright install chromium

      - name: Run Web Tests
        run: heimdall run ./tests/web/ --browser chromium --report junit-xml --output ./reports/

      - name: Upload Test Report
        uses: actions/upload-artifact@v4
        with:
          name: web-test-report
          path: ./reports/
          retention-days: 30
```

### 5.2 GitLab CI

Buat file `.gitlab-ci.yml`:

```yaml
stages:
  - test

variables:
  PYTHONUNBUFFERED: 1

test_android:
  stage: test
  image: python:3.10-slim
  before_script:
    - apt-get update && apt-get install -y android-tools-adb
    - pip install -r requirements.txt
  script:
    - heimdall run ./tests/ --parallel 2 --report junit-xml --output ./reports/
  artifacts:
    reports:
      junit: junit-report.xml
    paths:
      - reports/
    expire_in: 30 days

test_web:
  stage: test
  image: python:3.10-nodejs
  before_script:
    - pip install -r requirements.txt
    - heimdall playwright install chromium
  script:
    - heimdall run ./tests/web/ --browser chromium --report junit-xml --output ./reports/
  artifacts:
    reports:
      junit: junit-report.xml
    paths:
      - reports/
    expire_in: 30 days
```

### 5.3 Jenkins Pipeline

Buat `Jenkinsfile`:

```groovy
pipeline {
  agent any

  environment {
    VENV = 'venv'
    PYTHON_VERSION = 'python3.10'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Setup') {
      steps {
        sh 'python3 -m venv $VENV'
        sh '. $VENV/bin/activate && pip install -r requirements.txt'
      }
    }

    stage('Run Tests') {
      steps {
        sh '''
          . $VENV/bin/activate
          heimdall run ./tests/ --parallel 3 --report junit-xml --output ./reports/
        '''
      }
    }
  }

  post {
    always {
      junit 'reports/junit-report.xml'
      archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
    }
  }
}
```

---

## Langkah 6: Konfigurasi Tambahan

### 6.1 Environment Variables

Anda bisa mengatur environment variables untuk konfigurasi:

```bash
# Set API token untuk autentikasi
export HEIMDALL_API_TOKEN="your-api-token-here"

# Set konfigurasi parallel
export HEIMDALL_PARALLEL_PROCESSES=5

# Run test
heimdall run login_test.heim
```

### 6.2 Config File (`.heimdallrc.json`)

Buat file konfigurasi di root project:

```json
{
  "parallel": {
    "maxProcesses": 5,
    "throttle": 1000
  },
  "headless": true,
  "defaultBrowser": "chromium",
  "timeout": 30000,
  "retry": 1,
  "reportDir": "./reports/",
  "screenshots": true,
  "logs": {
    "level": "info",
    "outputs": ["console", "file"]
  }
}
```

### 6.3 Timeout dan Retry

```bash
# Set timeout eksekusi (detik)
heimdall run login_test.heim --timeout 60

# Set retry count
heimdall run login_test.heim --retry 2
```

---

## Troubleshooting Menjalankan Test

### Problem: `Device not found` atau `No devices/emulators found`

**Penyebab:** Device tidak terdeteksi atau ADB tidak berjalan.

**Solusi:**

```bash
# Restart ADB server
adb kill-server
adb start-server
adb devices

# Pastikan device terhubung dan USB debugging aktif
```

---

### Problem: `Browser process failed to start` (Web)

**Penyebab:** Browser tidak terinstall dengan benar atau dependensi sistem hilang.

**Solusi:**

```bash
# Reinstall browser
heimdall playwright install chromium

# Install dependensi sistem (Ubuntu/Debian)
sudo apt-get install -y libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

# Jalankan dengan --no-sandbox jika diperlukan
heimdall run test.heim --args="--no-sandbox"
```

---

### Problem: `Test timeout` atau `Execution timed out`

**Penyebab:** Test takes too long atau loading page/laman lebih lama dari timeout.

**Solusi:**

```bash
# Tambah timeout
heimdall run login_test.heim --timeout 120

# Atau di dalam script .heim:
Tunggu sampai muncul teks "Dashboard" timeout 60 detik
```

---

### Problem: `Report generation failed` atau `Permission denied`

**Penyebab:** Folder output tidak ada atau tidak ada permission menulis.

**Solusi:**

```bash
# Buat folder output
mkdir -p ./reports

# Pastikan permission
chmod 755 ./reports

# Atau gunakan path yang benar
heimdall run login_test.heim --report json --output /tmp/reports/
```

---

### Problem: `Parallel execution flaky` atau hasil tidak konsisten

**Penyebab:** Resource terbatas atau race condition.

**Solusi:**

```bash
# Kurangi jumlah proses paralel
heimdall run ./tests/ --parallel 2

# Jika di CI, pastikan runners memiliki cukup resource
# Di GitHub Actions, gunakan runner dengan mehr memory:
# runs-on: ubuntu-latest (default 7GB)
# Atau custom runner dengan resourcelebih tinggi
```

---

### Problem: `Element not clickable at point` atau `Element obscured`

**Penyebab:** Elemen terhalang oleh overlay atau animasi lain.

**Solusi:**

```bash
# Tambah wait sebelum klik
Tunggu sampai muncul teks "Login" timeout 30 detik
Ketuk tombol "Login"

# Atau gunakan scrolling
Gulir ke "Bawah"
Ketuk tombol "Login"
```

---

### Problem: `Allure report not found` atau `allure command not found`

**Penyebab:** Allure tidak terinstall.

**Solusi:**

```bash
# Install Allure
# Ubuntu/Debian
wget -qO /tmp/allure.deb https://github.com/qameta/allure/releases/download/2.29.0/allure-2.29.0.deb
sudo apt install /tmp/allure.deb

# macOS
brew install allure

# Atau download jar langsung
wget https://github.com/qameta/allure/releases/latest/download/allure-commandline.zip
unzip allure-commandline.zip -d /home/user/allure
export PATH=$PATH:/home/user/allure/bin
```

---

### Problem: `Permission denied` saat install package

**Penyebab:** Virtual environment tidak aktif atau pip install dengan permission salah.

**Solusi:**

```bash
# Aktifkan virtual environment
source venv/bin/activate

# Install ulang
pip install -r requirements.txt --upgrade --force-reinstall

# Atau gunakan --user flag (jangan pakai sudo)
pip install -r requirements.txt --user
```

---

## Checklist Menjalankan Test

Gunakan checklist ini setelah berhasil menjalankan test:

- [ ] Test single file berhasil dijalankan (`heimdall run test.heim`)
- [ ] Test suite folder berhasil dijalankan (`heimdall suite --dir tests/`)
- [ ] Parallel execution berfungsi (`--parallel N`)
- [ ] Report JSON berhasil dihasilkan (`--report json`)
- [ ] Report JUnit XML berhasil dihasilkan (`--report junit-xml`)
- [ ] (Opsional) Report Allure berhasil dihasilkan (`--report allure`)
- [ ] CI/CD pipeline berhasil mengintegrasikan test Heimdall
- [ ] Timeout dan retry sudah dikonfigurasi sesuai kebutuhan

---

## Next Steps

Setelah test berhasil dijalankan, pelajari lebih lanjut tentang:

| Topik | Link |
|-------|------|
| **Visual Regression Testing** | [Visual Regression](../tutorials/advanced-tutorials/visual-regression.md) |
| **Data-Driven Testing** | [DDT Tutorial](../tutorials/advanced-tutorials/data-driven-testing.md) |
| **AI Test Generation** | [AI Test Generation](../tutorials/advanced-tutorials/ai-test-generation.md) |
| **Self-Healing Selector** | [Self-Healing](../features/advanced-features/self-healing.md) |

---

## Quick Reference Command

```bash
# Run single test
heimdall run test.heim

# Run test dengan device tertentu
heimdall run test.heim --device emulator-5554

# Run test dengan browser tertentu
heimdall run test.heim --browser chromium

# Run suite folder
heimdall suite --dir ./tests/

# Run parallel
heimdall run ./tests/ --parallel 5

# Run dengan report
heimdall run test.heim --report json --output ./reports/

# Run dengan debug log
heimdall run test.heim --log-level debug

# Run dengan headed mode (Web)
heimdall run test.heim --browser chromium --headed
```

---