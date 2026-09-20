---
---

# English DSL Mode

## Overview

Penulisan skrip dalam **Bahasa Inggris** selain Bahasa Indonesia. Kedua mode menghasilkan command dict yang identik secara internal.

## Syntax Examples

### Indonesian
```heim
# Indonesian
Ketuk tombol "Login"
Ketik "user@test.com" pada kolom "Email"
Pastikan muncul teks "Dashboard"
```

### English
```english
# English
Click "Login"
Type "user@test.com" on field "Email"
ASSERT "Dashboard"
```

## Keyword Mapping

| Indonesian | English | Parameter |
|------------|---------|-----------|
| `Buka` | `Open` | Package Name |
| `Ketuk` | `Click` | "Text Button" |
| `Ketik` | `Type` | "Text" on "Field" |
| `Ketik URUTAN` | `Type` | "Text" on "sequence X" |
| `Ketuk FAB` | `Click FAB` | "FAB" |
| `Tunggu` | `Wait` | "Text Indicator" |
| `Pastikan` | `ASSERT` | "Validation Text" |
| `Gulir` | `Scroll` | "Down"/"Up" |

## Migration Guide

### From Indonesian to English
```heim
# Before (Indonesian)
Buka aplikasi "com.example.app"
Ketuk tombol "Login"
Ketik "user@test.com" pada kolom "Email"
Ketik "password" pada kolom "Password"
Ketuk tombol "Masuk"
Pastikan muncul teks "Dashboard"

# After (English)
Open "com.example.app"
Click "Login"
Type "user@test.com" on "Email"
Type "password" on "Password"
Click "Submit"
ASSERT "Dashboard"
```

## Configuration

```json
{
  "language": {
    "default": "indonesian", // or "english"
    "autoDetect": true
  }
}
```

## Troubleshooting

### Common Issues
- **Syntax error**: Check keyword spelling (case-sensitive)
- **Migration issues**: Ensure all keywords converted properly
- **Mixed mode**: Avoid mixing Indonesian and English in same script

## Related

- [Keyword DSL](/features/basic-features/keyword-DSL)
- [AI Test Generation](/features/ai-features/test-generation)
- [Self-Healing](/features/advanced-features/self-healing)