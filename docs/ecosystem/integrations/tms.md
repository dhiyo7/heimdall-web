# Integrasi TMS

Dokumen ini menjelaskan integrasi Heimdall dengan sistem **Test Management System (TMS)** seperti JIRA, TestRail, Azure DevOps (Test Plans), dan sistem berbasis CSV/Excel. Integrasi ini mencakup setup koneksi, sinkronisasi test case, ekspor hasil, linking rekaman ke test case ID, serta webhook automation.

---

## Ringkasan Integrasi

Heimdall menyediakan dua jalur integrasi TMS:

| Metode | Deskripsi | Cocok Untuk |
|--------|-----------|-------------|
| **Native Connector** | Plugin resmi untuk TMS populer | JIRA, TestRail, Azure DevOps |
| **Universal Import/Export** | CSV / Excel bulk import/export | TMS lain yang mendukung CSV |

### Fitur Utama

- **Sync Test Case**: Import/export test case dari dan ke TMS.
- **Link Recording**: Tautkan hasil rekaman (`.heim`) ke Test Case ID di TMS.
- **Webhook Automation**: Kirim notifikasi perubahan hasil test ke TMS.
- **Result Traceability**: Setiap eksekusi test disimpan di database dan dapat dikaitkan dengan kebutuhan bisnis.

---

## Setup Koneksi

### Konfigurasi Global

Buat atau edit file `.heimdallrc.json` di root project untuk konfigurasi koneksi:

```json
{
  "tms": {
    "enabled": true,
    "defaultProvider": "jira",
    "jira": {
      "baseUrl": "https://your-domain.atlassian.net",
      "projectKey": "PROJ",
      "email": "user@example.com",
      "apiToken": "your-jira-api-token"
    },
    "testrail": {
      "baseUrl": "https://your-domain.testrail.io",
      "username": "user@example.com",
      "password": "testrail-api-key"
    },
    "azureDevOps": {
      "organization": "your-org",
      "project": "your-project",
      "personalAccessToken": "your-pat"
    },
    "upload": {
      "enabled": true,
      "format": "csv",
      "fieldMapping": {
        "testCaseId": "id",
        "title": "judul",
        "description": "deskripsi",
        "status": "status",
        "platform": "platform",
        "device": "device"
      }
    }
  }
}
```

### Setup melalui CLI

Jalankan perintah setup interaktif:

```bash
heimdall tms setup
```

Output interaktif:
```
Pilih provider TMS:
1) JIRA
2) TestRail
3) Azure DevOps
4) Upload CSV/Excel

> 1

Masukkan URL: https://your-domain.atlassian.net
Masukkan Project Key: PROJ
Masukkan Email: user@example.com
Masukkan API Token: *****

Konfigurasi berhasil disimpan di .heimdallrc.json
```

---

## Sinkronisasi Test Case

### Import Test Case dari TMS

```bash
# Import semua test case dari TMS
heimdall tms import --provider jira --project PROJ --output ./tests/

# Import test case tertentu
heimdall tms import --provider jira --project PROJ --query 'project = PROJ AND component = "Mobile App"' --output ./tests/
```

Contoh output folder:
```
tests/
├── TC-LOGIN-001.heim
├── TC-LOGIN-002.heim
├── TC-DASHBOARD-001.heim
└── TC-PAYMENT-001.heim
```

### Export Test Case ke TMS

```bash
# Export semua test case lokal ke TMS
heimdall tms export --provider jira --project PROJ --input ./tests/

# Export dengan filter tertentu
heimdall tms export --provider jira --project PROJ --input ./tests/ --pattern "login_*.heim"
```

### Mapping Kolom CSV/Excel

Untuk TMS yang mendukung CSV/Excel, buat file `tms-mapping.json`:

```json
{
  "headerRow": 1,
  "columns": {
    "testCaseId": { "column": "A", "type": "string" },
    "title": { "column": "B", "type": "string" },
    "description": { "column": "C", "type": "string" },
    "platform": { "column": "D", "type": "enum:android,web" },
    "device": { "column": "E", "type": "string" },
    "steps": { "column": "F", "type": "json" },
    "priority": { "column": "G", "type": "string" }
  }
}
```

Import dengan mapping:

```bash
heimdall tms import --format csv --file ./testcases.csv --mapping ./tms-mapping.json --output ./tests/
```

---

## Ekspor Hasil

### Menjalankan Test dengan Link ke TMS

```bash
# Jalankan test dan tautkan hasil ke test case ID tertentu
heimdall run ./tests/login_test.heim \
  --tms-provider jira \
  --tms-project PROJ \
  --tms-testcase "TC-LOGIN-001"
```

### Ekspor Hasil Massal

```bash
# Ekspor semua hasil test di folder ke TMS
heimdall tms export-results --provider jira --project PROJ --reports-dir ./reports/
```

Contoh laporan yang dikirim:

```json
{
  "tmsLinkage": {
    "testCaseId": "TC-LOGIN-001",
    "executionId": "exec-20240115-001",
    "status": "passed",
    "platform": "android",
    "device": "emulator-5554",
    "duration": 12.34,
    "startedAt": "2024-01-15T10:30:00Z",
    "finishedAt": "2024-01-15T10:30:12Z",
    "resultUrl": "https://your-domain.atlassian.net/browse/PROJ-TC-LOGIN-001?status=passed"
  },
  "details": {
    "steps": 6,
    "failures": 0,
    "healingEvents": 0,
    "screenshots": [
      "https://storage.example.com/screenshots/TC-LOGIN-001-step-1.png"
    ]
  }
}
```

### Update Status Test Case di TMS

```bash
# Update status test case di TMS berdasarkan hasil test
heimdall tms update-status \
  --provider jira \
  --project PROJ \
  --testcase "TC-LOGIN-001" \
  --status passed \
  --comment "Automated test passed on Android emulator API 33"
```

---

## Linking Recording ke Test Case ID

### Rekam dan Tautkan Langsung ke TMS

```bash
heimdall record \
  --device emulator-5554 \
  --output ./rekaman/login_rekam.json \
  --export ./tests/TC-LOGIN-001.heim \
  --tms-project "PROJ" \
  --tms-testcase "TC-LOGIN-001"
```

### Workflow Integrasi TMS

1. **Rekam aksi** dari fitur yang sedang diuji.
2. **Ekspor ke `.heim`** secara otomatis.
3. **Tautkan file ke Test Case ID** di TMS.
4. **TMS menyimpan linkage** antara skrip dan kebutuhan yang diuji.

### Informasi yang Disimpan di TMS

| Data | Deskripsi |
|------|-----------|
| Test Case ID | ID Test Case di TMS |
| Platform | Android atau Web |
| Device/Browser | Model perangkat atau browser |
| Recording Path | Path file `.heim` hasil rekaman |
| Last Run | Waktu eksekusi terakhir |
| Last Status | Status terakhir (passed/failed) |
| Script Link | URL atau path skrip yang digunakan |

### Contoh Data Model

```typescript
interface TMSLinkage {
  id: string;
  testCaseId: string;
  scriptPath: string;
  platform: "android" | "web";
  device: string;
  lastRun: string;
  lastStatus: "passed" | "failed" | "blocked";
  scriptUrl?: string;
  projectKey: string;
  tmsProvider: "jira" | "testrail" | "azure" | "csv";
}
```

---

## Webhook Automation

### Konfigurasi Webhook

Heimdall dapat mengirim notifikasi webhook saat test selesai dijalankan:

```json
{
  "webhooks": {
    "enabled": true,
    "endpoints": [
      {
        "url": "https://your-tms.com/api/webhook/heimdall",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer your-webhook-token",
          "Content-Type": "application/json"
        },
        "events": ["test.completed", "test.failed"],
        "retry": {
          "maxAttempts": 3,
          "delaySeconds": 5
        }
      }
    ]
  }
}
```

### Setup Webhook via CLI

```bash
# Tambahkan webhook
heimdall webhook add \
  --url "https://your-tms.com/api/webhook/heimdall" \
  --method POST \
  --header "Authorization: Bearer your-token" \
  --events test.completed,test.failed

# Daftar webhook
heimdall webhook list

# Hapus webhook
heimdall webhook remove --id webhook-001
```

### Contoh Webhook Payload

```json
{
  "event": "test.completed",
  "timestamp": "2024-01-15T10:30:12Z",
  "execution": {
    "id": "exec-20240115-001",
    "testCaseId": "TC-LOGIN-001",
    "status": "passed",
    "duration": 12.34,
    "platform": "android",
    "device": "emulator-5554"
  },
  "report": {
    "junit": "https://storage.example.com/reports/junit-report.xml",
    "allure": "https://storage.example.com/reports/allure/index.html",
    "screenshots": [
      "https://storage.example.com/screenshots/step-1.png"
    ]
  },
  "tms": {
    "provider": "jira",
    "projectKey": "PROJ",
    "issueUrl": "https://your-domain.atlassian.net/browse/PROJ-TC-LOGIN-001"
  }
}
```

---

## Setup JIRA

### Koneksi JIRA

```bash
# Setup JIRA connection
heimdall tms setup --provider jira

# Test koneksi
heimdall tms test-connection --provider jira
```

### Mapping Field JIRA

```json
{
  "jira": {
    "issueType": "Test Case",
    "projectKey": "PROJ",
    "labels": ["automation", "heimdall"],
    "customFields": {
      "Platform": { "field": "customfield_10001", "value": "${platform}" },
      "Device": { "field": "customfield_10002", "value": "${device}" },
      "Last Run": { "field": "customfield_10003", "value": "${lastRun}" },
      "Test Type": { "field": "customfield_10004", "value": "E2E" }
    }
  }
}
```

### Contoh Test Rail

```bash
# Setup TestRail
heimdall tms setup --provider testrail

# Import test cases
heimdall tms import --provider testrail --project 1 --suite "Mobile Tests" --output ./tests/

# Export results
heimdall tms export-results --provider testrail --project 1 --run-id 5 --reports-dir ./reports/
```

### Contoh Azure DevOps

```bash
# Setup Azure DevOps
heimdall tms setup --provider azureDevOps

# Import test cases
heimdall tms import --provider azureDevOps --organization myorg --project myproject --plan-id 12 --output ./tests/

# Export results
heimdall tms export-results --provider azureDevOps --organization myorg --project myproject --run-id 100 --reports-dir ./reports/
```

---

## Scripting Integration

### Script Python untuk TMS Sync

```python
import subprocess
import json

def sync_test_case_to_tms(test_file_path, tms_provider, project_key):
    """Sync test case dari file .heim ke TMS."""
    cmd = [
        "heimdall", "tms", "export",
        "--provider", tms_provider,
        "--project", project_key,
        "--input", test_file_path
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    
    response = json.loads(result.stdout)
    return response.get("testCaseId")

def push_result_to_tms(test_case_id, report_path, tms_provider, project_key):
    """Push hasil test ke TMS."""
    cmd = [
        "heimdall", "tms", "export-results",
        "--provider", tms_provider,
        "--project", project_key,
        "--testcase", test_case_id,
        "--report", report_path
    ]
    
    subprocess.run(cmd, check=True)
```

### Script untuk Bulk Import

```bash
#!/bin/bash
# bulk-import-to-tms.sh

PROVIDER="jira"
PROJECT="PROJ"
INPUT_DIR="./tests"

for test_file in "$INPUT_DIR"/*.heim; do
    echo "Importing: $test_file"
    
    heimdall tms export \
      --provider "$PROVIDER" \
      --project "$PROJECT" \
      --input "$test_file" \
      --link-recording \
      --tag automation
    
    echo "Imported: $test_file"
done
```

### Script untuk Bulk Export Results

```bash
#!/bin/bash
# bulk-export-results.sh

PROVIDER="jira"
PROJECT="PROJ"
REPORTS_DIR="./reports"

for report in "$REPORTS_DIR"/*/report.json; do
    test_case_id=$(basename $(dirname "$report"))
    echo "Exporting results for: $test_case_id"
    
    heimdall tms export-results \
      --provider "$PROVIDER" \
      --project "$PROJECT" \
      --testcase "$test_case_id" \
      --report "$report" \
      --comment "Automated test execution"
    
    echo "Exported: $test_case_id"
done
```

---

## Troubleshooting

### 1. Error: `Connection refused` ke TMS API

**Penyebab:** URL atau token salah, atau TMS tidak tersedia.

**Solusi:**
```bash
# Test koneksi
heimdall tms test-connection --provider jira

# Verifikasi URL dan token
heimdall tms info --provider jira

# Cek log
heimdall log --tms
```

### 2. Error: `Authentication failed`

**Penyebab:** Token/API key salah atau expired.

**Solusi:**
- Regenerate API token di TMS.
- Perbarui `.heimdallrc.json`:
  ```bash
  heimdall tms setup --provider jira
  ```
- Pastikan email dan token sesuai.

### 3. Error: `Test case not found` saat export

**Penyebab:** Test Case ID belum ada di TMS atau mapping salah.

**Solusi:**
- Pastikan test case sudah di-import terlebih dahulu.
- Cek mapping field di `.heimdallrc.json`.
- Gunakan flag `--create-if-missing` untuk auto-create:
  ```bash
  heimdall tms export --create-if-missing --provider jira --project PROJ --input ./tests/
  ```

### 4. Error: `Webhook delivery failed`

**Penyebab:** Webhook endpoint tidak responsif atau auth gagal.

**Solusi:**
- Verifikasi URL webhook bisa diakses dari server CI/CD.
- Cek header Authorization dan Content-Type.
- Lihat retry log:
  ```bash
  heimdall webhook log --id webhook-001
  ```

### 5. Error: `CSV parsing failed` saat import

**Penyebab:** Format CSV salah atau encoding tidak sesuai.

**Solusi:**
- Gunakan encoding UTF-8.
- Pastikan delimiter sesuai (koma untuk EN, titik-koma untuk ID).
- Periksa baris header dengan `--validate`:
  ```bash
  heimdall tms import --validate --format csv --file ./testcases.csv
  ```

---

## Best Practices

### 1. Naming Convention

| Tipe | Format | Contoh |
|------|--------|--------|
| Test Case ID | `TC-<FEATURE>-<NUMBER>` | `TC-LOGIN-001` |
| File `.heim` | `<TC-ID>.heim` | `TC-LOGIN-001.heim` |
| Recording File | `<TC-ID>-rekam.json` | `TC-LOGIN-001-rekam.json` |
| Folder | `<platform>/<feature>` | `android/login/` |

### 2. Workflow Integration

Rekomendasi workflow:

1. **Sprint Planning**: Import test case dari TMS ke lokal.
2. **Automation**: Rekam atau buat skrip `.heim` dan tautkan ke Test Case ID.
3. **Execution**: Jalankan test dengan flag `--tms-testcase`.
4. **Reporting**: Ekspor hasil ke TMS via webhook atau CLI.
5. **Review**: Tim QA review hasil di TMS dashboard.

### 3. Batasan Umum

| Batasan | Nilai |
|---------|-------|
| Maksimum test case per sync | 500 |
| Ukuran file `.heim` per test case | 1 MB |
| Ukuran attachment per request | 10 MB |
| Webhook timeout | 10 detik |
| Retry webhook | 3 kali |

---

## Checklist Integrasi TMS

- [ ] Provider TMS sudah dipilih (JIRA, TestRail, Azure, atau CSV).
- [ ] `.heimdallrc.json` sudah dikonfigurasi dengan kredensial TMS.
- [ ] Koneksi TMS berhasil (`heimdall tms test-connection`).
- [ ] Import test case dari TMS berhasil.
- [ ] Export test case ke TMS berhasil.
- [ ] Linkage recording ↔ Test Case ID terkonfigurasi.
- [ ] Webhook untuk automation notifikasi sudah diatur.
- [ ] Test script dapat dijalankan dengan flag `--tms-*`.
- [ ] Hasil test berhasil di-push ke TMS.
- [ ] Dokumen mapping kolom (untuk CSV/Excel) sudah dibuat.

---

## Referensi Terkait

- [Action Recording](../../features/advanced-features/action-recording.md) — Panduan rekaman aksi.
- [Headless CLI](../../features/basic-features/headsless-cli.md) — Referensi perintah CLI.
- [CI/CD Integration](./ci-cd.md) — Integrasi pipeline otomatis.
- [Pytest Integration](./pytest.md) — Integrasi pytest sebagai runner alternatif.
- [API Webhooks](../../api/webhooks.md) — Referensi webhook API.