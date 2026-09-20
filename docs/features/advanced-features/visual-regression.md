---
---

# Visual Regression Testing

## Overview

Membandingkan screenshot antar run secara **otomatis** untuk mendeteksi perubahan visual.

## Golden Screenshot Management

### CRUD Baseline API
- Create new baseline
- Read/List baselines
- Update baseline (replace)
- Delete baseline

### Baseline Storage
- Path format: `baselines/{testCaseId}-{platform}-{deviceModel}.png`
- Format: PNG, resolution depends on device
- Metadata: timestamp, device info, app version

## Comparison Algorithm

### Pixel Comparison
- Algorithm: pixel-by-pixel comparison
- Tolerance: default 98% (configurable)
- Output: diff image, heatmap, changed regions

### Dynamic Element Masking
- Ignore timestamp, ads, banners, dynamic content
- Configuration per test case

## Keyword DSL

```heim
# Auto-tolerant match (default 98%)
VISUAL_MATCH

# Custom threshold
VISUAL_MATCH dengan threshold 95%

# Hard fail on mismatch
VISUAL_MATCH dengan threshold 95% harus dd
```

## VisualDiffViewer

### UI Layout
- Side-by-side: baseline vs current
- Overlay mode: blended view
- Heatmap: highlight changed regions

### Regions
- Changed regions marked on diff image
- Clickable to inspect

## Troubleshooting

### Common Issues
- **Baseline not found**: Ensure baseline uploaded
- **False positives**: Adjust threshold or add masking
- **Performance**: Limit screenshot resolution

## Related

- [Headless CLI](/features/basic-features/headsless-cli)
- [Self-Healing](/features/advanced-features/self-healing)
- [Data-Driven Testing](/features/advanced-features/data-driven-testing)