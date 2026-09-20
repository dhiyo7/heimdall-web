---
---

# API Endpoints

Dokumentasi lengkap REST API endpoints Heimdall.

## Test Execution

### POST /v1/tests/execute

Jalankan test case secara on-demand.

**Request**
```json
{
  "testCaseId": "tc-login-001",
  "deviceId": "emulator-5554",
  "platform": "android",
  "parameters": {
    "username": "user@test.com",
    "password": "test123"
  }
}
```

**Response**
```json
{
  "executionId": "exec-12345",
  "status": "queued",
  "estimatedTime": "2 minutes"
}
```

### GET /v1/tests/{executionId}

Dapatkan status dan hasil eksekusi test.

**Response**
```json
{
  "executionId": "exec-12345",
  "status": "completed",
  "result": "passed",
  "duration": "00:01:23",
  "screenshots": [
    "https://cdn.heimdall.qa/screenshots/exec-12345/before.png",
    "https://cdn.heimdall.qa/screenshots/exec-12345/after.png"
  ],
  "logs": [...]
}
```

### POST /v1/tests/suite

Jalankan multiple test cases.

**Request**
```json
{
  "testCaseIds": ["tc-001", "tc-002", "tc-003"],
  "parallel": true,
  "maxParallel": 3
}
```

## Device Management

### GET /v1/devices

List semua device yang terhubung.

**Response**
```json
{
  "devices": [
    {
      "id": "emulator-5554",
      "model": "Pixel 6",
      "osVersion": "13",
      "status": "online",
      "battery": 85
    }
  ]
}
```

### POST /v1/devices/{deviceId}/action

Kirim action ke device tertentu.

**Request**
```json
{
  "action": "tap",
  "target": "Login Button",
  "selector": "text:Login"
}
```

## Baselines

### POST /v1/baselines

Upload baseline screenshot baru.

### GET /v1/baselines/{testCaseId}

List baseline untuk test case tertentu.

### PUT /v1/baselines/{baselineId}

Update baseline yang ada.

### DELETE /v1/baselines/{baselineId}

Hapus baseline.

## Datasets

### POST /v1/datasets

Upload dataset untuk data-driven testing.

**Request**
```json
{
  "name": "user_credentials",
  "format": "csv",
  "file": "base64_encoded_file"
}
```

### GET /v1/datasets/{datasetId}

Dapatkan metadata dataset.

## Related

- [API Reference](/api/reference)
- [Webhooks](/api/webhooks)
- [Headless CLI](/features/basic-features/headsless-cli)