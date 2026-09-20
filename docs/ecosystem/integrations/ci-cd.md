# Integrasi CI/CD

Heimdall menyediakan **Headless CLI** yang dirancang khusus untuk dijalankan di dalam pipeline CI/CD tanpa perlu GUI. Dokumen ini menyajikan contoh siap pakai (ready-to-use) untuk **GitHub Actions**, **GitLab CI**, **Jenkins**, dan **CircleCI**, lengkap dengan strategi *matrix*, *cache*, serta panduan troubleshoting.

---

## Ringkasan Eksekusi Headless

Heimdall dapat dieksekusi sepenuhnya lewat CLI. Berikut perintah dasar yang didukung:

| Command | Deskripsi |
|---------|-----------|
| `heimdall run <file>.heim` | Jalankan satu file test |
| `heimdall suite --dir ./tests/` | Jalankan seluruh test di folder |
| `heimdall devices` | Daftar perangkat yang terhubung |
| `heimdall health --check adb --check drivers` | Cek kondisi sistem |
| `heimdall api-test <file>.json` | Jalankan API test suite |

### Opsi Penting untuk CI/CD

| Opsi | Format | Fungsi |
|------|--------|--------|
| `--parallel <num>` | `<1-10>` | Jumlah proses paralel (maks 10) |
| `--report <format>` | `junit-xml|allure|json` | Format laporan keluaran |
| `--output <path>` | path | Folder untuk menyimpan laporan |
| `--device <serial>` | `<serial,serial,...>` | Target device (bisa multiple) |
| `--token <api-token>` | string | Token autentikasi API |
| `--log-level <level>` | `debug|info|warn|error` | Verbositas log |
| `--browser <name>` | `chromium|firefox|webkit` | Browser untuk Web test |
| `--headed` | flag | Jalankan browser *tidak headless* (debug) |

---

## GitHub Actions

::: v-pre
Workflow siap pakai dengan **matrix strategy** untuk menjalankan test di Android emulator serta Web browser secara paralel, plus **cache** dependensi Python dan Playwright.

### Struktur Project

```
my-project/
├── .github/
│   └── workflows/
│       └── heimdall-ci.yml        # workflow di bawah ini
├── tests/
│   ├── android/
│   │   └── login_test.heim
│   └── web/
│       └── dashboard_test.heim
├── reports/
└── requirements.txt
```

### Workflow `.github/workflows/heimdall-ci.yml`

```yaml
name: Heimdall CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  HEIMDALL_REPORT_DIR: ./reports

jobs:
  lint:
    name: Lint & Health Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Cache Heimdall
        uses: actions/cache@v4
        with:
          path: ~/.cache/pre-commit
          key: pre-commit-${{ runner.os }}-${{ hashFiles('.pre-commit-config.yaml') }}

      - name: Install Dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pre-commit

      - name: Health Check
        run: heimdall health --check adb --check drivers --check python

  test-android:
    name: Android (${{ matrix.api }})
    runs-on: ubuntu-latest
    timeout-minutes: 45
    strategy:
      fail-fast: false
      matrix:
        api: [29, 33]                # Android API 29 & 33
        arch: [x86_64]
        device: [pixel_4, pixel_5]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Cache Python deps
        uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: pip-${{ runner.os }}-${{ hashFiles('requirements.txt') }}

      - name: Cache Gradle & SDK
        uses: actions/cache@v4
        with:
          path: |
            ~/.android
            ~/.gradle
          key: android-${{ runner.os }}-${{ matrix.api }}

      - name: Install Android SDK
        uses: android-actions/setup-android@v3

      - name: Create + Start Emulator
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: ${{ matrix.api }}
          arch: ${{ matrix.arch }}
          target: google_apis
          device: ${{ matrix.device }}
          force-avd-creation: true
          emulator-options: "-no-snapshot -no-window -no-audio -no-boot-anim -gpu swiftshader_indirect"
          script: |
            adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed 2>/dev/null | tr -d "\r") ]]; do sleep 1; done'
            python -m uiautomator2 init

      - name: Install Heimdall + deps
        run: |
          pip install -r requirements.txt
          heimdall --version

      - name: Run Android Tests
        run: |
          mkdir -p ${{ env.HEIMDALL_REPORT_DIR }}/android-${{ matrix.api }}
          heimdall run ./tests/android/ \
            --parallel 3 \
            --report junit-xml \
            --report json \
            --output ${{ env.HEIMDALL_REPORT_DIR }}/android-${{ matrix.api }}

      - name: Upload Android Reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: report-android-api-${{ matrix.api }}
          path: ${{ env.HEIMDALL_REPORT_DIR }}/android-${{ matrix.api }}
          retention-days: 30

  test-web:
    name: Web (${{ matrix.browser }})
    runs-on: ubuntu-latest
    timeout-minutes: 30
    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18.x'
          cache: 'npm'

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Cache Python deps
        uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: pip-web-${{ runner.os }}-${{ hashFiles('requirements.txt') }}

      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ matrix.browser }}

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          heimdall playwright install-deps ${{ matrix.browser }}
          heimdall playwright install ${{ matrix.browser }}

      - name: Run Web Tests
        run: |
          mkdir -p ${{ env.HEIMDALL_REPORT_DIR }}/web-${{ matrix.browser }}
          heimdall run ./tests/web/ \
            --browser ${{ matrix.browser }} \
            --parallel 2 \
            --report junit-xml \
            --report json \
            --output ${{ env.HEIMDALL_REPORT_DIR }}/web-${{ matrix.browser }}

      - name: Upload Web Reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: report-web-${{ matrix.browser }}
          path: ${{ env.HEIMDALL_REPORT_DIR }}/web-${{ matrix.browser }}
          retention-days: 30

  merge-reports:
    name: Merge JUnit Reports
    runs-on: ubuntu-latest
    needs: [test-android, test-web]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: ./downloaded-reports

      - name: Install xmltodict
        run: pip install xmltodict

      - name: Merge JUnit XML
        run: |
          python <<'PY'
          import glob, xmltodict, io, os
          from xml.dom.minidom import parseString
          files = sorted(glob.glob("./downloaded-reports/**/*junit*.xml", recursive=True))
          suites = []
          for f in files:
              with open(f) as fh:
                  data = xmltodict.parse(fh.read())
                  ts = data.get("testsuites", data.get("testsuite"))
                  if isinstance(ts, dict):
                      ts = [ts]
                  suites.extend(ts)
          out = {"testsuites": {"testsuite": suites}}
          os.makedirs("./reports", exist_ok=True)
          xml_str = xmltodict.unparse(out)
          with open("./reports/merged-report.xml", "w") as fh:
              fh.write(parseString(xml_str).toprettyxml(indent="  "))
          print("Merged", len(files), "JUnit files -> ./reports/merged-report.xml")
          PY

      - name: Upload merged report
        uses: actions/upload-artifact@v4
        with:
          name: merged-junit-report
          path: ./reports/merged-report.xml
          retention-days: 30

      - name: Publish Allure report (optional)
        if: always()
        run: |
          pip install allure-combine
          allure-combine ./downloaded-reports/*/allure* -o ./allure-report || true
```

### Cache Best Practices (GitHub Actions)

| Apa yang dicache | Key | Path |
|------------------|-----|------|
| Python pip | `pip-${{ runner.os }}-${{ hashFiles('requirements.txt') }}` | `~/.cache/pip` |
| Node npm | `npm-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}` | `~/.npm` |
| Playwright browsers | `playwright-${{ runner.os }}` | `~/.cache/ms-playwright` |
| Android SDK | `android-${{ runner.os }}` | `~/.android`, `~/.gradle` |
| uiautomator2 server | `uiautomator2-${{ runner.os }}` | `~/.android/uiautomator2` |
:::

---

## GitLab CI

File `.gitlab-ci.yml` siap pakai dengan stage paralel dan artefak JUnit.

```yaml
stages:
  - validate
  - test
  - report

variables:
  PYTHONUNBUFFERED: 1
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"
  HEIMDALL_WORKSPACE: "$CI_PROJECT_DIR/heimdall_workspace"

cache:
  key: "${CI_COMMIT_REF_SLUG}"
  paths:
    - .cache/pip
    - .venv/

validate:
  stage: validate
  image: python:3.11-slim
  before_script:
    - python -m venv .venv
    - source .venv/bin/activate
    - pip install -r requirements.txt
  script:
    - heimdall health --check python --check drivers

test-android:
  stage: test
  image: python:3.11
  services:
    - name: reactivecircus/android-emulator-arm:29-googleapis
        alias: android-emulator
  variables:
    DEVICE_SERIAL: "emulator-5554"
  before_script:
    - apt-get update && apt-get install -y android-tools-adb
    - python -m venv .venv
    - source .venv/bin/activate
    - pip install -r requirements.txt
    - adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done'
    - python -m uiautomator2 init
  script:
    - mkdir -p reports/android
    - heimdall run ./tests/
        --parallel 3
        --report junit-xml
        --report allure
        --output reports/android
  artifacts:
    when: always
    paths:
      - reports/android/
    reports:
      junit: reports/android/junit-report.xml
    expire_in: 7 days

test-web:
  stage: test
  image: python:3.11
  before_script:
    - python -m venv .venv
    - source .venv/bin/activate
    - pip install -r requirements.txt
    - heimdall playwright install-deps chromium
    - heimdall playwright install chromium
  script:
    - mkdir -p reports/web
    - heimdall run ./tests/web/
        --browser chromium
        --parallel 2
        --report junit-xml
        --report allure
        --output reports/web
  artifacts:
    when: always
    paths:
      - reports/web/
    reports:
      junit: reports/web/junit-report.xml
    expire_in: 7 days

merge-reports:
  stage: report
  image: python:3.11
  dependencies:
    - test-android
    - test-web
  script:
    - pip install junit-xml-merger
    - mkdir -p final-reports
    - junit-xml-merge
        reports/android/junit-report.xml
        reports/web/junit-report.xml
        --output final-reports/merged-junit-report.xml
  artifacts:
    paths:
      - final-reports/
    reports:
      junit: final-reports/merged-junit-report.xml
    expire_in: 7 days
```

---

## Jenkins (Jenkinsfile)

Pipeline terstruktur dengan stage paralel untuk Android dan Web.

```groovy
pipeline {
    agent any

    environment {
        VENV          = 'venv'
        PYTHON        = 'python3'
        REPORT_DIR    = "${env.WORKSPACE}/reports"
        REQUIREMENTS  = 'requirements.txt'
    }

    tools {
        maven 'Maven 3.9'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git clean -fdx'
            }
        }

        stage('Setup') {
            steps {
                sh '''
                    ${PYTHON} -m venv ${VENV}
                    . ${VENV}/bin/activate
                    python -m pip install --upgrade pip
                    pip install -r ${REQUIREMENTS}
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    . ${VENV}/bin/activate
                    heimdall health --check adb --check drivers --check python
                '''
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Android Tests') {
                    when {
                        expression { fileExists('tests/android') }
                    }
                    steps {
                        sh '''
                            . ${VENV}/bin/activate
                            mkdir -p ${REPORT_DIR}/android
                            heimdall run ./tests/android/ \
                              --parallel 3 \
                              --report junit-xml \
                              --report json \
                              --output ${REPORT_DIR}/android
                        '''
                    }
                    post {
                        always {
                            junit allowNoTestResults: false,
                                  testResults: "${REPORT_DIR}/android/junit-report.xml"
                            archiveArtifacts artifacts: "${REPORT_DIR}/android/**/*",
                                             allowEmptyArchive: true
                        }
                    }
                }
                stage('Web Tests') {
                    when {
                        expression { fileExists('tests/web') }
                    }
                    steps {
                        sh '''
                            . ${VENV}/bin/activate
                            mkdir -p ${REPORT_DIR}/web
                            heimdall run ./tests/web/ \
                              --browser chromium \
                              --parallel 2 \
                              --report junit-xml \
                              --report allure \
                              --output ${REPORT_DIR}/web
                        '''
                    }
                    post {
                        always {
                            junit allowNoTestResults: false,
                                  testResults: "${REPORT_DIR}/web/junit-report.xml"
                            archiveArtifacts artifacts: "${REPORT_DIR}/web/**/*",
                                             allowEmptyArchive: true
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs(cleanWhenFailure: true)
        }
    }
}
```

---

## CircleCI

Konfigurasi `config.yml` untuk CircleCI dengan Docker executor dan cache.

```yaml
version: 2.1

orbs:
  python: circleci/python@2.1.1
  browser-tools: circleci/browser-tools@12.3.0

executors:
  android-executor:
    docker: []
    machine:
      image: ubuntu-2204:current
  web-executor:
    docker:
      - image: cimg/python:3.11-node

jobs:
  validate:
    executor: web-executor
    steps:
      - checkout
      - python/venus
        arguments:
          venv: venv
          venv-command: python -m venv
      - run: |
          . venv/bin/activate
          pip install -r requirements.txt
          heimdall health --check python

  test-android:
    executor: android-executor
    steps:
      - checkout
      - run:
          name: Start Android Emulator
          command: |
            /opt/android-sdk/emulator/emulator -avd pixel_4_api_33 \
              -no-snapshot -no-window -no-audio -gpu swiftshader_indirect &
            echo $! > /tmp/emulator.pid
            sleep 5
            adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done'
            python -m uiautomator2 init
      - run:
          name: Install deps + run tests
          command: |
            python -m venv venv
            . venv/bin/activate
            pip install -r requirements.txt
            mkdir -p reports/android
            heimdall run ./tests/ \
              --parallel 3 \
              --report junit-xml \
              --report allure \
              --output reports/android
      - store_test_results:
          path: reports/android/junit-report.xml
      - store_artifacts:
          path: reports/android
          expire_in: 7 days

  test-web:
    executor: web-executor
    steps:
      - checkout
      - browser-tools/install-browser-tools:
          browsers: "chrome"
      - run:
          name: Install Playwright
          command: |
            . venv/bin/activate
            heimdall playwright install-deps chromium
            heimdall playwright install chromium
      - run:
          name: Run Web Tests
          command: |
            . venv/bin/activate
            mkdir -p reports/web
            heimdall run ./tests/web/ \
              --browser chromium \
              --parallel 2 \
              --report junit-xml \
              --output reports/web
      - store_test_results:
          path: reports/web/junit-report.xml
      - store_artifacts:
          path: reports/web

workflows:
  version: 2
  build-and-test:
    jobs:
      - validate
      - test-android:
          requires: [validate]
          filters:
            branches:
              only:
                - main
                - develop
      - test-web:
          requires: [validate]
          filters:
            branches:
              only:
                - main
                - develop
```

---

## API Token Authentication

::: v-pre
Untuk lingkungan CI/CD yang memerlukan autentikasi, gunakan flag `--token`:

```bash
heimdall run ./tests/ \
  --token "${HEIMDALL_API_TOKEN}" \
  --report junit-xml \
  --output ./reports/
```

Simpan token sebagai **secret** di masing-masing provider:

| Provider | Nama Secret |
|----------|-------------|
| GitHub Actions | `HEIMDALL_API_TOKEN` |
| GitLab CI | `HEIMDALL_API_TOKEN` |
| Jenkins | `HEIMDALL_API_TOKEN` (Credential) |
| CircleCI | `HEIMDALL_API_TOKEN` |
:::

---

## Report Format Output

### Struktur `HeadlessExecutionReport`

```typescript
interface HeadlessExecutionReport {
  id: string;
  status: 'success' | 'failure';
  startTime: string;
  endTime: string;
  duration: number;
  reportUrl: string;
  deviceDetails: {
    model: string;
    osVersion: string;
    appPackage: string;
  };
  issues: {
    type: 'error' | 'warning' | 'info';
    message: string;
    location: string;
    failureCount: number;
  }[];
  exports: {
    type: 'junit-xml' | 'allure' | 'json';
    url: string;
    size?: number;
  }[];
}
```

### Contoh JUnit XML (hasil `heimdall run`)

```xml
<testsuites>
  <testsuite name="login_test.heim" tests="3" failures="0">
    <testcase classname="login" name="Login sukses" time="4.21"/>
    <testcase classname="login" name="Login gagal" time="3.87"/>
  </testsuite>
</testsuites>
```

---

## Troubleshooting CI/CD

::: v-pre
### 1. Error: `ADB not found` / `Device not detected`

**Penyebab:** Android SDK tidak lengkap atau emulator belum siap.

**Solusi:**
- Pastikan `android-actions/setup-android@v3` di GitHub Actions.
- Tunggu emulator *boot*:
  ```bash
  adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done'
  ```
- Inisialisasi uiautomator2: `python -m uiautomator2 init`.
:::

### 2. Error: `Permission denied` saat menulis report

**Penyebab:** Folder output belum ada atau tidak dapat ditulis.

**Solusi:**
```bash
mkdir -p ./reports/
chmod 755 ./reports/
```

### 3. Error: `parallel execution unstable`

**Penyebab:** Terlalu banyak proses untuk jumlah device yang tersedia.

**Solusi:**
- Turunkan `--parallel`, misalnya `--parallel 2`.
- Gunakan `--device` untuk membatasi target device.
- Tambah throttle di `.heimdallrc.json`:
  ```json
  {
    "parallel": {
      "maxProcesses": 5,
      "throttle": 1000
    }
  }
  ```

### 4. Error: `Browser process failed to start` (Web)

**Penyebab:** Dependensi sistem browser belum terpasang.

**Solusi:**
```bash
heimdall playwright install-deps chromium
heimdall playwright install chromium
# Jika di-container, tambahkan --no-sandbox:
heimdall run test.heim --args="--no-sandbox"
```

::: v-pre
### 5. Error: `Token authentication failed`

**Penyebab:** Token salah atau tidak lengkap.

**Solusi:**
- Simpan token di secret environment (`HEIMDALL_API_TOKEN`).
- Gunakan `--token "${HEIMDALL_API_TOKEN}"`.
- Pastikan token memiliki permission `test-runner:execute`.
:::

### 6. Error: `JUnit merge failed` / duplikat test case

**Penyebab:** Nama test case sama di banyak file.

**Solusi:**
- Gunakan `classname` unik per file.
- Merge hanya `testsuite`, bukan `testcase` yang duplikat.
- Gunakan tool `junit-xml-merger` di GitLab CI (lihat contoh di atas).

### 7. Debug Mode

Aktifkan log debug untuk mendiagnosis:

```bash
heimdall run ./tests/ --log-level debug
```

Log disimpan di:
- `~/.heimdall/logs/`
- Output terminal (stdout/stderr)

---

## Checklist Integrasi CI/CD

::: v-pre
- [ ] `requirements.txt` berisi `heimdall` dan dependensi driver.
- [ ] Workflow/CI siap pakai di-commit (`ci-cd.md`, `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`).
- [ ] Emulator/browser service sudah dikonfigurasi dan diinisialisasi (`uiautomator2 init` / `playwright install`).
- [ ] `--report junit-xml` dan `--output` sudah di-set.
- [ ] Artefak dan hasil tes di-upload (upload-artifact / publishJUnit).
- [ ] Health check `heimdall health` berjalan sebelum test.
- [ ] Token disimpan di secrets, bukan hardcode.
- [ ] Matrix strategy sudah mencakup semua konstanta device/browser yang diuji.
:::

---

## Referensi Terkait

- [Headless CLI](../features/basic-features/headsless-cli.md) — Referensi perintah CLI lengkap.
- [Menjalankan Test](../../tutorials/getting-started/running-tests.md) — Panduan lokal.
- [Pytest Integration](./pytest.md) — Integrasi pytest sebagai alternatif runner.
- [TMS Integration](./tms.md) — Sinkronisasi hasil ke sistem manajemen test.
