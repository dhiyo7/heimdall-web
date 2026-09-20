---
---

# API Reference

## Overview

API reference untuk integrasi programatik dengan Heimdall. API ini memungkinkan otomatisasi, integrasi dengan tools eksternal, dan custom workflow.

## Base URL

```
https://api.heimdall.qa/v1
```

## Authentication

Semua endpoint memerlukan authentication via API token.

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  https://api.heimdall.qa/v1/endpoint
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "testCaseId",
        "issue": "required field missing"
      }
    ]
  }
}
```

### Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Rate Limiting

- **Limit**: 100 requests per minute per token
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Exceeded**: Returns `429 Too Many Requests`

## Pagination

List endpoints support pagination:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Versioning

API menggunakan versioning via URL path: `/v1/`, `/v2/`. Versi deprecated akan diumumkan terlebih dahulu.

## Related

- [Endpoints](/api/endpoints)
- [Webhooks](/api/webhooks)
- [Headless CLI](/features/basic-features/headsless-cli)