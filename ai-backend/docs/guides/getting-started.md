# Getting Started with AI Services

This guide will walk you through setting up and running the AI Services component of the Presentation Generator application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python**: Version 3.10 or higher
  ```bash
  python --version  # Should be 3.10.x or higher
  ```

- **Poetry**: For dependency management
  ```bash
  # Install Poetry
  curl -sSL https://install.python-poetry.org | python3 -
  
  # Verify installation
  poetry --version
  ```

- **Git**: For version control (optional, but recommended)
  ```bash
  git --version
  ```

- **Docker**: For containerized deployment (optional)
  ```bash
  docker --version
  ```

## Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/your-org/PresentationGenerator.git
   cd PresentationGenerator
   ```

2. **Navigate to the AI Services directory**:
   ```bash
   cd ai-backend
   ```

3. **Install dependencies using Poetry**:
   ```bash
   poetry install
   ```

   This will create a virtual environment and install all required dependencies.

4. **Activate the virtual environment**:
   ```bash
   poetry shell
   ```

## Environment Variable Configuration

The AI Services component requires several environment variables to function properly. You'll need to set up API keys for the various AI services used.

1. **Create a `.env` file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your API keys and configuration:

   ```dotenv
   # API Configuration
   API_HOST=0.0.0.0
   API_PORT=8000
   DEBUG=false

   # OpenRouter.ai Configuration (for text generation)
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_TEXT_MODEL=meta-llama/llama-4-maverick:free

   # Together.ai Configuration (for embeddings and image generation)
   TOGETHER_API_KEY=your_together_api_key_here
   TOGETHER_EMBEDDING_MODEL=togethercomputer/m2-bert-80M-8k-retrieval
   TOGETHER_IMAGE_MODEL=black-forest-labs/FLUX.1-schnell-Free

   # Supabase Storage Configuration
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_SERVICE_KEY=your_supabase_service_key_here
   SUPABASE_STORAGE_BUCKET=slide-images
   ```

3. **Important Notes on API Keys**:

   - You need both OpenRouter.ai for text generation and Together.ai for embeddings and image generation
   - If using Supabase for storage, follow the [Supabase Storage Setup](../supabase/storage-setup.md) guide

## Running Locally (Development Mode)

1. **Start the service**:
   ```bash
   python app.py
   ```

   This will start the FastAPI server on http://localhost:8000 by default.

2. **Verify the service is running**:
   
   Open your browser and navigate to http://localhost:8000, or use curl:
   ```bash
   curl http://localhost:8000
   ```

   You should see a response like:
   ```json
   {"status":"ok","message":"Presentation Generator AI Service is running"}
   ```

3. **Access the API documentation**:

   Open your browser and navigate to http://localhost:8000/docs for the Swagger UI interface, which provides interactive documentation for all endpoints.

## Running with Docker (Alternative)

If you prefer to use Docker, follow these steps:

1. **Build the Docker image**:
   ```bash
   docker build -t presentation-ai-service .
   ```

2. **Run the container**:
   ```bash
   docker run -d -p 8000:8000 --env-file .env presentation-ai-service
   ```

## Testing Your Setup

After setting up and running the service, you can test each module:

1. **Test Outline Generation**:
   ```bash
   curl -X POST http://localhost:8000/generate/outline \
     -H "Content-Type: application/json" \
     -d '{"topic": "Introduction to Artificial Intelligence", "n_slides": 5, "instructional_level": "beginner"}'
   ```

2. **Test Slide Generation** (using titles from the previous step):
   ```bash
   curl -X POST http://localhost:8000/generate/slides \
     -H "Content-Type: application/json" \
     -d '{"slides_titles": ["What is AI?", "History of AI", "Machine Learning Basics", "AI Applications", "Future of AI"], "topic": "Introduction to Artificial Intelligence", "instructional_level": "beginner"}'
   ```

## Troubleshooting

### Common Issues

1. **API Key Issues**:
   - Error: `InvalidRequestError: API key not found`
   - Solution: Double-check your API keys in the `.env` file

2. **Port Conflicts**:
   - Error: `OSError: [Errno 48] Address already in use`
   - Solution: Change the port in your `.env` file or stop the process using the current port

3. **Dependency Issues**:
   - Error: `ModuleNotFoundError: No module named 'x'`
   - Solution: Make sure you're running in the Poetry virtual environment with `poetry shell`

4. **Supabase Storage Issues**:
   - Error: `Storage error: Bucket not found or not accessible`
   - Solution: Follow the [Supabase Storage Setup](../supabase/storage-setup.md) guide

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [project issues](https://github.com/your-org/PresentationGenerator/issues) to see if your problem has been reported
2. Consult the [API Documentation](./api-reference.md) for specific endpoint details
3. Review the [Module Documentation](./modules/index.md) for detailed information on each AI module

## Next Steps

- Learn about the [Architecture and Components](./overview.md)
- Explore the [API Reference](./api-reference.md)
- Understand the [Module Documentation](./modules/index.md)
- Review [Deployment Options](../deployment.md) for production environments 