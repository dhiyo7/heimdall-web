---
---

# AI Test Generation

## Overview

Fitur AI untuk menghasilkan test case secara otomatis dari deskripsi natural language, memberikan saran langkah logis berikutnya, dan mendiagnosis error dengan analisis otomatis.

## Text-to-Script

### Input
Deskripsi natural language tentang skenario test yang diinginkan.

### Output
Skrip `.heim` yang siap dieksekusi.

### Contoh
```
Input: "Login then verify dashboard"

Output:
Buka aplikasi "com.example.app"
Ketuk tombol "Login"
Ketik "user@test.com" pada kolom "Email"
Ketik "password" pada kolom "Password"
Ketuk tombol "Masuk"
Pastikan muncul teks "Dashboard"
```

## Smart Suggestions

### Usage
Inspector memberikan saran langkah logis berikutnya berdasarkan elemen yang dipilih dan konteks test.

### Interface
```typescript
interface Suggestion {
  text: string;
  type: 'click' | 'type' | 'wait' | 'scroll' | 'assert' | 'go-back';
  element: InspectorElement;
  reasoning: string;
  confidence: number;
}
```

### Contoh Penggunaan
```heim
# Setelah memilih elemen tombol "Login"
# Smart Suggestion: Ketik username pada kolom berikutnya
Ketik "user@test.com" pada kolom "Username"

# Setelah memilih kolom input password
# Smart Suggestion: Ketik password
Ketik "password123" pada kolom "Password"

# Setelah memilih tombol submit
# Smart Suggestion: Verifikasi dashboard muncul
Pastikan muncul teks "Dashboard"
```

## Error Diagnosis

### Input
Test gagal + screenshot + logs

### Output
Saran perbaikan dengan confidence score

### Contoh Analisis
```
Test failed: "Login Gagal - Elemen 'Masuk' tidak ditemukan"

Analisis:
- Kemungkinan: Label tombol berubah dari 'Masuk' ke 'Login'
- Confidence: 95%
- Saran: Ganti 'Masuk' dengan 'Login' pada perintah Click
- Estimasi fix: 2 detik
```

## Provider Setup

### OpenAI
```json
{
  "ai": {
    "enabled": true,
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

### Google Gemini
```json
{
  "ai": {
    "enabled": true,
    "provider": "gemini",
    "apiKey": "AIza...",
    "model": "gemini-pro",
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

### Ollama (Lokal)
```json
{
  "ai": {
    "enabled": true,
    "provider": "ollama",
    "baseUrl": "http://localhost:11434",
    "model": "llama2",
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

## Configuration

```json
{
  "ai": {
    "enabled": true,
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 2000,
    "retryAttempts": 3,
    "timeoutMs": 30000,
    "fallbackToOllama": true
  }
}
```

## Best Practices

### Keamanan
- Simpan API key di environment variable, bukan di kode
- Gunakan Ollama untuk testing lokal tanpa koneksi internet
- Batasi akses API key hanya untuk test yang diperlukan

### Kualitas Output
- Berikan deskripsi test yang jelas dan spesifik
- Sertakan konteks aplikasi (package name, activity)
- Gunakan sampel data yang realistis

### Efisiensi
- Gunakan batch processing untuk generate banyak test
- Cache hasil generate untuk mengurangi panggilan API
- Monitor penggunaan token dan kuota

## Troubleshooting

### Common Issues
- **AI provider not responding**: Check API key and network
- **Low confidence suggestions**: Improve prompt engineering
- **Rate limiting**: Use local Ollama or increase retry delay
- **Incorrect test generation**: Provide more detailed description

## Related

- [English DSL](/features/ai-features/english-dsl)
- [Keyword DSL](/features/basic-features/keyword-DSL)
- [Self-Healing](/features/advanced-features/self-healing)