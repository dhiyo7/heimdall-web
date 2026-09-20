import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Heimdall',
  description: 'AI-Powered QA Automation & QA Management System',
  lang: 'id-ID',
  ignoreDeadLinks: true,
  head: [
    ['meta', { name: 'theme-color', content: '#ff6b70' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Heimdall Documentation' }],
    ['meta', { property: 'og:description', content: 'Dokumentasi resmi Heimdall - Panduan Pengguna Aplikasi QA Automation' }],
    ['meta', { property: 'og:image', content: '/heimdall-hero.jpg' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'Heimdall Documentation' }],
    ['meta', { name: 'twitter:description', content: 'Dokumentasi resmi Heimdall - Panduan Pengguna Aplikasi QA Automation' }],
    ['link', { rel: 'canonical', href: 'https://theheimdall.com/docs/' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' }],
    ['meta', { property: 'og:url', content: 'https://theheimdall.com/docs/' }],
    ['meta', { property: 'og:site_name', content: 'Heimdall' }],
    ['meta', { property: 'og:locale', content: 'id_ID' }],
    ['meta', { name: 'twitter:image', content: 'https://theheimdall.com/heimdall-hero.jpg' }],
    ['meta', { name: 'twitter:image:alt', content: 'Heimdall QA Automation Platform' }],
  ],
  sitemap: {
    hostname: 'https://theheimdall.com',
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Mulai', link: '/guides/installation' },
      { text: 'Fitur', link: '/features/overview' },
      { text: 'Tutorial', link: '/tutorials/getting-started/setup-android' },
      { text: 'Developer', link: '/api/reference' },
      { text: 'GitHub', link: 'https://github.com/dhiyo7/heimdall' },
    ],
    sidebar: [
      {
        text: 'Pengenalan',
        collapsed: false,
        items: [
          { text: 'Beranda', link: '/' },
          { text: 'Instalasi Aplikasi', link: '/guides/installation' },
          { text: 'Mulai Cepat', link: '/guides/quick-start' },
        ],
      },
      {
        text: 'Fitur Heimdall',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/features/overview' },
          {
            text: 'Fitur Dasar',
            collapsed: true,
            items: [
              { text: 'Keyword DSL (Indonesia)', link: '/features/basic-features/keyword-DSL' },
              { text: 'Automation Drivers', link: '/features/basic-features/automation-drivers' },
              { text: 'Headless CLI', link: '/features/basic-features/headsless-cli' },
            ],
          },
          {
            text: 'Fitur Lanjutan',
            collapsed: true,
            items: [
              { text: 'Action Recording', link: '/features/advanced-features/action-recording' },
              { text: 'Self-Healing', link: '/features/advanced-features/self-healing' },
              { text: 'Data-Driven Testing', link: '/features/advanced-features/data-driven-testing' },
              { text: 'Visual Regression', link: '/features/advanced-features/visual-regression' },
              { text: 'API Testing', link: '/features/advanced-features/api-testing' },
            ],
          },
          {
            text: 'Fitur AI',
            collapsed: true,
            items: [
              { text: 'English DSL', link: '/features/ai-features/english-dsl' },
              { text: 'AI Test Generation', link: '/features/ai-features/test-generation' },
            ],
          },
          { text: 'Laporan (Reports)', link: '/features/reporting/visual-reports' },
        ],
      },
      {
        text: 'Tutorial',
        collapsed: false,
        items: [
          {
            text: 'Memulai',
            collapsed: true,
            items: [
              { text: 'Setup Android', link: '/tutorials/getting-started/setup-android' },
              { text: 'Setup Web', link: '/tutorials/getting-started/setup-web' },
              { text: 'Menulis Test Pertama', link: '/tutorials/getting-started/writing-first-test' },
              { text: 'Menjalankan Test', link: '/tutorials/getting-started/running-tests' },
            ],
          },
          {
            text: 'Tutorial Lanjutan',
            collapsed: true,
            items: [
              { text: 'Visual Regression', link: '/tutorials/advanced-tutorials/visual-regression' },
              { text: 'Data-Driven Testing', link: '/tutorials/advanced-tutorials/data-driven-testing' },
              { text: 'AI Test Generation', link: '/tutorials/advanced-tutorials/ai-test-generation' },
            ],
          },
        ],
      },
      {
        text: 'Best Practices',
        collapsed: true,
        items: [
          { text: 'Testing Strategies', link: '/best-practices/testing-strategies' },
          { text: 'Selector Management', link: '/best-practices/selector-management' },
          { text: 'Debugging Tips', link: '/best-practices/debugging-tips' },
          { text: 'Performance Optimization', link: '/best-practices/performance-optimization' },
        ],
      },
      {
        text: 'Troubleshooting',
        collapsed: true,
        items: [
          { text: 'Common Issues', link: '/troubleshooting/common-issues' },
          { text: 'Android Specific', link: '/troubleshooting/android-specific' },
          { text: 'Web Specific', link: '/troubleshooting/web-specific' },
          { text: 'Persistent Issues', link: '/troubleshooting/persistent-issues' },
        ],
      },
      {
        text: 'Ecosystem',
        collapsed: true,
        items: [
          {
            text: 'Integrations',
            collapsed: true,
            items: [
              { text: 'CI/CD', link: '/ecosystem/integrations/ci-cd' },
              { text: 'Pytest', link: '/ecosystem/integrations/pytest' },
              { text: 'TMS', link: '/ecosystem/integrations/tms' },
            ],
          },
          {
            text: 'Resources',
            collapsed: true,
            items: [
              { text: 'Changelog', link: '/ecosystem/resources/changelog' },
              { text: 'Roadmap', link: '/ecosystem/resources/roadmap' },
              { text: 'FAQ', link: '/ecosystem/resources/faq' },
            ],
          },
        ],
      },
      {
        text: 'Referensi Developer',
        collapsed: true,
        items: [
          { text: 'API Reference', link: '/api/reference' },
          { text: 'Endpoints', link: '/api/endpoints' },
          { text: 'Webhooks', link: '/api/webhooks' },
          { text: 'Architecture', link: '/guides/architecture' },
          { text: 'Contributing', link: '/guides/contributing' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dhiyo7/heimdall' },
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Cari Dokumentasi',
            buttonAriaLabel: 'Cari dokumentasi',
          },
          modal: {
            noResultsText: 'Tidak ada hasil',
            resetButtonTitle: 'Reset pencarian',
            displayDetails: 'Tampilkan detail',
            footer: {
              selectText: 'Pilih',
              navigateText: 'Navigasi',
              closeText: 'Tutup',
            },
          },
        },
      },
    },
    outline: {
      level: [2, 3],
      label: 'Halaman Ini',
    },
    docFooter: {
      prev: 'Sebelumnya',
      next: 'Selanjutnya',
    },
    lastUpdated: {
      text: 'Terakhir diperbarui',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },
    darkModeSwitchLabel: 'Tema',
    lightModeSwitchTitle: 'Ganti ke mode terang',
    darkModeSwitchTitle: 'Ganti ke mode gelap',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Kembali ke atas',
    externalLinkIcon: true,
  },
  lastUpdated: true,
  cleanUrls: true,
});