# AI Presentation Generator Service

A comprehensive AI service for generating professional presentations, including outlines, slide content, and images.

## Features

- **Outline Generation**: Creates structured presentation outlines from topics
- **Slide Content Generation**: Produces detailed content for each slide
- **Image Generation**: Creates relevant visuals for slides
- **Multi-Language Support**: Generate presentations in various languages
- **Reference Material Integration**: Use existing documents as references

## Getting Started

### Prerequisites

- Python 3.10 or higher
- Poetry for dependency management

### Installation

1. Clone the repository and navigate to the ai-services directory:

```bash
git clone https://github.com/your-org/PresentationGenerator.git
cd PresentationGenerator/ai-services
```

2. Install dependencies with Poetry:

```bash
poetry install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Edit the `.env` file with your API keys and configuration.

### Running the Service

> **Note:** All scripts have been moved to the `scripts/` directory in the project root for better organization.

#### Development mode:

```bash
cd platform
./scripts/ai-service/run_dev.sh
```

#### Production mode:

```bash
cd platform
./scripts/ai-service/run.sh
```

#### Setup and Utility Scripts

```bash
# Set up API credentials
npm run ai:setup-credentials

# Set up Supabase integration
npm run ai:setup-supabase

# Fix image generation issues
npm run ai:fix-images
```

## Project Structure

```
ai-services/
├── modules/                 # Core functionality modules
│   ├── image_generator/     # Image generation module
│   ├── outline_generator/   # Outline generation module
│   └── slide_generator/     # Slide content generation module
├── src/                     # Source package
│   └── ai_services/         # Main package
│       ├── modules/         # Internal module references
│       ├── utils/           # Utility functions
│       ├── __init__.py
│       ├── __main__.py      # Command-line entry point
│       └── main.py          # FastAPI application definition
├── static/                  # Static files and media storage
├── tests/                   # Test suite
├── utils/                   # Utility scripts
├── app.py                   # Wrapper script for backward compatibility
├── .env.example             # Example environment configuration
├── pyproject.toml           # Project definition and dependencies
└── README.md                # Project documentation
```

## API Endpoints

The service provides RESTful API endpoints:

- `GET /`: Health check endpoint
- `POST /generate/outline`: Generate presentation outline from a topic
- `POST /generate/slides`: Generate slide content from outline titles
- `POST /generate/images`: Generate images for slides

Detailed API documentation is available at the `/docs` (Swagger UI) and `/redoc` (ReDoc) endpoints when the service is running.

## Development Guidelines

- Use absolute imports (`from ai_services.utils import...`) for consistency
- Add docstrings to all functions and modules
- Include unit tests for new features
- Keep sensitive credentials out of version control
- Use the existing module structure for new features

## License

This project is licensed under the MIT License - see the LICENSE file for details.
