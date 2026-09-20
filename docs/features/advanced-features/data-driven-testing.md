---
---

# Data-Driven Testing (DDT)

## Overview

Menjalankan satu test case **berulang kali** menggunakan dataset eksternal.

## Supported Formats

- **CSV**: Auto-detect delimiter, header, encoding
- **Excel (.xlsx)**: Support multiple sheets
- **JSON**: Array of objects
- **SQLite**: Query-based dataset

## Dataset Management

### Data Center Module
- Upload datasets (CSV, Excel, JSON, SQLite)
- Preview dataset
- Bind dataset to TestCase (many-to-one)
- Row limit 10,000 per file for memory protection

## Keyword DSL

### GUNAKAN DATA
```heim
GUNAKAN DATA "user_credentials" SEBAGAI "row"
Ketik "row.Email" pada kolom "Email"
Ketik "row.Password" pada kolom "Password"
Ketuk tombol "Login"
Pastikan muncul teks "Dashboard"
SELESAI GUNAKAN DATA
```

### ULANGI
```heim
ULANGI "row" DARI DATA "user_credentials"
Ketik "row.Username" pada kolom "Username"
Ketik "row.Password" pada kolom "Password"
Ketuk tombol "Submit"
SELESAI ULANGI
```

## Configuration

```json
{
  "dataDriven": {
    "maxRowsPerFile": 10000,
    "supportedFormats": ["csv", "xlsx", "json", "sqlite"],
    "defaultFormat": "csv",
    "autoDetectEncoding": true,
    "cache": {
      "enabled": true,
      "ttl": 3600 // seconds
    }
  }
}
```

## Troubleshooting

### Common Issues
- **File format not supported**: Check file extension
- **Memory exceeded**: Split large dataset
- **Encoding issues**: Set encoding explicitly

## Related

- [Headless CLI](/features/basic-features/headsless-cli)
- [Self-Healing](/features/advanced-features/self-healing)
- [Visual Regression](/features/advanced-features/visual-regression)