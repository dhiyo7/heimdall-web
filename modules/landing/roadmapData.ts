export interface RoadmapFeature {
  title: string;
  done: boolean;
  subFeatures?: string[];
}

export interface RoadmapPhase {
  phase: string;
  description: string;
  features: RoadmapFeature[];
}

export const roadmapData: RoadmapPhase[] = [
  {
    phase: "PHASE 1: THE FOUNDATION (Selesai)",
    description: "Pondasi fisik robot agar kuat, stabil, dan bisa melihat.",
    features: [
      {
        title: "Smart Driver: Auto-scroll, pencarian elemen pintar (ID/Teks/Desc), Virtual FAB (Koordinat).",
        done: true,
      },
      {
        title: "Stability Engine: Ghost Keyboard (Anti-looping Emulator), Auto-dismiss keyboard.",
        done: true,
      },
      {
        title: "Basic Reporting: Saga Report (.docx) format Slide Presentation.",
        done: true,
      },
      {
        title: "Logging: API Sniffer (Capture Status Code 200 OK vs 500 Error).",
        done: true,
      },
    ],
  },
  {
    phase: "PHASE 2: THE BRAIN (Selesai) 🧠",
    description: "Menanamkan kecerdasan buatan agar robot bisa berpikir logis.",
    features: [
      {
        title: "Global Memory: SIMPAN teks ... KE {Var} (Menyimpan data antar langkah/file).",
        done: true,
      },
      {
        title: "Conditional Logic: JIKA ... AKHIR JIKA (Handling pop-up, error sync).",
        done: true,
      },
      {
        title: "Looping: ULANGI ... DARI [...] (Input data massal/berulang).",
        done: true,
      },
      {
        title: "Modular Architecture: JALANKAN \"file.heim\" (Re-use script login/setup).",
        done: true,
      },
      {
        title: 'System Keys: TEKAN TOMBOL SISTEM "Back" (Navigasi fisik Android).',
        done: true,
      },
    ],
  },
  {
    phase: "PHASE 3: VISUAL INTELLIGENCE (Selesai) 🧜‍♀️",
    description: "Mengubah log teknis menjadi diagram bisnis yang cantik.",
    features: [
      {
        title: "Mermaid Engine: Migrasi dari Graphviz ke Mermaid JS (Modern Standard).",
        done: true,
      },
      {
        title: "Smart Mapping: Menggambar simbol Diamond ♦ (Logika) dan Loop 🔄 otomatis.",
        done: true,
      },
      {
        title: 'Modern Styling: Tema visual "Wide & Dynamic" dengan pewarnaan Cluster otomatis.',
        done: true,
      },
      {
        title: "Rendering: Generate file flowchart.png otomatis via API mermaid.ink.",
        done: true,
      },
    ],
  },
  {
    phase: "PHASE 4: THE PLATFORM REVOLUTION (Next Target) 🖥️",
    description: 'Mengubah tool "Hacker Terminal" menjadi Aplikasi Web Modern.',
    features: [
      {
        title: "Heimdall Web Center (Streamlit):",
        subFeatures: [
          "Dashboard GUI: Tidak perlu lagi ketik di layar hitam. Cukup klik tombol di browser.",
          "Scenario Selector: Dropdown menu untuk memilih file .heim.",
          "Device Manager: Auto-detect HP yang tercolok.",
          "Live Execution Viewer: Melihat log perjalanan robot secara real-time.",
        ],
        done: false,
      },
    ],
  },
  {
    phase: "PHASE 5: ENTERPRISE SCALE (Masa Depan) 🚀",
    description: "Fitur skala besar untuk kebutuhan korporat.",
    features: [
      {
        title: "Cross-Platform Installer: Mengemas jadi .exe (Windows) atau .dmg (Mac).",
        done: false,
      },
      {
        title: "Parallel Execution (Kage Bunshin): Menjalankan 1 script di 3 HP berbeda secara serentak.",
        done: false,
      },
      {
        title: "RTM Integration: Mapping ID Tiket Jira di header report otomatis.",
        done: false,
      },
      {
        title: "Notification Bot: Kirim notifikasi \"Tes Selesai\" ke Slack/Telegram.",
        done: false,
      },
      {
        title: 'Record & Replay: Bikin script otomatis dengan merekam klik mouse ("The Ghostwriter").',
        done: false,
      },
    ],
  },
];