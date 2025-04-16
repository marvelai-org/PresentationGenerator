# API Versioning

This document outlines our API versioning strategy and best practices for evolving the API.

## Versioning Strategy

The AI Backend service follows Semantic Versioning (SemVer) principles for API versions:

- **Major Version** (`v1`, `v2`, etc.): For breaking changes that are not backward compatible
- **Minor Version** (`v1.1`, `v1.2`, etc.): For new features added in a backward-compatible manner
- **Patch Version** (`v1.1.1`, `v1.1.2`, etc.): For backward-compatible bug fixes

## Version Identification

API versions are identified in multiple ways:

1. **URL Path Versioning** (primary method):
   - All endpoints include the major version in the path: `/v1/generate/outline`
   - This allows multiple major versions to coexist

2. **Accept Header Versioning** (secondary method):
   - Clients can specify version in the Accept header: `Accept: application/vnd.ai-backend.v1+json`
   - This is used for finer-grained versioning within major versions

3. **Version Metadata**:
   - All API responses include a version header: `X-API-Version: 1.2.3`
   - OpenAPI documentation specifies the current version

## Breaking vs. Non-Breaking Changes

### Breaking Changes (Major Version Increment)

- Removing or renaming endpoints
- Removing or renaming required request properties
- Adding new required request properties without defaults
- Changing property types
- Changing error response formats
- Changing authentication mechanisms

### Non-Breaking Changes (Minor Version Increment)

- Adding new endpoints
- Adding optional request properties
- Adding response properties
- Extending enumerations
- Adding new error types
- Performance improvements with identical behavior

## API Lifecycle Management

Each API version follows a defined lifecycle:

1. **Preview/Beta** (explicitly marked):
   - Subject to change without notice
   - Limited support, not recommended for production

2. **General Availability**:
   - Fully supported
   - Changes follow versioning rules
   - Documented in changelog

3. **Deprecated**:
   - Still available but marked as deprecated
   - Minimum 6-month deprecation period
   - Replacement documented

4. **Sunset/Retired**:
   - No longer available
   - Announced at least 12 months in advance

## API Evolution Best Practices

- **Extend, Don't Modify**: Add new fields/endpoints rather than changing existing ones
- **Provide Defaults**: New fields should have sensible defaults when possible
- **Gradual Transition**: Support old and new patterns simultaneously during transitions
- **Feature Flags**: Use feature flags for controlled rollout of new functionality
- **Comprehensive Testing**: Maintain test suites for all supported API versions

## Versioning in Documentation

- Each major version has separate OpenAPI documentation
- Deprecation notices clearly indicate sunset dates
- Migration guides explain how to upgrade between versions
- Changelog documents all changes between versions

## Current Version

The current API version is **v1.0.0** (as of January 2025). 