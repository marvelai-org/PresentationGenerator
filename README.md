# AI Presentation Generator

<div align="center">
  
![AI Presentation Generator](https://img.shields.io/badge/AI%20Presentation-Generator-6366F1?style=for-the-badge)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)

</div>

A next-generation AI-powered presentation creation platform that transforms your ideas into stunning, professional presentations with the power of artificial intelligence.

## ✨ Features

- **🤖 AI-Powered Content Generation**: Create complete presentations from simple prompts
- **🎨 Customizable Themes**: Choose from a variety of professional themes or create your own
- **🖼️ Rich Media Support**: Embed videos, charts, interactive elements, and forms
- **📐 Smart Layout Engine**: Automatically organize content for optimal visual impact
- **👥 Collaborative Editing**: Work together with your team in real-time
- **📤 Export Options**: Download as PDF, export to PowerPoint, or present directly from the web

## 📖 Table of Contents

- [Demo](#-demo)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
- [Self-Hosting & Deployment](#️-self-hosting--deployment)
- [Environment Configuration](#-environment-configuration)
- [Project Structure](#-project-structure)
- [Architecture](#️-architecture)
- [API](#-api)
- [CI/CD & Testing](#-cicd--testing)
- [Contributing](#-contributing)
- [License](#-license)

## 🎮 Demo

Visit our [live demo](https://demo-url-here.com) (coming soon) to experience the platform.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v8 or later)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- [Python](https://www.python.org/) (v3.9 or later, for AI service)

### Installation

1. Clone the repository

```bash
git clone https://github.com/marvelai-org/PresentationGenerator.git
cd PresentationGenerator
```

2. Install dependencies

```bash
npm ci
```

3. Create a `.env` file based on `.env.example`

```bash
cp .env.example .env
```

4. Update the environment variables with your own values

### Development

Start the development server:

```bash
npm run dev
```

This will start the application at [http://localhost:3000](http://localhost:3000).

Run tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

### AI Service

This repository includes a Python-based AI service for presentation generation:

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

The API will be available at `http://localhost:8000`.

## 🏗️ Self-Hosting & Deployment

### Docker Deployment

The easiest way to deploy the application is using Docker Compose:

1. Clone this repository
2. Configure your environment variables in a `.env` file (see [Environment Configuration](#-environment-configuration))
3. Run `docker-compose up -d`

The application will be available at `http://localhost:3000`.

For detailed deployment instructions, see [docs/deployment.md](docs/deployment.md).

### CI/CD Pipeline

The project includes GitHub Actions workflows for continuous integration and deployment:

- Automated linting and testing
- Build process for the Next.js application
- Docker image creation for easy deployment

All workflows are vendor-agnostic and focused on building, testing, and packaging the application for self-hosting.

## 🔧 Environment Configuration

Create a `.env` file in the root directory with the following variables (see `.env.example` for a template):

```
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication (Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# AI APIs
OPENAI_API_KEY="your-openai-api-key"
COHERE_API_KEY="your-cohere-api-key"

# Vector DB (Optional)
QDRANT_API_KEY="your-qdrant-api-key"
QDRANT_URL="your-qdrant-url"
```

For local development without Supabase credentials, you can enable mock authentication:

```bash
# Set CI_ENVIRONMENT to true in your .env file
echo "CI_ENVIRONMENT=true" >> .env
```

This enables the mock Supabase client which allows the application to function without real credentials.

## 📁 Project Structure

```
.
├── ai-services/         # Python-based AI service
├── docs/                # Documentation files
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/                 # Source code
│   ├── app/             # Next.js App Router routes
│   ├── components/      # Reusable React components
│   ├── lib/             # Utility functions and services
│   ├── providers/       # React context providers
│   ├── styles/          # Global styles
│   └── types/           # TypeScript type definitions
├── .env.example         # Example environment variables
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Docker configuration
└── README.md            # Project documentation
```

## 🏛️ Architecture

The project is built with a modern tech stack and architecture:

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes, Python FastAPI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **AI**: Integration with various AI models via AI service
- **Vector Storage**: Qdrant for embeddings (optional)

## 🔌 API

### AI Service

The AI service provides endpoints for generating and editing presentations:

- `GET /` - Health check endpoint
- `POST /generate-presentation` - Generates a presentation from a prompt
- `POST /edit-slide` - Edits a specific slide
- `POST /preview-slide` - Generates a preview image for a slide

Full API documentation is available when running the service at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🧪 CI/CD & Testing

### CI/CD Pipeline

The project includes GitHub Actions workflows for continuous integration and deployment:

- Automated linting and testing
- Build process for the Next.js application
- Docker image creation for easy deployment

All workflows are vendor-agnostic and focused on building, testing, and packaging the application for self-hosting.

### Authentication in CI Environment

For CI/CD environments, the project uses a mock authentication strategy that:

- Automatically detects CI environments
- Uses mock Supabase clients and dummy credentials
- Allows builds and tests to run without real authentication keys

For more information, see [docs/ci-cd-auth-mocking.md](docs/ci-cd-auth-mocking.md).

## 👥 Contributing

We welcome contributions! Please check out our [contribution guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by the AI Presentation Generator team</sub>
</div>
