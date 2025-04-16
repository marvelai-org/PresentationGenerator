# Authentication and Authorization

This document outlines the authentication and authorization mechanisms for the AI Backend service.

## Authentication Methods

The AI Backend service supports multiple authentication methods to accommodate different use cases:

### API Key Authentication (Primary Method)

API keys are the primary authentication method for server-to-server communication:

```http
GET /v1/generate/outline
X-API-Key: your-api-key-here
```

- API keys should be included in the `X-API-Key` header
- Keys are associated with specific accounts and usage quotas
- Different tiers of API keys may have different rate limits and capabilities

### OAuth 2.0 / OpenID Connect (Web/Mobile Apps)

For user-facing applications, OAuth 2.0 is recommended:

1. **Authorization Code Flow with PKCE** (recommended for web apps)
2. **Implicit Flow** (legacy support only)
3. **Client Credentials Flow** (for trusted backend services)

Example OAuth bearer token usage:

```http
GET /v1/generate/outline
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### JWT Authentication

JWT tokens are used for session management and user context:

- Tokens contain encoded user information and permissions
- Short expiration times (15-60 minutes) with refresh token rotation
- Signed with industry-standard algorithms (RS256/ES256)

## API Key Management

### Generating API Keys

API keys can be generated through:

1. The management dashboard at `https://dashboard.example.com/api-keys`
2. The key management API endpoint: `POST /v1/api-keys`

### API Key Best Practices

- Store API keys securely in environment variables or secrets management systems
- Never include API keys in client-side code or public repositories
- Rotate keys regularly (at least every 90 days)
- Use different keys for development and production environments

## Authorization

The AI Backend service implements fine-grained role-based access control (RBAC):

### Role Hierarchy

1. **Admin**: Full system access
2. **Developer**: Access to all API endpoints with usage monitoring
3. **Standard User**: Limited to specific endpoints with usage quotas
4. **Read-Only**: Access to non-modifying endpoints only

### Feature-Based Permissions

Access to specific features is controlled by permissions:

- `outline:generate` - Ability to generate outlines
- `slides:generate` - Ability to generate slide content
- `images:generate` - Ability to generate images
- `presentations:read` - Ability to read presentations
- `presentations:write` - Ability to create/update presentations

### Rate Limiting

Rate limits are enforced based on:

1. Authentication tier
2. Endpoint sensitivity
3. Usage history

Rate limit headers are included in all responses:

```http
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 98
X-Rate-Limit-Reset: 1613671001
```

## Multi-Tenancy

The AI Backend service supports multi-tenancy through:

1. **Tenant ID in JWT claims**
2. **Tenant-specific API keys**
3. **Resource isolation** between tenants

## Security Best Practices

- **TLS Encryption**: All API communications must use TLS 1.3+
- **Key Rotation**: Regular rotation of cryptographic keys and secrets
- **Audit Logging**: Comprehensive logging of authentication events
- **Threat Detection**: Monitoring for unusual usage patterns
- **FIDO2/WebAuthn**: Support for passwordless authentication for dashboard access

## Implementation

Authentication is implemented in:

- `src/ai_backend/utils/auth.py` - Authentication utilities
- `src/ai_backend/main.py` - FastAPI dependency injection for auth

See the [Security](./security.md) document for more details on our security practices. 