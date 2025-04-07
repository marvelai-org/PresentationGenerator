# AI Presentation Generator

A next-generation AI-powered presentation creation platform inspired by Gamma. Transform your ideas into stunning, professional presentations with the power of AI.

## Overview

AI Presentation Generator is designed to streamline the creation of high-quality presentations. Our platform leverages artificial intelligence to help you generate compelling slide content, beautiful layouts, and engaging visuals with minimal effort.

### Core Features

- **AI-Powered Content Generation**: Create complete presentations from simple prompts
- **Customizable Themes**: Choose from a variety of professional themes or create your own
- **Rich Media Support**: Embed videos, charts, interactive elements, and forms
- **Smart Layout Engine**: Automatically organize content for optimal visual impact
- **Collaborative Editing**: Work together with your team in real-time
- **Export Options**: Download as PDF, export to PowerPoint, or present directly from the web

## Self-Hosting & Deployment

This project is designed to be vendor-agnostic and can be self-hosted on any platform that supports Docker.

### Docker Deployment

The easiest way to deploy the application is using Docker Compose:

1. Clone this repository
2. Configure your environment variables in a `.env` file (see [Environment Configuration](#environment-configuration))
3. Run `docker-compose up -d`

The application will be available at `http://localhost:3000`.

For detailed deployment instructions, see [docs/deployment.md](docs/deployment.md).

### CI/CD Pipeline

The project includes GitHub Actions workflows for continuous integration and deployment:

- Automated linting and testing
- Build process for the Next.js application
- Docker image creation for easy deployment

All workflows are vendor-agnostic and focused on building, testing, and packaging the application for self-hosting.

## Environment Configuration

Create a `.env` file in the root directory with the following variables (see `.env.example` for a template):

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Additional environment variables as needed
```

## Running Locally

### Frontend Application

1. Install dependencies:
   ```bash
   npm ci
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

### AI Service

This repository includes a Python-based AI service for presentation generation.

1. Navigate to the AI service directory:
   ```bash
   cd ai-services
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the service:
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:8000` with the following endpoints:
- GET `/` - Health check endpoint
- POST `/generate-presentation` - Presentation generation endpoint that accepts JSON with a "prompt" field and optional parameters
- POST `/edit-slide` - Slide editing endpoint for revising individual slides
- POST `/preview-slide` - Get a preview image of a slide

### API Documentation

Once the service is running, you can access the auto-generated API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Contributing

We welcome contributions to the AI Presentation Generator! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Run tests and linting locally
5. Submit a pull request

For more information on contributing, please see our [Contribution Guidelines](docs/CONTRIBUTING.md).

## License

[MIT License](LICENSE)
