# Contributing Guide

Panduan lengkap untuk berkontribusi ke proyek Heimdall. Ikuti prosedur ini untuk memastikan kontribusi Anda dapat diterima dengan lancar.

## 1. Development Setup

### 1.1 Clone Repository

```bash
git clone https://github.com/dhiyo7/heimdall.git
cd heimdall
```

### 1.2 Install Dependencies

```bash
# Install frontend dependencies
cd heimdall-web
npm install

# Install Python dependencies (untuk CLI automation)
cd ..
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# .\venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

### 1.3 Setup Environment Variables

Copy template environment file dan isi nilai yang diperlukan:

```bash
cp .env.example .env
# Edit .env dengan nilai yang sesuai

# Wajib diisi:
VITE_API_BASE_URL=http://localhost:3000
VITE_AI_PROVIDER=ollama  # atau openai/gemini
OPENAI_API_KEY=sk-...  # jika menggunakan OpenAI
```

### 1.4 Jalankan Development Server

```bash
# Jalankan VitePress documentation dev server
cd heimdall-web
npm run docs:dev

# Atau jalankan aplikasi utama
npm run dev
```

Aplikasi akan tersedia di `http://localhost:5173` (Vite default) atau `http://localhost:3000` (development server).

### 1.5 Setup Device Android (Opsional tapi Disarankan)

Jika berkontribusi pada fitur automation:

```bash
# Pastikan device terhubung
adb devices

# Inisialisasi uiautomator2
python -m uiautomator2 init
```

### 1.6 Code Structure Overview

Lihat struktur proyek di [STRUCTURE-DOKUMENTASI-HEIMDALL.md](./SPEC/STRUCTURE-DOKUMENTASI-HEIMDALL.md).

Struktur utama:
- `src/components/` - Komponen UI yang dapat dipakai ulang
- `src/modules/` - Modul layout & halaman
- `src/pages/` - Halaman dengan route spesifik
- `docs/` - Dokumentasi VitePress
- `SPEC/` - Spesifikasi dan rencana fitur

---

## 2. Code Standards

### 2.1 TypeScript Standards

Semua kode baru harus menggunakan TypeScript dengan aturan berikut:

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Hindari
// Type declarations yang tidak perlu
```

### 2.2 Code Style (ESLint + Prettier)

- Gunakan `npm run lint` untuk memeriksa kode
- Gunakan `npm run format` untuk menformat kode secara otomatis
- Follow Airbnb JavaScript Style Guide (disesuaikan dengan konfigurasi project)

### 2.3 Component Standards

#### Component Naming

- **Component**: PascalCase (e.g., `WindowCard.tsx`, `ThemeToggle.tsx`)
- **File**: kebab-case atau PascalCase (sesuai konvensi)
- **CSS Class**: camelCase dengan prefix jika perlu

#### Component Structure

```typescript
// ✅ Good structure
import React from 'react';
import { WindowCard } from '../ui/WindowCard';

export const MyComponent: React.FC = () => {
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

// ✅ Add JSDoc untuk props
/**
 * Component untuk menampilkan kartu dengan header.
 * @param title - Judul kartu
 * @param children - Konten di dalam kartu
 */
export const WindowCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="bg-white shadow-retro-lg">
      <div className="p-4 border-b border-black">
        <h2 className="font-bold text-lg">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};
```

### 2.4 Documentation Standards

#### Markdown Format

- Gunakan heading level yang benar (`#`, `##`, `###`)
- Gunakan code block untuk contoh kode (```heim, ```javascript, dll)
- Gunakan tabel untuk daftar fitur
- Tambahkan deskripsi yang jelas dan komprehensif

#### Example Format

```markdown
### Example: Login Test

```heim
# Fitur: Login Berhasil
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"
Ketik "user@test.com" pada kolom "Email"
Ketik "password123" pada kolom "Password"
Ketuk tombol "Login"
Pastikan muncul teks "Dashboard"
```
```

### 2.5 Commit Message Format

Rubah pesan commit sesuai konvensi:

```bash
# ✅ Good commit messages
git commit -m "feat: add login test case support"
git commit -m "fix: resolve element not found issue"
git commit -m "docs: update installation guide"
git commit -m "refactor: restructure test execution flow"
git commit -m "chore: update dependencies"

# ❌ Hindari
git commit -m "update"
git commit -m "fixed thing"
```

Konvensi commit message:
- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `docs`: Perubahan dokumentasi
- `refactor`: Refactor kode (tidak mengubah fitur)
- `chore`: Pekerjaan rutin (update dependencies, dll)

---

## 3. Pull Request Process

### 3.1 Branch Naming

Gunakan nama branch yang deskriptif:

```bash
# ✅ Good branch names
git checkout -b feature/login-test
git checkout -b fix/adb-device-not-detected
git checkout -b docs/installation-guide-update
git checkout -b refactor/component-structure

# ❌ Hindari
git checkout -b master
git checkout -b fix-1
```

### 3.2 Fork & Clone Workflow

```bash
# 1. Fork repository di GitHub
# 2. Clone repository Anda
git clone https://github.com/your-username/heimdall.git
cd heimdall

# 3. Tambahkan remote upstream
git remote add upstream https://github.com/dhiyo7/heimdall.git

# 4. Buat branch baru untuk fitur/fix
git checkout -b feature/nama-fitur

# 5. Lakukan perubahan kode
# ... edit files ...

# 6. Commit perubahan
git add .
git commit -m "feat: deskripsi fitur"

# 7. Push ke branch Anda
git push origin feature/nama-fitur

# 8. Buat Pull Request ke repository utama
# Buka https://github.com/dhiyo7/heimdall/pulls
# Buat PR dari branch feature/nama-fitur ke main
```

### 3.3 Pull Request Checklist

Sebelum mengirim PR, pastikan checklist berikut telah terpenuhi:

#### ✅ Kode

- [ ] Kode sesuai dengan standard TypeScript
- [ ] `npm run lint` lulus tanpa error
- [ ] `npm run format` diterapkan
- [ ] Semua test case passing
- [ ] Code review sendiri (self-review)

#### ✅ Dokumentasi

- [ ] File dokumentasi diperbarui (jika menambah fitur baru)
- [ ] Contoh kode dalam dokumentasi bekerja
- [ ] Heading dan struktur markdown benar
- [ ] Termasuk pada kategori yang tepat (installation, quick-start, dll)

#### ✅ Testing

- [ ] Test manual di device Android (jika relevan)
- [ ] Test CLI commands bekerja (`heimdall run`, `heimdall --help`)
- [ ] Test tidak memecah fitur yang sudah ada (regression test)

#### ✅ Review Request

- [ ] Menambahkan reviewer yang sesuai
- [ ] Label PR dengan kategori yang tepat (feature, bug, docs, refactor)
- [ ] Menambahkan deskripsi PR yang lengkap

### 3.4 PR Description Template

Setiap PR harus mengikuti template berikut:

```markdown
## Description
[Deskripsi perubahan yang dilakukan]

## Type
- [ ] Feature
- [ ] Bug Fix
- [ ] Documentation
- [ ] Refactor
- [ ] Chore

## Related Issues
- Tutup issue: #issue-number

## Testing
- [ ] Test manual di device
- [ ] Test CLI commands
- [ ] Test tidak memecah fitur lain

## Screenshots (jika applicable)
![Description](screenshot-url)

## Checklist
- [ ] Kode sesuai standard
- [ ] Dokumentasi terupdate
- [ ] Test passing
```

### 3.5 Review Process

Alur review PR di Heimdall:

1. **Submission**: PR diajukan dengan deskripsi lengkap
2. **Automated Check**: CI menjalankan lint, build, dan test otomatis
3. **Code Review**: Maintainer mereview kode (biasanya 1-3 hari kerja)
4. **Revision**: Jika ada feedback, lakukan perubahan dan push kembali
5. **Approval**: Setelah disetujui, PR di-merge oleh maintainer

**Tips agar review cepat:**
- Buat PR kecil dan fokus (satu fitur/fix per PR)
- Jelaskan *mengapa* perubahan dibuat, bukan hanya *apa* yang berubah
- Respons feedback review dengan cepat

---

## 4. Issue Reporting

### 4.1 Sebelum Membuat Issue

Sebelum membuat issue baru, pastikan:

- [ ] Telah mencari di [existing issues](https://github.com/dhiyo7/heimdall/issues) (hindari duplikat)
- [ ] Telah membaca [Troubleshooting](../troubleshooting/common-issues.md)
- [ ] Menggunakan versi Heimdall terbaru
- [ ] Masalah dapat direproduksi secara konsisten

### 4.2 Bug Report Template

Gunakan template berikut saat melaporkan bug:

```markdown
## Bug Description
[Deskripsi jelas dan ringkas tentang bug]

## Steps to Reproduce
1. Buka aplikasi '...'
2. Jalankan perintah '...'
3. Lihat error pada '...'

## Expected Behavior
[Apa yang seharusnya terjadi]

## Actual Behavior
[Apa yang benar-benar terjadi]

## Environment
- OS: [e.g., Ubuntu 22.04, macOS 14, Windows 11]
- Python Version: [e.g., 3.10.12]
- Heimdall Version: [e.g., 1.2.0]
- Device/Emulator: [e.g., Redmi Note 10, Pixel 4 Emulator]

## Logs/Screenshots
[Tambahkan log error atau screenshot jika ada]
```

### 4.3 Feature Request Template

Untuk mengusulkan fitur baru:

```markdown
## Feature Description
[Deskripsi fitur yang diinginkan]

## Problem Statement
[Masalah apa yang diselesaikan oleh fitur ini]

## Proposed Solution
[Bagaimana fitur ini seharusnya bekerja]

## Alternatives Considered
[Solusi alternatif yang telah dipertimbangkan]

## Additional Context
[Konteks tambahan, mockup, atau referensi]
```

### 4.4 Label Issue

| Label | Kegunaan |
|-------|----------|
| `bug` | Laporan bug |
| `enhancement` | Permintaan fitur baru |
| `documentation` | Perbaikan dokumentasi |
| `good first issue` | Cocok untuk kontributor pertama kali |
| `help wanted` | Butuh bantuan komunitas |
| `wontfix` | Tidak akan diperbaiki |

---

## 5. Community Guidelines

### 5.1 Code of Conduct

- Bersikap hormat dan profesional kepada semua kontributor
- Gunakan bahasa yang inklusif dan ramah
- Terima kritik konstruktif dengan terbuka
- Fokus pada apa yang terbaik untuk komunitas dan proyek

### 5.2 Komunikasi

- **GitHub Issues**: Untuk bug report dan feature request
- **Pull Requests**: Untuk diskusi kode
- **Email**: Untuk pertanyaan privat atau security issue

### 5.3 Recognition

Kontributor akan diakui melalui:
- Pencatatan di file kontributor proyek
- Mention di release notes untuk kontribusi signifikan
- Badge kontributor di komunitas

---

## 6. Quick Reference

### Perintah yang Sering Digunakan

```bash
# Development
npm run dev          # Jalankan aplikasi utama
npm run docs:dev     # Jalankan dokumentasi VitePress
npm run lint         # Periksa kode
npm run format       # Format kode otomatis
npm run build        # Build production

# Testing
heimdall run <file>.heim           # Jalankan test
heimdall devices                   # List device terhubung
heimdall health                    # Health check sistem
python -m uiautomator2 init        # Inisialisasi device
```

---

## Pertanyaan?

Jika ada pertanyaan seputar kontribusi:

1. Buka [GitHub Issues](https://github.com/dhiyo7/heimdall/issues)
2. Baca dokumentasi [Architecture](./architecture.md) untuk memahami kode
3. Lihat [Installation Guide](./installation.md) untuk setup environment

Terima kasih telah berkontribusi pada Heimdall! 🎉