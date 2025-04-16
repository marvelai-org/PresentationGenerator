# API Schemas

This directory contains documentation for the data models and schemas used in the AI Backend API.

## Request Schemas

### OutlineRequest

Request schema for generating a presentation outline.

```python
class OutlineRequest(BaseModel):
    topic: str
    n_slides: int
    instructional_level: str = "intermediate"
    file_url: str | None = None
    file_type: str | None = None
    lang: str = "en"
```

### SlideRequest

Request schema for generating slide content.

```python
class SlideRequest(BaseModel):
    slides_titles: list[str]
    topic: str
    instructional_level: str = "intermediate"
    lang: str = "en"
```

### ImageRequest

Request schema for generating slide images.

```python
class ImageRequest(BaseModel):
    slides: list[dict[str, Any]]
```

## Response Schemas

### OutlineResponse

Response schema for the outline generation endpoint.

```python
class OutlineResponse(BaseModel):
    outlines: list[str]
```

### SlideResponse

Response schema for the slide content generation endpoint.

```python
class SlideResponse(BaseModel):
    slides: list[dict[str, Any]]
```

### ImageResponse

Response schema for the image generation endpoint.

```python
class ImageResponse(BaseModel):
    status: str
    slides: list[dict[str, Any]]
```

## Error Schema

Standard error response format.

```python
{
  "error": true,
  "message": "Detailed error message",
  "status_code": 400
}
``` 