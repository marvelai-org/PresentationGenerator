# Outline Generation Endpoint

The outline generation endpoint creates structured presentation outlines based on a specified topic.

**URL**: `/generate/outline`

**Method**: `POST`

**Auth Required**: No

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| topic | string | Yes | The main subject of the presentation |
| n_slides | integer | Yes | Target number of slides to generate |
| instructional_level | string | No | Complexity level: "beginner", "intermediate", or "advanced". Default: "intermediate" |
| file_url | string | No | URL to a reference document to incorporate in the outline |
| file_type | string | No | Type of reference document (pdf, pptx, etc.) |
| lang | string | No | Language code for the output. Default: "en" |

### Example Request

```json
{
  "topic": "Introduction to Artificial Intelligence",
  "n_slides": 8,
  "instructional_level": "intermediate",
  "lang": "en"
}
```

## Response

| Field | Type | Description |
|-------|------|-------------|
| outlines | array | List of slide titles forming the presentation outline |

### Example Response

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

## Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Missing required parameters or invalid input |
| 422 | Validation Error - Input validation failed |
| 500 | Internal Server Error - Server-side error during processing |

### Example Error Response

```json
{
  "error": true,
  "message": "Topic field is required",
  "status_code": 400
}
```

## Usage Notes

- The `n_slides` parameter should be a positive integer, typically between 5 and 20
- The `instructional_level` affects the complexity and depth of the generated outline
- When providing a `file_url`, the outline generator will incorporate information from the referenced document

## Implementation Details

The outline generation is implemented in `src/ai_backend/modules/outline_generator/core.py`. It uses a language model (LLM) to generate contextually appropriate slide titles based on the provided topic.

## Rate Limiting

This endpoint is subject to rate limits:
- 10 requests per minute per IP address 