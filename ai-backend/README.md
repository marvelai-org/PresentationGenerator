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

1. Clone the repository and navigate to the ai-backend directory:

```bash
git clone https://github.com/your-org/PresentationGenerator.git
cd PresentationGenerator/ai-backend
```

2. Install dependencies with Poetry:

```bash
poetry install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Edit the `.env` file with your API keys and configuration (see [Configuration Guide](docs/deployment/configuration.md)).

### Running the Service

> **Note:** All scripts are located in the `scripts/` directory in the ai-backend folder.

#### Development mode:

```bash
./scripts/run_dev.sh
```

#### Production mode:

```bash
./scripts/run.sh
```

#### Utility Scripts

```bash
# Fix image generation issues
./scripts/fix_images.sh
```

### Environment Variables

For a complete list of environment variables, see the [Configuration Guide](docs/deployment/configuration.md).

## Project Structure

```
ai-backend/
├── scripts/                 # Helper scripts for running the service
├── docs/                    # Documentation
│   ├── api/                 # API documentation
│   ├── guides/              # User guides
│   ├── development/         # Developer documentation
│   ├── deployment/          # Deployment documentation
│   └── integrations/        # Integration documentation
├── src/                     # Source package
│   └── ai_backend/         # Main package
│       ├── modules/         # Internal modules
│       │   ├── image_generator/     # Image generation module
│       │   ├── outline_generator/   # Outline generation module
│       │   └── slide_generator/     # Slide content generation module
│       ├── utils/           # Utility functions
│       ├── __init__.py
│       ├── __main__.py      # Command-line entry point
│       └── main.py          # FastAPI application definition
├── static/                  # Static files and media storage
├── tests/                   # Test suite
├── app.py                   # Wrapper script for backward compatibility
├── .env.example             # Example environment configuration
├── .env                     # Local environment configuration (gitignored)
├── pyproject.toml           # Project definition and dependencies
├── poetry.lock              # Locked dependencies
└── README.md                # Project documentation
```

## API Endpoints

The service provides RESTful API endpoints:

- `GET /v1/`: Health check endpoint
- `POST /v1/generate/outline`: Generate presentation outline from a topic
- `POST /v1/generate/slides`: Generate slide content from outline titles
- `POST /v1/generate/images`: Generate images for slides

Detailed API documentation is available at the `/docs` (Swagger UI) and `/redoc` (ReDoc) endpoints when the service is running.

## Testing

To run the test suite:

```bash
poetry run pytest
```

For test coverage reports:

```bash
poetry run pytest --cov=src/ai_backend
```

Tests are organized in the `tests/` directory mirroring the structure of the source code.

For detailed testing documentation, see [docs/development/testing.md](docs/development/testing.md).

## API Versioning

The API currently uses semantic versioning:

1. The API version is defined in the FastAPI application as `v1.0.0`
2. API endpoints use version prefixes (e.g., `/v1/generate/outline`)
3. Breaking changes will result in a new API version
4. Backward compatibility is maintained within the same major version

For more information, see our [API Versioning Guide](docs/api/versioning.md).

## Development Workflow

1. Create a new branch for your feature or bugfix
2. Implement your changes with appropriate tests
3. Ensure all tests pass and code linting is clean
4. Submit a pull request for review
5. After approval, changes will be merged into the main branch

## Development Guidelines

- Use absolute imports (`from ai_backend.utils import...`) for consistency
- Add docstrings to all functions and modules
- Include unit tests for new features
- Keep sensitive credentials out of version control
- Use the existing module structure for new features
- Run `ruff` for code linting before committing

## Deployment

For deployment options and configurations, see our [Deployment Documentation](docs/deployment/README.md).

## Troubleshooting

For common issues and solutions, see our [Troubleshooting Guide](docs/guides/troubleshooting.md).

## Documentation

Our documentation is organized into several sections:

- [API Documentation](docs/api) - API endpoints, schemas, and examples
- [User Guides](docs/guides) - Setup guides and troubleshooting
- [Development](docs/development) - Information for developers
- [Deployment](docs/deployment) - Deployment options and configurations
- [Integrations](docs/integrations) - External service integrations

See the [Documentation README](docs/README.md) for more information on the documentation structure.

## Security

For information about authentication, authorization, and security best practices, see:

- [Authentication Guide](docs/api/authentication.md)
- [Security Documentation](docs/api/security.md)

## Changelog

For a detailed list of changes between versions, see our [Changelog](docs/CHANGELOG.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
