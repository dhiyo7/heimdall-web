export const languageFeatures = [
  {
    title: "Human-Readable Syntax",
    description: "Commands written in an easy-to-read and understand format.",
    script: [
      '# Login Scenario',
      'Open app "com.app"',
      'Type "user" on "Email"',
      'Tap button "Login"',
      'Assert "Home" appears'
    ]
  },
  {
    title: "Global Memory",
    description: "Stores data (text) across steps or even across scenario files.",
    script: [
      'SAVE text "dhiyo7" TO {username}'
    ]
  },
  {
    title: "Conditional Logic",
    description: "Handle dynamic flows, such as error popups.",
    script: [
      'IF "Error" appears',
      '  PRESS SYSTEM BUTTON "Back"',
      'END IF'
    ]
  },
  {
    title: "Looping",
    description: "Execute commands repeatedly for tasks like bulk data input.",
    script: [
      'REPEAT 3 TIMES:',
      '  Type "Hello"',
      'END REPEAT'
    ]
  },
  {
    title: "Modular Architecture",
    description: "Break complex scenarios into small, reusable files.",
    script: [
      'RUN "login.heim"'
    ]
  },
  {
    title: "System Keys",
    description: "Access physical Android device buttons like 'Back' or 'Home'.",
    script: [
      'PRESS SYSTEM BUTTON "Back"'
    ]
  },
  {
    title: "Dynamic Resilience",
    description: "Smart assertion system. Robot can continue on minor errors (Soft Assert) or stop on fatal ones (Hard Assert).",
    script: [
      'Assert "Promo" appears',
      'Must appear "Login Successful"'
    ]
  },
  {
    title: "Smart Selectors",
    description: "Target hard-to-reach elements like floating buttons (FAB) or elements without IDs using ordinal position.",
    script: [
      'Tap button "FAB"',
      'Type "123" on column "ordinal 1"'
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
    'SAVE', 'TO', 'IF', 'END IF', 'REPEAT', 'TIMES:', 'END REPEAT',
    'RUN', 'PRESS SYSTEM BUTTON', 'Open', 'Type', 'Tap', 'Assert', 'Must', 'FAB', 'ordinal'
  ];

  const keywordPattern = keywords.join('|').replace(/ /g, '\\s+'); // Handle spaces in keywords like END IF

  const regex = new RegExp(`(#.*)|(["“].*?["”])|(\\{.*?\\})|\\b(${keywordPattern})\\b`, 'g');

  return line.replace(regex, (match, comment, string, variable, keyword) => {
    if (comment) return `<span class="text-[var(--color-text-muted)] italic">${match}</span>`;
    if (string) return `<span class="text-[var(--color-success)] font-semibold">${match}</span>`;
    if (variable) return `<span class="text-[var(--color-warning)] font-semibold">${match}</span>`;
    if (keyword) return `<span class="text-[var(--color-success)] font-bold">${match}</span>`;
    return match;
  });
};