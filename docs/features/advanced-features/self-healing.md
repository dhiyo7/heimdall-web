---
---

# Self-Healing Selector Engine (Auto-Healing)

## Overview

Engine otomatis mencari **alternatif selector** ketika primary selector gagal. Fitur ini memastikan test tetap berjalan meskipun ada perubahan kecil pada UI.

## Fallback Chain Strategy

### Android (UIAutomator2)
Prioritas:
1. `text` (exact match)
2. `resource-id`
3. `content-desc`
4. `xpath` (by text)
5. `class` + bounds (within parent)

### Web (Playwright)
Prioritas:
1. `text` (exact/partial)
2. `css selector`
3. `xpath` (by text/role)
4. `role` + name
5. `class` (partial match)

## Keyword DSL

### Manual Fallback
```heim
# Normal mode: prefer metadata-first
Ketuk tombol "Login"

# Manual fallback chain
GUNAKAN selector alt {
  Ketuk tombol "Masuk"
}
```

### Conditional Healing
```heim
Ketuk tombol "Next"
GUNAKAN selector alt {
  Ketuk tombol "Continue" 1
}
```

## Configuration

```json
{
  "selfHealing": {
    "enabled": true,
    "strategies": {
      "android": ["text", "resource_id", "content_desc", "xpath", "bounds"],
      "web": ["text", "css", "xpath", "role", "class"]
    },
    "globalTolerance": 0.95,
    "logging": {
      "enabled": true,
      "level": "info",
      "retentionDays": 30
    }
  }
}
```

## Monitoring & Logs

- Healing events logged to database
- UI indicator in RunnerView
- Healing Log Panel in BatchProgressTracker
- Toggle enable/disable auto-healing

## Troubleshooting

### Common Issues
- **Healing not triggered**: Check if healing enabled
- **Wrong element healed**: Check tolerance threshold
- **Performance impact**: Limit fallback chain length

## Related

- [Headless CLI](/features/basic-features/headsless-cli)
- [Action Recording](/features/advanced-features/action-recording)
- [Visual Regression](/features/advanced-features/visual-regression)