export interface TimelineFeature {
  title: string;
  description: string;
  icon?: string;
  subFeatures?: string[];
}

export interface TimelinePhase {
  phase: string;
  description: string;
  features: TimelineFeature[];
}

export const roadmapData: TimelinePhase[] = [
  {
    phase: "1. Bahasa & Otomasi Inti",
    description: "Fondasi pengujian menggunakan bahasa manusia yang dapat dipahami semua orang.",
    features: [
      {
        title: "Heimdall DSL (.heim Script Engine)",
        description: "Tulis skenario pengujian dengan Bahasa Indonesia yang mudah dipahami. Tanpa perlu belajar coding.",
        subFeatures: [
          "Mendukung variabel, loop, dan logika kondisional.",
          "Satu bahasa skrip untuk web dan mobile sekaligus."
        ]
      },
      {
        title: "Smart Inspector (Android & Web)",
        description: "Bedah elemen UI aplikasi secara real-time untuk mengekstrak selector (ID, XPath, CSS) dan koordinat secara otomatis."
      }
    ]
  },
  {
    phase: "2. Pengalaman Interaktif",
    description: "Sistem mirroring dan kontrol jarak jauh tanpa batas.",
    features: [
      {
        title: "Interactive Mirroring (Web & Android)",
        description: "Pantau halaman web via WebSocket dan Android via Scrcpy secara langsung dari dalam dashboard.",
        subFeatures: [
          "Klik, scroll, dan ketik langsung dari browser PC Anda ke device target."
        ]
      },
      {
        title: "Live Runner & Floating Preview",
        description: "Lihat langsung eksekusi berjalan baris demi baris, lengkap dengan preview melayang yang sinkron dengan aksi robot."
      }
    ]
  },
  {
    phase: "3. Manajemen & Produktivitas",
    description: "IDE profesional untuk mengatur semua kebutuhan QA Automation.",
    features: [
      {
        title: "Test Management System & IDE",
        description: "Hierarki test management terpadu lengkap dengan Script Editor multi-tab yang mendukung syntax highlighting."
      },
      {
        title: "Device Orchestration & AVD Provisioning",
        description: "Kelola device fisik dan Android Virtual Device (AVD) dari satu pintu tanpa konfigurasi CLI yang rumit."
      }
    ]
  },
  {
    phase: "4. Pelaporan & Analisis",
    description: "Ketahui apa yang terjadi dengan visualisasi pelaporan mendalam.",
    features: [
      {
        title: "Visual Test Reports & Command Center",
        description: "Dashboard sentral untuk melihat hasil tes visual, bukti screenshot, dan flow chart diagram secara interaktif."
      },
      {
        title: "Host Performance Monitor (Telemetry)",
        description: "Awasi beban CPU, RAM, dan penyimpanan selama robot mengeksekusi skenario untuk meminimalisir freeze atau crash."
      }
    ]
  },
  {
    phase: "5. Kemampuan Lanjutan",
    description: "Kecanggihan infrastruktur untuk skenario kompleks.",
    features: [
      {
        title: "Multi-Tab Web & Smart Isolation",
        description: "Uji perpindahan antar tab atau buka multi-context terisolasi untuk tes concurrency (misal: Chat app A dan B berbarengan)."
      }
    ]
  }
];