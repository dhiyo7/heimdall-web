# Headless CLI

Headless CLI memungkinkan eksekusi automation test tanpa GUI. Fitur ini dirancang agar mudah diintegrasikan ke dalam pipeline CI/CD.

## Command Reference

| Command | Deskripsi | Contoh |
|---------|-----------|--------|
| `heimdall run` | Jalankan satu atau beberapa skrip `.heim` | `heimdall run login.heim` |
| `heimdall suite` | Jalankan kumpulan test case berdasarkan direktori | `heimdall suite ./tests/` |
| `heimdall devices` | Menampilkan daftar perangkat yang terhubung | `heimdall devices` |
| `heimdall health` | Periksa kondisi sistem sebelum eksekusi | `heimdall health --check adb --check drivers` |

## Options

| Option | Deskripsi |
|--------|-----------|
| `--parallel <num>` | Jumlah proses paralel. Maksimum 10. |
| `--report <format>` | Format laporan: `junit-xml`, `allure`, `json`. |
| `--output <path>` | Folder output untuk laporan dan artefak. |
| `--device <serial>` | Target perangkat berdasarkan serial, bisa multiple dengan pemisah koma. |
| `--token <api-token>` | Token autentikasi untuk akses fitur tertentu atau hasil test yang dibutuhkan API. |
| `--log-level <level>` | Tingkat log: `debug`, `info`, `warn`, `error`. |

## Contoh Penggunaan

```bash
# Eksekusi tunggal
heimdall run login_test.heim --report json --output ./reports/

# Eksekusi paralel
heimdall run ./tests/ --parallel 5 --report allure

# Multi-device
heimdall suite ./tests/ --parallel 10 --device "emulator-5554,emulator-5556"

# Health check
heimdall health --check adb --check drivers
```

## Output Formats

### JUnit XML
```xml
<testsuites>
  <testsuite name="login_test.heim" tests="3" failures="0">
    <testcase classname="login" name="Login sukses" time="4.21"/>
    <testcase classname="login" name="Login gagal" time="3.87"/>
  </testsuite>
</testsuites>
```

### JSON
```json
{
  "summary": {
    "passed": 12,
    "failed": 2,
    "skipped": 1,
    "total": 15
  },
  "results": [
    {
      "file": "login_test.heim",
      "case": "Login sukses",
      "status": "passed",
      "durationMs": 4210
    }
  ],
  "duration": "00:05:23"
}
```

### Allure
Hasil laporan Allure dapat ditampilkan menggunakan CLI Allure setelah eksekusi selesai.

```bash
allure serve ./reports/allure-report/
```

## Parallel Execution

### Konfigurasi
```json
{
  "parallel": {
    "maxProcesses": 10,
    "throttle": 1000,
    "deviceManager": {
      "maxDevicesPerProcess": 2
    }
  },
  "headless": {
    "mode": "production",
    "headlessMode": true
  }
}
```

### Aturan Penting
- Maksimum 10 proses paralel.
- Gunakan `--device` saat menjalankan banyak perangkat agar alokasi device aman.
- Tambahkan throttle jika pipeline terlihat membebani perangkat.

## CI/CD Integration

### GitHub Actions
```yaml
name: Heimdall Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Heimdall
        run: |
          pip install heimdall
          python -m uiautomator2 init
      - name: Run Tests
        run: heimdall run tests/ --parallel 3 --report junit-xml --output ./reports/
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: test-report
          path: ./reports/
```

### GitLab CI
```yaml
heimdall_test:
  stage: test
  script:
    - pip install heimdall
    - python -m uiautomator2 init
    - heimdall run tests/ --parallel 3 --report allure
  artifacts:
    paths:
      - allure-report/
    reports:
      junit: junit-report.xml
```

### Jenkins Pipeline
```groovy
pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        sh 'pip install heimdall'
        sh 'python -m uiautomator2 init'
        sh 'heimdall run tests/ --parallel 3 --report junit-xml'
      }
      post {
        always {
          junit 'junit-report.xml'
        }
      }
    }
  }
}
```

## Troubleshooting

| Masalah | Kemungkinan Penyebab | Solusi |
|---------|----------------------|--------|
| `ADB not found` | Android SDK Platform-Tools tidak ada di PATH | Instal Platform-Tools dan tambahkan ke PATH |
| `Device not detected` | USB debugging dimatikan atau kabel/emulator tidak terdeteksi | Aktifkan USB debugging dan cek `heimdall devices` |
| `Token authentication failed` | Token salah atau tidak memiliki permission | Periksa token dan izin aksesnya |
| `Report generation failed` | Folder output tidak memiliki permission | Gunakan path yang bisa ditulis atau buat foldernya terlebih dahulu |
| `Parallel execution unstable` | Jumlah proses terlalu banyak untuk perangkat yang tersedia | Turunkan `--parallel` atau batasi dengan `--device` |

### Debug Mode
```bash
heimdall run login_test.heim --log-level debug
```

Log tersedia di:
- `~/.heimdall/logs/`
- output terminal saat menggunakan `--log-level debug`
