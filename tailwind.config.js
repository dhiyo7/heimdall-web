/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        // Semantic tokens — resolve via CSS variables at runtime
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        'surface-muted': "var(--color-surface-muted)",
        foreground: "var(--color-text-primary)",
        'text-primary': "var(--color-text-primary)",
        'text-secondary': "var(--color-text-secondary)",
        'text-muted': "var(--color-text-muted)",
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
        },
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        warning: "var(--color-warning)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
        border: "var(--color-border)",
      },
      maxWidth: {
        constrained: "var(--container-max-width)",
      },
      padding: {
        constrained: "var(--container-padding)",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        inner: "var(--shadow-inner)",
        "inner-2": "var(--shadow-inner-2)",
      },
      spacing: {
        "3xs": "var(--spacing-3xs)",
        "2xs": "var(--spacing-2xs)",
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "var(--spacing-3xl)",
        "4xl": "var(--spacing-4xl)",
        "5xl": "var(--spacing-5xl)",
        section: "var(--spacing-section)",
      },
      fontSize: {
        h1: ["var(--font-size-h1)", { lineHeight: "96.5px", fontWeight: "800" }],
        h2: ["var(--font-size-h2)", { lineHeight: "52px", fontWeight: "800" }],
        display: ["var(--font-size-display)", { lineHeight: "52px", fontWeight: "800" }],
        h3: ["var(--font-size-h3)", { lineHeight: "50.5px", fontWeight: "800", letterSpacing: "-0.92px" }],
        h4: ["var(--font-size-h4)", { lineHeight: "42px", fontWeight: "900", letterSpacing: "-1.4px" }],
        h5: ["var(--font-size-h5)", { lineHeight: "49px", fontWeight: "800", letterSpacing: "-0.76px" }],
        h6: ["var(--font-size-h6)", { lineHeight: "37px", fontWeight: "800", letterSpacing: "-1.19px" }],
        "heading-32px": ["var(--font-size-heading-32px)", { lineHeight: "33.5px", fontWeight: "800", letterSpacing: "-1.12px" }],
        "heading-27px": ["var(--font-size-heading-27px)", { lineHeight: "31px", fontWeight: "800" }],
        "heading-23px": ["var(--font-size-heading-23px)", { lineHeight: "37px", fontWeight: "800" }],
        body: ["var(--font-size-body)", { lineHeight: "20px", fontWeight: "400", letterSpacing: "-0.18px" }],
      },
      transitionTimingFunction: {
        // From WingDeck measured eased timing
        brand: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
