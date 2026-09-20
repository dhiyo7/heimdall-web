---
---

# Reporting

## Overview

Laporan visual untuk test execution, mencakup summary, screenshots, diff images, dan statistik eksekusi.

## Visual Report Generation

### Report Contents
- **Summary**: Pass/fail/skip statistics
- **Screenshots**: Before/after/diff images
- **Timing**: Execution time per test
- **Device Info**: Model, OS version, app version
- **Healing Events**: Self-healing activity
- **Visual Comparison**: Baseline vs current

## Export Formats

### JSON Report
```json
{
  "summary": {
    "passed": 12,
    "failed": 2,
    "skipped": 1,
    "total": 15,
    "passRate": "80%"
  },
  "results": [...],
  "duration": "00:05:23",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### JUnit XML
```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="Heimdall Tests" tests="15" failures="2">
  <testcase name="Login Test" classname="login" time="1.234">
    <passed/>
  </testcase>
</testsuite>
```

### Allure Report
Rich HTML report generation with detailed analysis.

## Report Dashboard

### Filter Options
- By status (pass/fail/skip)
- By device
- By platform (Android/Web)
- By date range
- By test suite

### Visualization
- Pie chart for pass/fail distribution
- Timeline chart for execution history
- Trend analysis over time

## Configuration

```json
{
  "reporting": {
    "enabled": true,
    "formats": ["json", "junit-xml", "allure"],
    "outputDir": "./reports/",
    "screenshots": {
      "beforeEach": true,
      "afterEach": true,
      "onFailure": true
    },
    "retentionDays": 30
  }
}
```

## Best Practices

### Organization
- Use consistent naming: `{platform}-{date}-{suite}.json`
- Separate reports by test suite
- Archive old reports

### Analysis
- Review failed tests first
- Compare with previous runs
- Track flaky tests over time

### Automation
- Generate reports in CI/CD pipeline
- Upload artifacts automatically
- Set up notifications for failures

## Related

- [Headless CLI](/features/basic-features/headsless-cli)
- [Visual Regression](/features/advanced-features/visual-regression)
- [API Testing](/features/advanced-features/api-testing)