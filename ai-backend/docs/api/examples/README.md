# API Usage Examples

This directory contains practical examples of how to use the AI Backend API.

## Python Examples

### Generating a Complete Presentation

```python
import requests
import json

API_URL = "http://localhost:8000"

# Step 1: Generate an outline
outline_response = requests.post(
    f"{API_URL}/generate/outline",
    json={
        "topic": "Introduction to Machine Learning",
        "n_slides": 6,
        "instructional_level": "beginner"
    }
)
outline_data = outline_response.json()
slide_titles = outline_data["outlines"]

# Step 2: Generate slide content
slides_response = requests.post(
    f"{API_URL}/generate/slides",
    json={
        "slides_titles": slide_titles,
        "topic": "Introduction to Machine Learning",
        "instructional_level": "beginner"
    }
)
slides_data = slides_response.json()
slides = slides_data["slides"]

# Step 3: Generate images
images_response = requests.post(
    f"{API_URL}/generate/images",
    json={
        "slides": slides
    }
)
complete_presentation = images_response.json()

# Save the complete presentation
with open("machine_learning_presentation.json", "w") as f:
    json.dump(complete_presentation, f, indent=2)

print(f"Created presentation with {len(complete_presentation['slides'])} slides")
```

## JavaScript/Node.js Examples

### Generating an Outline

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:8000';

async function generateOutline() {
  try {
    const response = await axios.post(`${API_URL}/generate/outline`, {
      topic: 'Sustainable Energy Solutions',
      n_slides: 7,
      instructional_level: 'intermediate'
    });
    
    console.log('Generated Outline:');
    response.data.outlines.forEach((title, index) => {
      console.log(`${index + 1}. ${title}`);
    });
    
    return response.data.outlines;
  } catch (error) {
    console.error('Error generating outline:', error.response?.data || error.message);
  }
}

generateOutline();
```

## cURL Examples

### Health Check

```bash
curl -X GET http://localhost:8000/
```

### Generate Outline

```bash
curl -X POST http://localhost:8000/generate/outline \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Blockchain Technology",
    "n_slides": 5,
    "instructional_level": "intermediate"
  }'
```

### Generate Slides

```bash
curl -X POST http://localhost:8000/generate/slides \
  -H "Content-Type: application/json" \
  -d '{
    "slides_titles": [
      "What is Blockchain?",
      "How Blockchain Works",
      "Key Features and Benefits",
      "Real-World Applications",
      "Future of Blockchain"
    ],
    "topic": "Blockchain Technology",
    "instructional_level": "intermediate"
  }'
```

## Error Handling Examples

```python
import requests

API_URL = "http://localhost:8000"

try:
    response = requests.post(
        f"{API_URL}/generate/outline",
        json={
            # Missing required 'topic' field
            "n_slides": 5
        }
    )
    
    if response.status_code != 200:
        error_data = response.json()
        print(f"Error: {error_data['message']}")
    else:
        print(response.json())
        
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
``` 