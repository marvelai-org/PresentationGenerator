# API Documentation

This section contains documentation related to the REST API, endpoints, data models, and how to use the AI Backend API.

## Contents

- [API Overview](./overview.md) - General overview of the API endpoints and usage
- [Models](./models.md) - Information about AI models configuration and customization
- [Endpoints](./endpoints/) - Detailed documentation for each API endpoint
- [Schemas](./schemas/) - API data models and schemas
- [Examples](./examples/) - Example API requests and responses

## Key Endpoints

The AI Backend service provides several key endpoints:

- `GET /` - Health check endpoint
- `POST /generate/outline` - Generate presentation outline
- `POST /generate/slides` - Generate slide content
- `POST /generate/images` - Generate images for slides

For detailed information about each endpoint, including request/response formats and examples, see the [API Overview](./overview.md) document and the [Endpoints](./endpoints/) directory.

## Using the API

The API accepts and returns JSON data. All endpoints require appropriate request body parameters as documented. Authentication is not currently required for basic usage, but API keys for third-party services (OpenRouter, Together.ai, etc.) must be configured on the server.

For detailed examples of how to use each endpoint, see the [Examples](./examples/) directory. 