// Verifikasi cepat SPEC-41: urutan section + paritas kunci i18n (assert-based).
import fs from 'fs';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const app = read('../src/App.tsx');

const order = [
  '<Hero />', '<TrustStrip />', '<EverythingInOneApp />', '<FiveSteps />', '<FeatureStack />',
  '<DarkNodeSection />', '<MockupGallery />', '<VisualIntelligenceSection />', '<DocumentationSection />',
  '<Roadmap />', '<PricingSection />', '<DownloadSection />', '<CommunityCta />', '<FAQSection />',
];
const pos = order.map((s) => app.indexOf(s));
const ordered = pos.every((v, i) => v > 0 && (i === 0 || v > pos[i - 1]));
console.log('urutan 14 section benar:', ordered);
if (!ordered) console.log(order.map((s, i) => `${s}=${pos[i]}`).join(' '));

const id = JSON.parse(read('../src/i18n/locales/id.json'));
const en = JSON.parse(read('../src/i18n/locales/en.json'));
const flat = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, p + k + '.') : [p + k]));

const ki = new Set(flat(id));
const ke = new Set(flat(en));
const onlyId = [...ki].filter((k) => !ke.has(k));
const onlyEn = [...ke].filter((k) => !ki.has(k));
console.log('kunci hanya di id:', onlyId.length ? onlyId : 'tidak ada');
console.log('kunci hanya di en:', onlyEn.length ? onlyEn : 'tidak ada');

const need = ['everything.title', 'steps.title', 'community.cta', 'download.cta', 'hero.trust_line', 'nav.download'];
console.log('kunci baru lengkap di 2 bahasa:', need.every((k) => ki.has(k) && ke.has(k)));
console.log('jumlah kunci id/en:', ki.size, ke.size);

// Navbar sticky: `html { overflow-x: hidden }` mematikan position:sticky pada header.
const css = read('../src/index.css');
const htmlOverflow = /html\s*,\s*body\s*\{[^}]*overflow-x\s*:\s*hidden/.test(css);
console.log('sticky aman (html tanpa overflow-x):', !htmlOverflow);
if (htmlOverflow) console.log('  ! temuan: overflow-x pada html mematikan position:sticky');

