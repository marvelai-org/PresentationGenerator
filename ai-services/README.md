# Presentation Generator AI Service

This is the AI service component of the Presentation Generator application. It provides the backend API for generating presentation content using various AI models.

## Directory Structure

- `app.py` - The main FastAPI application with API endpoints
- `requirements.txt` - Python dependencies
- `models/` - Directory for ML model files and related scripts

## Setup and Installation

1. Create a virtual environment (recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Service

Start the service with:

```bash
python app.py
```

This will start the service at `http://localhost:8000`.

For development with automatic reloading:

```bash
uvicorn app:app --reload
```

## API Endpoints

### Health Check

- `GET /` - Returns a simple status message to confirm the service is running

### Prediction

- `POST /predict` - Generates presentation content based on a prompt
  - Request body:
    ```json
    {
      "prompt": "string",
      "options": {
        "property1": "any type"
      }
    }
    ```
  - Response:
    ```json
    {
      "status": "success",
      "data": {
        "title": "string",
        "slides": [
          {
            "title": "string",
            "content": "string"
          }
        ],
        "metadata": {
          "prompt": "string",
          "options": {},
          "generationTime": "string"
        }
      }
    }
    ```

## Adding AI Models

Place your model files and scripts in the `models/` directory. Update `app.py` to utilize these models when processing prediction requests.

## Environment Variables

Create a `.env` file in the ai-services directory with the following variables:

```
# AI API Keys
OPENAI_API_KEY=your_openai_api_key
COHERE_API_KEY=your_cohere_api_key

# Service Configuration
PORT=8000
DEBUG=True
```

## Future Improvements

- Add authentication for API endpoints
- Implement model versioning
- Add caching for repeated requests
- Implement logging and monitoring
- Create Docker support for easier deployment
