

export const languageFeatures = [
  {
    title: "Sintaks Bahasa Manusia",
    description: "Perintah ditulis dalam format yang mudah dibaca dan dimengerti.",
    script: [
      '# Skenario Login',
      'Buka aplikasi "com.app"',
      'Ketik "user" pada "Email"',
      'Ketuk tombol "Masuk"',
      'Pastikan muncul "Home"'
    ]
  },
  {
    title: "Global Memory",
    description: "Menyimpan data (teks) antar langkah atau bahkan antar file skenario.",
    script: [
      'SIMPAN teks “dhiyo7” KE {username}'
    ]
  },
  {
    title: "Conditional Logic",
    description: "Menangani alur yang dinamis, seperti pop-up error.",
    script: [
      'JIKA muncul “Error”',
      '  TEKAN TOMBOL SISTEM “Back”',
      'AKHIR JIKA'
    ]
  },
  {
    title: "Looping",
    description: "Mengeksekusi perintah berulang kali untuk tugas-tugas seperti input data massal.",
    script: [
      'ULANGI 3 KALI:',
      '  Ketik “Hello”',
      'AKHIR ULANGI'
    ]
  },
  {
    title: "Modular Architecture",
    description: "Memecah skenario kompleks menjadi file-file kecil yang bisa digunakan kembali.",
    script: [
      'JALANKAN "login.heim"'
    ]
  },
  {
    title: "System Keys",
    description: "Mengakses tombol fisik perangkat Android seperti \'Back\' atau \'Home\'.",
    script: [
      'TEKAN TOMBOL SISTEM “Back”'
    ]
  }
];

export const syntaxHighlight = (line: string) => {
    return line.replace(/(\".*?\")|(#.*)|\\b(SIMPAN|KE|JIKA|AKHIR JIKA|ULANGI|KALI:|AKHIR ULANGI|JALANKAN|TEKAN TOMBOL SISTEM|Buka|Ketik|Ketuk|Pastikan)\\b/g, (match) => {
      if (match.startsWith('#')) return `<span class="text-gray-400">${match}</span>`;
      if (match.startsWith('"')) return `<span class="text-green-600">${match}</span>`;
      const keywords = ['SIMPAN', 'KE', 'JIKA', 'AKHIR JIKA', 'ULANGI', 'KALI:', 'AKHIR ULANGI', 'JALANKAN', 'TEKAN TOMBOL SISTEM', 'Buka', 'Ketik', 'Ketuk', 'Pastikan'];
      if (keywords.includes(match)) return `<span class="text-blue-600 font-bold">${match}</span>`;
      return match;
    });
  };