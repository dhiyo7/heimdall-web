---
layout: home

hero:
  name: 'Heimdall'
  text: 'AI-Powered QA Automation'
  tagline: QA Management System
  actions:
    - theme: brand
      text: 'Mulai Cepat'
      link: /guides/installation
    - theme: alt
      text: 'Lihat Fitur'
      link: /features/overview
    - theme: alt
      text: 'GitHub'
      link: https://github.com/dhiyo7/heimdall

---

<script setup>
import { h } from 'vue';
import VPFeatures from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';

const features = [
  {
    icon: 'cli',
    title: 'Headless CLI & CI/CD',
    details: 'Jalankan test otomatis tanpa GUI, integrasi mudah ke GitHub Actions, GitLab CI, Jenkins dengan export report JUnit, Allure, JSON',
  },
  {
    icon: 'record',
    title: 'Action Recording & Playback',
    details: 'Rekam interaksi UI real-time (Android via adb, Web via Playwright), konversi otomatis ke skrip .heim, timeline visual dengan screenshot',
  },
  {
    icon: 'shield',
    title: 'Self-Healing Selector Engine',
    details: 'Fallback chain otomatis saat selector gagal, strategi berbeda untuk Android & Web, keyword DSL GUNAKAN selector alt, logging healing events',
  },
  {
    icon: 'eye',
    title: 'Visual Regression Testing',
    details: 'Golden screenshot per test case, pixel comparison dengan threshold 98%, diff image, heatmap, dynamic masking, VisualDiffViewer',
  },
  {
    icon: 'database',
    title: 'Data-Driven Testing',
    details: 'Jalankan test case berulang dengan dataset eksternal (CSV, Excel, JSON, SQLite), keyword DSL GUNAKAN DATA, Data Center module',
  },
  {
    icon: 'sparkles',
    title: 'English DSL + AI Test Generation',
    details: 'Penulisan skrip Bahasa Inggris, AI Text-to-Script, Smart Suggestions, Error Diagnosis, provider OpenAI, Gemini, Ollama lokal',
  },
  {
    icon: 'api',
    title: 'API Testing',
    details: 'Integrasi API testing ke DSL via CLI, support GET/POST/PUT/DELETE, assertions statusCode, responseTime, JSONPath body, auth Bearer/Basic',
  },
  {
    icon: 'keyboard',
    title: 'Basic Keyword DSL (Indonesian)',
    details: 'Buka, Ketik, Ketik URUTAN, Ketuk, Ketuk FAB, Tunggu, Pastikan, Gulir - lengkap dengan struktur script .heim dan troubleshooting',
  },
  {
    icon: 'globe',
    title: 'Cross-Platform',
    details: 'Android (UIAutomator2) & Web (Playwright) dengan driver yang sama, konfigurasi device management, parallel execution',
  },
];

const SVGS = {
  cli: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  record: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>',
  shield: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  eye: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  database: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
  sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z"/><path d="M5 19l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/><path d="M19 17l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></svg>',
  api: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l6-6-6-6"/><path d="M12 19h8"/></svg>',
  keyboard: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/></svg>',
  globe: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
};

const featureComponents = features.map((f) => ({
  ...f,
  icon: SVGS[f.icon] || '',
}));
</script>

<VPFeatures :features="featureComponents" />
