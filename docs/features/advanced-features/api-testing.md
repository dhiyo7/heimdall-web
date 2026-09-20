---
---

# API Testing

## Overview

Lipat API Testing ke dalam keyword DSL Heimdall.

## CLI Commands

```bash
# Run API test file
heimdall api-test /path/to/api-test-file.json

# Run with report
heimdall api-test /path/to/api-test.json --report json --output ./reports/
```

## APIUnitTestSchema

```json
{
  "id": "test-001",
  "name": "Login API Test",
  "method": "POST",
  "url": "https://api.example.com/login",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "type": "json",
    "data": {
      "username": "user@test.com",
      "password": "password123"
    }
  },
  "assertions": {
    "statusCode": {
      "expected": 200,
      "relation": "equals"
    },
    "responseTime": {
      "maxMs": 2000
    },
    "body": {
      "paths": [
        {
          "path": "$.token",
          "expected": "non-empty",
          "relation": "regex"
        }
      ]
    }
  }
}
```

## Supported Methods

- **POST**: APIUnitTestSchema, APIUnitTestMultipart (multipart/form-data)
- **PUT**: APIUnitTestSchema
- **GET**: APIUnitTestSchema
- **DELETE**: APIUnitTestSchema

## Authentication

```json
{
  "auth": {
    "type": "bearer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Troubleshooting

### Common Issues
- **Connection refused**: Check URL and network
- **Authentication failed**: Check token validity
- **Timeout**: Adjust maxMs in responseTime assertion

## Related

- [Headless CLI](/features/basic-features/headsless-cli)
- [Automation Drivers](/features/basic-features/automation-drivers)
- [Data-Driven Testing](/features/advanced-features/data-driven-testing)