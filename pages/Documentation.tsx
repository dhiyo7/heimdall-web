import React, { useState } from 'react';
import { WindowCard } from '../components/ui/WindowCard';
import { Terminal, BookOpen, Code, AlertTriangle, FileText } from 'lucide-react';

export const Documentation: React.FC = () => {
    const [activeSection, setActiveSection] = useState('intro');

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="min-h-screen bg-retro-bg py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* SIDE-BY-SIDE LAYOUT: 1/3 Sidebar + 2/3 Content */}
                <div className="flex flex-row gap-8">

                    {/* Sidebar Navigation - LEFT (1/3) - STICKY */}
                    <aside className="w-1/3">
                        <div className="sticky top-20 space-y-6">
                            <WindowCard title="nav.map" className="bg-white shadow-retro-lg">
                                <nav className="flex flex-col space-y-1 font-mono text-sm">
                                    {[
                                        { id: 'intro', label: 'Pengenalan', icon: BookOpen },
                                        { id: 'install', label: 'Instalasi', icon: Terminal },
                                        { id: 'syntax', label: 'Syntax & Perintah', icon: Code },
                                        { id: 'structure', label: 'Struktur Script', icon: FileText },
                                        { id: 'troubleshoot', label: 'Troubleshooting', icon: AlertTriangle },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`flex items-center gap-3 px-3 py-2 text-left transition-all border-l-4 ${activeSection === item.id
                                                ? 'border-black bg-gray-100 font-bold'
                                                : 'border-transparent hover:bg-gray-50 hover:border-gray-300'
                                                }`}
                                        >
                                            <item.icon size={16} />
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>
                            </WindowCard>

                            <div className="bg-yellow-100 border-2 border-black p-4 shadow-retro-sm">
                                <p className="font-mono text-xs font-bold mb-2">💡 BUTUH BANTUAN?</p>
                                <p className="font-sans text-sm text-gray-700 mb-3">
                                    Jika menemukan bug atau syntax error yang tidak terduga, segera lapor ke GitHub.
                                </p>
                                <a
                                    href="https://github.com/dhiyo7/heimdall/issues"
                                    target="_blank"
                                    className="block text-center bg-black text-white text-xs font-bold py-2 hover:bg-gray-800 transition-colors"
                                >
                                    BUKA ISSUE
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content - RIGHT (2/3) - SCROLLABLE */}
                    <main className="w-2/3 min-w-0 pb-32">

                        {/* ===== SECTION 1: PENGENALAN ===== */}
                        <section id="intro" className="scroll-mt-24">
                            <h1 className="font-sans font-black text-4xl mb-8">Dokumentasi Lengkap</h1>
                            <div className="mb-12">
                                <WindowCard title="readme.txt" className="shadow-retro-lg">
                                    <div className="prose max-w-none font-mono text-sm leading-relaxed">
                                        <p className="mb-4">
                                            <strong>Heimdall</strong> adalah framework automation testing berbasis keyword (Keyword Driven Testing) yang dirancang khusus untuk QA Engineer yang ingin menghindari kerumitan koding driver manual.
                                        </p>
                                        <p>
                                            Filosofi utamanya adalah <em>"Write like a human, test like a robot"</em>. Anda menulis skenario dalam Bahasa Indonesia yang mudah dipahami oleh Project Manager sekalipun, dan Heimdall menerjemahkannya menjadi aksi Android via <code>uiautomator2</code>.
                                        </p>
                                    </div>
                                </WindowCard>
                            </div>
                        </section>

                        {/* ===== SECTION 2: INSTALASI ===== */}
                        <section id="install" className="scroll-mt-24 mt-32">
                            <h2 className="font-sans font-black text-3xl mb-8 flex items-center gap-3">
                                <Terminal className="border-2 border-black p-1 rounded bg-white shadow-retro-sm" size={32} />
                                Persiapan Perang (Instalasi)
                            </h2>

                            <div className="mb-12">
                                <WindowCard title="setup_guide.sh" date="STEP-BY-STEP" className="bg-white shadow-retro-lg">
                                    <div className="space-y-8 font-mono text-sm">

                                        <div>
                                            <h3 className="font-bold text-lg mb-3 bg-black text-white inline-block px-2">1. Prasyarat Sistem</h3>
                                            <ul className="list-disc space-y-2 mt-4 pl-16">
                                                <li>Python 3.10 atau lebih baru.</li>
                                                <li>ADB (Android Debug Bridge) terinstall dan terdaftar di PATH.</li>
                                                <li>
                                                    <strong>Graphviz</strong> (Wajib untuk Mindmap).
                                                    <br /><span className="text-gray-500 text-xs">Windows: Centang "Add to PATH" saat install. Mac: `brew install graphviz`.</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg mb-3 bg-black text-white inline-block px-2">2. Install Library</h3>
                                            <div className="bg-gray-900 text-green-400 p-4 rounded border-2 border-black shadow-retro-sm mt-4">
                                                <code>pip install -r requirements.txt</code>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg mb-3 bg-black text-white inline-block px-2">3. Inisialisasi HP</h3>
                                            <p className="mb-3">Sambungkan HP Android, nyalakan USB Debugging, lalu jalankan:</p>
                                            <div className="bg-gray-900 text-green-400 p-4 rounded border-2 border-black shadow-retro-sm">
                                                <code>python -m uiautomator2 init</code>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-4">*Izinkan instalasi aplikasi ATX di layar HP Anda.</p>
                                        </div>

                                    </div>
                                </WindowCard>
                            </div>
                        </section>

                        {/* ===== SECTION 3: SYNTAX ===== */}
                        <section id="syntax" className="scroll-mt-24 mt-32">
                            <h2 className="font-sans font-black text-3xl mb-8 flex items-center gap-3">
                                <Code className="border-2 border-black p-1 rounded bg-white shadow-retro-sm" size={32} />
                                Kamus Syntax (Cheatsheet)
                            </h2>

                            <p className="mb-6 font-mono text-sm text-gray-600">
                                Gunakan perintah berikut dalam file <code>.heim</code> Anda. Besar kecil huruf tidak berpengaruh (Case Insensitive).
                            </p>

                            <div className="overflow-x-auto border-2 border-black shadow-retro mb-12">
                                <table className="w-full text-left font-mono text-sm bg-white">
                                    <thead className="bg-black text-white">
                                        <tr>
                                            <th className="p-4 border-r border-gray-700">Keyword</th>
                                            <th className="p-4 border-r border-gray-700">Parameter</th>
                                            <th className="p-4">Fungsi & Contoh</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black">
                                        {/* Buka */}
                                        <tr className="hover:bg-gray-50">
                                            <td className="p-4 font-bold text-blue-600 align-top">Buka</td>
                                            <td className="p-4 align-top">Package Name</td>
                                            <td className="p-4">
                                                Membuka aplikasi target.
                                                <div className="mt-2 bg-gray-100 p-2 text-xs border border-gray-300 rounded">
                                                    Buka aplikasi "com.gojek.app"
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Ketik Label */}
                                        <tr className="hover:bg-gray-50">
                                            <td className="p-4 font-bold text-purple-600 align-top">Ketik</td>
                                            <td className="p-4 align-top">"Teks" pada "Label"</td>
                                            <td className="p-4">
                                                Mengisi form input yang memiliki label/placeholder tertentu.
                                                <div className="mt-2 bg-gray-100 p-2 text-xs border border-gray-300 rounded">
                                                    Ketik "user123" pada kolom "Username"
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Ketik Urutan */}
                                        <tr className="hover:bg-yellow-50">
                                            <td className="p-4 font-bold text-purple-600 align-top">Ketik <span className="text-[10px] bg-black text-white px-1">URUTAN</span></td>
                                            <td className="p-4 align-top">"Teks" pada "urutan X"</td>
                                            <td className="p-4">
                                                <strong>Jurus Sakti!</strong> Mengisi form berdasarkan urutan index (mulai dari 1) jika label tidak terdeteksi.
                                                <div className="mt-2 bg-gray-100 p-2 text-xs border border-gray-300 rounded">
                                                    Ketik "rahasia" pada kolom "urutan 2"
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Ketuk */}
                                        <tr className="hover:bg-gray-50">
                                            <td className="p-4 font-bold text-green-600 align-top">Ketuk</td>
                                            <td className="p-4 align-top">"Teks Tombol"</td>
                                            <td className="p-4">
                                                Menekan tombol/elemen yang berisi teks tersebut.
                                                <div className="mt-2 bg-gray-100 p-2 text-xs border border-gray-300 rounded">
                                                    Ketuk tombol "Login"
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Ketuk FAB */}
                                        <tr className="hover:bg-yellow-50">
                                            <td className="p-4 font-bold text-green-600 align-top">Ketuk <span className="text-[10px] bg-black text-white px-1">FAB</span></td>
                                            <td className="p-4 align-top">tombol "FAB"</td>
                                            <td className="p-4">
                                                Menekan area Floating Action Button (Pojok Kanan Bawah) menggunakan koordinat relatif.
                                                <div className="mt-2 bg-gray-100 p-2 text-xs border border-gray-300 rounded">
                                                    Ketuk tombol "FAB"
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Tunggu */}
                                        <tr className="hover:bg-gray-50">
                                            <td className="p-4 font-bold text-orange-600 align-top">Tunggu</td>
                                            <td className="p-4 align-top">"Teks Indikator"</td>
                                            <td className="p-4">
                                                Pause script sampai teks tertentu muncul di layar (Handling Loading).
                                                <div className="mt-2 bg-gray-100 p-2 text-xs border border-gray-300 rounded">
                                                    Tunggu sampai muncul teks "Selamat Datang"
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Pastikan */}
                                        <tr className="hover:bg-gray-50">
                                            <td className="p-4 font-bold text-red-600 align-top">Pastikan</td>
                                            <td className="p-4 align-top">"Teks Validasi"</td>
                                            <td className="p-4">
                                                Assertion. Test akan GAGAL (Merah) jika teks ini tidak ditemukan.
                                                <div className="mt-2 bg-gray-100 p-2 text-xs border border-gray-300 rounded">
                                                    Pastikan muncul teks "Transaksi Berhasil"
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Gulir */}
                                        <tr className="hover:bg-gray-50">
                                            <td className="p-4 font-bold text-gray-600 align-top">Gulir</td>
                                            <td className="p-4 align-top">"Bawah" / "Atas"</td>
                                            <td className="p-4">
                                                Scroll layar secara manual.
                                                <div className="mt-2 bg-gray-100 p-2 text-xs border border-gray-300 rounded">
                                                    Gulir ke "Bawah"
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* ===== SECTION 4: STRUKTUR SCRIPT ===== */}
                        <section id="structure" className="scroll-mt-24">
                            <h2 className="font-sans font-black text-3xl mb-6 flex items-center gap-3">
                                <FileText className="border-2 border-black p-1 rounded bg-white shadow-retro-sm" size={32} />
                                Struktur Script (.heim)
                            </h2>

                            <WindowCard title="contoh_skenario.heim" date="CODE" className="bg-dots shadow-retro-lg mb-12">
                                <div className="space-y-4">
                                    <p className="font-mono text-sm">Gunakan tag <code className="bg-black text-white px-1"># FITUR: Nama</code> untuk mengelompokkan langkah-langkah di Mindmap agar tidak berantakan.</p>

                                    <div className="bg-white p-6 rounded border-2 border-black shadow-retro relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-2 opacity-50 font-mono text-xs text-white">.heim</div>
                                        <pre className="font-mono text-sm text-gray-300 overflow-x-auto">
                                            {`# Ini adalah komentar (tidak dieksekusi)
# Judul: Login Skenario Positif

# FITUR: Buka Aplikasi
Buka aplikasi "com.example.app"
Tunggu sampai muncul teks "Sign In"

# FITUR: Input Data
Ketik "user@test.com" pada kolom "Email"
Ketik "123456" pada kolom "Password"
Ketuk tombol "Masuk"

# FITUR: Validasi Dashboard
# Kita tunggu loading selesai
Tunggu sampai muncul teks "Halo User"
Pastikan muncul teks "Saldo Anda"`}
                                        </pre>
                                    </div>
                                </div>
                            </WindowCard>
                        </section>

                        {/* ===== SECTION 5: TROUBLESHOOTING ===== */}
                        <section id="troubleshoot" className="scroll-mt-24">
                            <h2 className="font-sans font-black text-3xl mb-6 flex items-center gap-3">
                                <AlertTriangle className="border-2 border-black p-1 rounded bg-white shadow-retro-sm" size={32} />
                                Masalah Umum (Troubleshooting)
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border-2 border-black p-6 bg-red-100 shadow-retro">
                                    <h3 className="font-bold text-lg text-red-500 mb-2">Keyboard Tidak Muncul?</h3>
                                    <p className="font-mono text-sm text-gray-700 mb-4">
                                        Heimdall menggunakan "Ghost Keyboard" (FastInputIME) untuk input cepat. Efek sampingnya, keyboard bawaan HP disembunyikan.
                                    </p>
                                    <div className="bg-white border border-red-200 p-3 rounded text-xs font-mono">
                                        <strong>Solusi:</strong> Jalankan script dummy sekali lagi sampai finish, atau matikan via ADB:
                                        <br />
                                        <code>adb shell settings put secure default_input_method ...</code>
                                    </div>
                                </div>

                                <div className="border-2 border-black p-6 bg-blue-50 shadow-retro">
                                    <h3 className="font-bold text-lg text-blue-600 mb-2">Element Tidak Ketemu?</h3>
                                    <p className="font-mono text-sm text-gray-700 mb-4">
                                        Kadang label di UI Android berbeda dengan teks yang terlihat (misal: ImageView tanpa content-desc).
                                    </p>
                                    <div className="bg-white border border-blue-200 p-3 rounded text-xs font-mono">
                                        <strong>Solusi:</strong> Gunakan perintah <code className="bg-blue-100 px-1">urutan 1</code>, <code className="bg-blue-100 px-1">urutan 2</code> dst. untuk menembak kolom input berdasarkan posisinya di layar.
                                    </div>
                                </div>
                            </div>

                        </section>

                    </main>
                </div>
            </div>
        </section>
    );
};