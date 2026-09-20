---
---

# Webhooks

Integrasikan Heimdall dengan sistem eksternal via webhooks. Heimdall akan mengirim HTTP POST ke URL yang Anda konfigurasikan saat event tertentu terjadi.

## Configuration

Tambahkan webhook di dashboard Heimdall atau via API:

```json
{
  "webhook": {
    "url": "https://your-server.com/webhook/heimdall",
    "events": ["test.completed", "test.failed", "baseline.created"],
    "secret": "your-webhook-secret"
  }
}
```

## Event Types

| Event | Trigger | Payload |
|-------|---------|---------|
| `test.started` | Test execution dimulai | executionId, testCaseId |
| `test.completed` | Test execution selesai | executionId, result, duration |
| `test.failed` | Test execution gagal | executionId, errors |
| `baseline.created` | Baseline screenshot dibuat | testCaseId, baselineId |
| `baseline.updated` | Baseline screenshot diupdate | testCaseId, baselineId |
| `device.connected` | Device baru terhubung | deviceId, model |
| `device.disconnected` | Device terputus | deviceId |
| `healing.triggered` | Self-healing aktif | executionId, originalSelector |

## Payload Examples

### test.completed
```json
{
  "event": "test.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "executionId": "exec-12345",
    "testCaseId": "tc-login-001",
    "result": "passed",
    "duration": "00:01:23",
    "platform": "android",
    "deviceId": "emulator-5554"
  }
}
```

### healing.triggered
```json
{
  "event": "healing.triggered",
  "timestamp": "2024-01-15T10:31:00Z",
  "data": {
    "executionId": "exec-12345",
    "originalSelector": "text:Login",
    "healedSelector": "id:btn_login",
    "strategy": "resource_id",
    "confidence": 0.95
  }
}
```

## Security

### Signature Verification

Setiap request webhook memiliki header `X-Heimdall-Signature`:

```python
import hmac
import hashlib

signature = hmac.new(
    secret.encode('utf-8'),
    payload.encode('utf-8'),
    hashlib.sha256
).hexdigest()

# Verify against X-Heimdall-Signature header
if hmac.compare_digest(signature, request.headers['X-Heimdall-Signature']):
    process_webhook(payload)
```

### Best Practices
- Selalu verifikasi signature
- Return HTTP 200 dengan cepat
- Proses payload secara async
- Implement retry logic di sisi Heimdall

## Troubleshooting

### Webhook not firing
- Check URL dapat diakses publik
- Verify event type benar
- Check secret sesuai

### Invalid signature
- Ensure secret tidak berubah
- Check encoding UTF-8
- Verify timestamp tidak expired

## Related

- [API Reference](/api/reference)
- [Endpoints](/api/endpoints)
- [CI/CD Integration](/ecosystem/integrations/ci-cd)