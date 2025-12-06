import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';
import { FilePenLine, AlertTriangle } from 'lucide-react';

export const DocumentationSection: React.FC = () => {
  return (
    <section id="docs" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-sans font-black text-4xl md:text-5xl mb-4">Dokumentasi</h2>
          <p className="font-mono text-lg md:text-xl text-gray-600">Panduan lengkap, Syntax, dan Cara Eksekusi.</p>
          <a href="#" className="inline-flex items-center gap-2 font-mono text-sm font-bold underline hover:bg-black hover:text-white transition-colors p-1 mt-2">
            <span>Baca README.md Asli</span>
            <FilePenLine size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <WindowCard
            title="MANUAL - SYNTAX_CHEAT_SHEET.HEIM"
            className="shadow-retro-lg"
            contentClassName="bg-dots"
          >
            <div className="bg-white border-2 border-black mb-6 p-4">
              <h3 className="font-bold text-lg border-b-2 border-black py-2 px-4 bg-yellow-100 -mx-4 mb-4">Perintah Dasar</h3>
              <ul className="space-y-4 font-mono text-xs md:text-sm">
                <li className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start border-b border-gray-100 pb-3 last:border-0">
                  <span className="font-bold text-blue-600 w-24 shrink-0 bg-blue-50 px-1 rounded">Buka</span>
                  <span>Buka aplikasi "com.package"</span>
                </li>
                <li className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start border-b border-gray-100 pb-3 last:border-0">
                  <span className="font-bold text-purple-600 w-24 shrink-0 bg-purple-50 px-1 rounded">Ketik</span>
                  <div className="flex-1">
                    <p className="mb-1">Ketik "text" pada kolom "Label"</p>
                    <p className="text-gray-500 italic text-[10px] mb-1">-- atau --</p>
                    <p>Ketik "text" pada kolom "urutan 1" <span className="bg-yellow-200 px-1 text-[10px] uppercase font-bold border border-yellow-400 rounded">Jurus Sakti</span></p>
                  </div>
                </li>
                <li className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start border-b border-gray-100 pb-3 last:border-0">
                  <span className="font-bold text-green-600 w-24 shrink-0 bg-green-50 px-1 rounded">Ketuk</span>
                  <div className="flex-1">
                    <p className="mb-1">Ketuk tombol "Masuk"</p>
                    <p className="text-gray-500 italic text-[10px] mb-1">-- atau --</p>
                    <p>Ketuk tombol "FAB" <span className="bg-yellow-200 px-1 text-[10px] uppercase font-bold border border-yellow-400 rounded">Smart Coord</span></p>
                  </div>
                </li>
                <li className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start border-b border-gray-100 pb-3 last:border-0">
                  <span className="font-bold text-orange-600 w-24 shrink-0 bg-orange-50 px-1 rounded">Pastikan</span>
                  <span>Pastikan muncul teks "Home"</span>
                </li>
                <li className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
                  <span className="font-bold text-gray-600 w-24 shrink-0 bg-gray-100 px-1 rounded">Gulir</span>
                  <span>Gulir ke "Bawah"</span>
                </li>
              </ul>
            </div>

            <div className="font-mono text-xs text-gray-600 bg-yellow-50/80 p-3 border border-yellow-400/30 rounded">
              <p className="mb-0"><strong>💡 Pro Tips:</strong> Gunakan tag <code className="bg-black text-white px-1 mx-1"># FITUR: NamaFitur</code> dalam script untuk mengelompokkan Mindmap agar visualisasi lebih rapi.</p>
            </div>
          </WindowCard>

          <div className="flex flex-col gap-8">
            <WindowCard title="RUN - TERMINAL.EXE" className="shadow-retro-lg">
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-xs mb-2"># 1. Install Dependencies</p>
                  <div className="bg-black text-white p-3 font-mono text-sm">
                    <span className="text-green-400">&gt;</span> pip install -r requirements.txt
                  </div>
                </div>
                <div>
                  <p className="font-mono text-xs mb-2"># 2. Jalankan Skenario</p>
                  <div className="bg-black text-white p-3 font-mono text-sm">
                    <span className="text-green-400">&gt;</span> python main.py scenarios/login.heim
                  </div>
                </div>
                <div className="border-t border-dashed border-gray-400 my-4"></div>
                <div>
                  <p className="font-mono text-xs font-bold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" />SYARAT WAJIB:</p>
                  <ul className="font-mono text-xs list-none pl-4 space-y-1">
                    <li><span className="text-yellow-500 mr-2">•</span>Python 3.10+</li>
                    <li><span className="text-yellow-500 mr-2">•</span>Graphviz (Add to PATH)</li>
                    <li><span className="text-yellow-500 mr-2">•</span>HP Android (USB Debugging ON)</li>
                  </ul>
                </div>
              </div>
            </WindowCard>

            <WindowCard title="DEBUG - TROUBLESHOOTING.LOG" className="shadow-retro-lg">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-100 border border-red-300 text-red-500 flex items-center justify-center font-bold text-lg flex-shrink-0">!</div>
                  <div>
                    <h4 className="font-bold font-mono text-sm text-red-500">KEYBOARD HILANG?</h4>
                    <p className="font-mono text-xs">Ini efek samping "Ghost Keyboard".<br />Solusi: Jalankan script dummy sampai selesai, atau matikan FastInputIME manual via ADB.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 border border-blue-300 text-blue-500 flex items-center justify-center font-bold text-lg flex-shrink-0">?</div>
                  <div>
                    <h4 className="font-bold font-mono text-sm text-blue-500">TOMBOL TANPA ID?</h4>
                    <p className="font-mono text-xs">Gunakan perintah <code>Ketuk tombol "FAB"</code>. Driver otomatis menembak koordinat (X-85%, Y-80%) untuk tombol melayang.</p>
                  </div>
                </div>
              </div>
            </WindowCard>
          </div>
        </div>
      </div>
    </section>
  );
};