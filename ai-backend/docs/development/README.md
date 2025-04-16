# Developer Documentation

This section contains documentation for developers working on the AI Backend codebase.

## Contents

- [Contributing](./contributing.md) - Guide for contributing to the project
- [Testing](./testing.md) - Testing procedures and best practices

## Development Environment

The AI Backend is built with:

- Python 3.10+
- FastAPI for the REST API
- Poetry for dependency management
- Pytest for testing

To set up your development environment, follow the instructions in the [Contributing](./contributing.md) guide.

## Project Structure

```
ai-backend/
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
│   ├── api/                 # API tests
│   ├── integration/         # Integration tests
│   └── conftest.py          # Pytest fixtures
└── scripts/                 # Utility scripts
```

## Code Style

The project follows:

- PEP 8 for Python code style
- Type hints for all function signatures
- Docstrings for all public functions and classes
- Absolute imports for consistency

We use `ruff` for linting. Run `ruff .` to check your code before submitting a pull request.

## Development Workflow

1. **Branch Management**
   - Use feature branches for all changes
   - Branch naming convention: `feature/feature-name` or `fix/issue-name`
   - Keep branches small and focused on a single feature or fix

2. **Code Quality**
   - Write tests before implementing features (TDD approach)
   - Maintain 80%+ test coverage for all new code
   - Document all public APIs with docstrings
   - Run static type checking with mypy

3. **CI/CD Pipeline**
   - All PRs trigger automated tests and linting
   - Failed CI checks block merging
   - PR reviews required before merging

4. **Dependency Management**
   - Use Poetry for dependency management
   - Pin dependencies with exact versions in production
   - Review and update dependencies monthly for security

## Performance Considerations

- Use async/await for I/O-bound operations
- Implement caching for frequent API calls
- Profile endpoints for response time optimization
- Consider using background tasks for long-running operations

## Security Best Practices

- Never commit secrets to version control
- Validate all user input
- Use proper CORS settings
- Implement rate limiting for all endpoints
- Use type hints to prevent type-related vulnerabilities