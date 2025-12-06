

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
  // Escape specific regex characters in keywords if needed, though mostly they are letters
  // Improved regex to handle smart quotes and standard quotes

  // First, let's process the line to replace patterns with temporary placeholders to avoid overlapping replacements?
  // Actually, a single comprehensive regex with capturing groups or a split approach is better.
  // But since we want to return HTML string, let's use a function that tokenizes or just multiple replaces if carefully ordered.
  // However, the simplest way for this specific simple syntax is to use a replacer function with a master regex.

  // Master regex for:
  // 1. Comments (#...)
  // 2. Strings ("..." or “...”)
  // 3. Variables ({...})
  // 4. Keywords

  const keywords = [
    'SIMPAN', 'KE', 'JIKA', 'AKHIR JIKA', 'ULANGI', 'KALI:', 'AKHIR ULANGI',
    'JALANKAN', 'TEKAN TOMBOL SISTEM', 'Buka', 'Ketik', 'Ketuk', 'Pastikan'
  ];

  const keywordPattern = keywords.join('|').replace(/ /g, '\\s+'); // Handle spaces in keywords like AKHIR JIKA

  const regex = new RegExp(`(#.*)|(["“].*?["”])|(\\{.*?\\})|\\b(${keywordPattern})\\b`, 'g');

  return line.replace(regex, (match, comment, string, variable, keyword) => {
    if (comment) return `<span class="text-gray-500 dark:text-gray-400 italic">${match}</span>`;
    if (string) return `<span class="text-green-600 dark:text-green-400 font-bold">${match}</span>`;
    if (variable) return `<span class="text-orange-600 dark:text-orange-400 font-bold">${match}</span>`;
    if (keyword) return `<span class="text-blue-600 dark:text-blue-400 font-black">${match}</span>`;
    return match;
  });
};