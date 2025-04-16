# AI Backend API Reference

This document provides detailed information about the REST API endpoints available in the AI Backend component of the Presentation Generator.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:8000
```

For production deployments, this will be your deployed service URL.

## API Versioning

The current API version is `v0.1.0` as defined in the FastAPI application. The API does not currently use explicit versioning in the URL paths (e.g., `/v1/...`), but future versions may introduce this pattern.

When making breaking changes:
1. The API version number will be incremented
2. New endpoints may include version prefixes
3. Backward compatibility will be maintained when possible

## Endpoints

### Health Check

```
GET /
```

Returns the health status of the API service.

#### Response

```json
{
  "status": "ok",
  "message": "Presentation Generator AI Service is running"
}
```

### Generate Outline

```
POST /generate/outline
```

Creates a structured presentation outline based on a topic.

#### Request Body

| Field | Type | Description |
|-------|------|-------------|
| topic | string | The main subject of the presentation |
| n_slides | integer | Target number of slides to generate |
| instructional_level | string | Complexity level: "beginner", "intermediate", or "advanced" |
| file_url | string | (Optional) URL to a reference document |
| file_type | string | (Optional) Type of reference document (pdf, pptx, etc.) |
| lang | string | (Optional) Language code, defaults to "en" |

Example:

```json
{
  "topic": "Introduction to Artificial Intelligence",
  "n_slides": 8,
  "instructional_level": "intermediate",
  "lang": "en"
}
```

#### Response

```json
{
  "outlines": [
    "What is Artificial Intelligence?",
    "History of AI: From Past to Present",
    "Key Components of AI Systems",
    "Machine Learning Fundamentals",
    "Neural Networks and Deep Learning",
    "AI Applications in Various Industries",
    "Ethical Considerations in AI Development",
    "Future Trends in AI Technology"
  ]
}
```

### Generate Slides

```
POST /generate/slides
```

Generates detailed content for each slide based on the outline titles.

#### Request Body

| Field | Type | Description |
|-------|------|-------------|
| slides_titles | array | List of slide titles from the outline |
| topic | string | The main subject of the presentation |
| instructional_level | string | Complexity level: "beginner", "intermediate", or "advanced" |
| lang | string | (Optional) Language code, defaults to "en" |

Example:

```json
{
  "slides_titles": [
    "What is Artificial Intelligence?", 
    "History of AI: From Past to Present",
    "Key Components of AI Systems"
  ],
  "topic": "Introduction to Artificial Intelligence",
  "instructional_level": "intermediate",
  "lang": "en"
}
```

#### Response

```json
{
  "slides": [
    {
      "title": "What is Artificial Intelligence?",
      "content": "Artificial Intelligence (AI) refers to systems or machines that mimic human intelligence to perform tasks and can iteratively improve themselves based on the information they collect.\n\n- AI systems analyze their environment and take actions to achieve specific goals\n- They process vast amounts of data to identify patterns and make predictions\n- AI combines computer science with robust datasets to enable problem-solving\n- Modern AI includes subfields like machine learning and deep learning",
      "notes": "When discussing this slide, emphasize that AI systems are not truly 'intelligent' in the human sense but simulate aspects of human cognition."
    },
    {
      "title": "History of AI: From Past to Present",
      "content": "The field of AI has evolved significantly since its inception in the mid-20th century.\n\n- 1950s: Alan Turing proposes the Turing Test; term 'Artificial Intelligence' coined at Dartmouth Conference (1956)\n- 1960s-70s: Early development of expert systems and rule-based programming\n- 1980s: Rise of machine learning algorithms\n- 1990s-2000s: Development of statistical methods and increased computing power\n- 2010s: Breakthrough in deep learning with neural networks\n- Present: Integration of AI in everyday technology and business applications",
      "notes": "This timeline shows how AI has evolved from theoretical concepts to practical applications across multiple industries."
    },
    {
      "title": "Key Components of AI Systems",
      "content": "Modern AI systems consist of several interconnected components:\n\n- Data Collection and Processing: The foundation of AI systems\n- Algorithms: Mathematical procedures that process input data\n- Training Methods: Supervised, unsupervised, and reinforcement learning\n- Feature Engineering: Selecting relevant data attributes\n- Model Evaluation: Testing accuracy and performance\n- Deployment Infrastructure: Hardware and software for implementation\n- Feedback Mechanisms: Systems to improve performance over time",
      "notes": "Highlight that the quality of data is often more important than the complexity of the algorithm for most AI applications."
    }
  ]
}
```

### Generate Images

```
POST /generate/images
```

Creates visual elements for presentation slides based on their content.

#### Request Body

| Field | Type | Description |
|-------|------|-------------|
| slides | array | List of slides with title and content |

Example:

```json
{
  "slides": [
    {
      "title": "What is Artificial Intelligence?",
      "content": "Artificial Intelligence (AI) refers to systems or machines that mimic human intelligence to perform tasks and can iteratively improve themselves based on the information they collect."
    }
  ]
}
```

#### Response

```json
{
  "status": "success",
  "slides": [
    {
      "title": "What is Artificial Intelligence?",
      "content": "Artificial Intelligence (AI) refers to systems or machines that mimic human intelligence to perform tasks and can iteratively improve themselves based on the information they collect.",
      "image_url": "https://your-supabase-url.supabase.co/storage/v1/object/public/slide-images/ai_concept_1234.png"
    }
  ]
}
```

## Error Handling

All endpoints use consistent error responses with the following format:

```json
{
  "error": true,
  "message": "Detailed error message",
  "status_code": 400
}
```

Common error codes:

- `400`: Bad Request - Missing parameters or invalid input
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server-side error

## Authentication

Currently, the AI Backend API does not require authentication for basic usage. However, if using Supabase storage for image uploads, you'll need to configure the storage credentials as described in the [Environment Configuration](./getting-started.md#environment-variable-configuration) section.

## Rate Limiting

The service implements rate limiting to prevent abuse. These limits are configurable in the service settings but default to:

- 10 requests per minute for `/generate/outline` and `/generate/slides` endpoints
- 5 requests per minute for `/generate/images` endpoint

Exceeding these limits will result in a `429 Too Many Requests` response with information about when you can retry the request.

## Models and Backends

The API uses different AI models for text and image generation:

- **Text Generation**: 
  - Primary: OpenRouter API with models like `meta-llama/llama-4-maverick`
  - Fallback: Together.ai models if OpenRouter is unavailable
  
- **Image Generation**:
  - Together.ai API for image creation
  - Images are stored in Supabase Storage

See the [Model Configuration](./model-configuration.md) documentation for details on customizing which models are used. 